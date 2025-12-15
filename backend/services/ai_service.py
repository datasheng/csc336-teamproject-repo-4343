import os
from dotenv import load_dotenv
from database import get_db_connection
from datetime import datetime, timedelta

# Load environment variables
env_path = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), '.env')
load_dotenv(env_path)

# Try to import google generativeai, fall back to mock if not available
try:
    import google.generativeai as genai
    GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
    if GEMINI_API_KEY:
        genai.configure(api_key=GEMINI_API_KEY)
    HAS_GEMINI = GEMINI_API_KEY is not None
except ImportError:
    print("WARNING: google-generativeai not installed. Install with: pip install google-generativeai")
    HAS_GEMINI = False

def search_events_in_database(keywords=None, max_price=None, event_type=None):
    """
    Search for events in the database based on criteria
    
    Args:
        keywords: List of keywords to search in event names
        max_price: Maximum ticket price
        event_type: Type of event (music, tech, sports, food, etc.)
    
    Returns:
        List of matching events
    """
    try:
        conn = get_db_connection()
        if not conn:
            return []
        
        cursor = conn.cursor(dictionary=True)
        
        # Build query
        query = "SELECT * FROM EVENTS WHERE event_status = 'upcoming'"
        params = []
        
        # Filter by price
        if max_price is not None:
            query += " AND ticket_price <= %s"
            params.append(max_price)
        
        # Filter by event category (primary filter)
        if event_type:
            query += " AND event_category = %s"
            params.append(event_type)
        
        # Filter by keywords in event name (secondary filter)
        if keywords:
            keyword_conditions = []
            for keyword in keywords:
                keyword_conditions.append(f"event_name LIKE %s")
                params.append(f"%{keyword}%")
            if keyword_conditions:
                query += " AND (" + " OR ".join(keyword_conditions) + ")"
        
        query += " ORDER BY event_date ASC LIMIT 10"
        
        cursor.execute(query, params)
        events = cursor.fetchall()
        cursor.close()
        conn.close()
        
        return events if events else []
    
    except Exception as e:
        print(f"Error searching events: {e}")
        return []

def get_all_upcoming_events(limit=5):
    """
    Get all upcoming events from the database
    
    Args:
        limit: Maximum number of events to return
    
    Returns:
        List of upcoming events
    """
    try:
        conn = get_db_connection()
        if not conn:
            return []
        
        cursor = conn.cursor(dictionary=True)
        cursor.execute(
            "SELECT * FROM EVENTS WHERE event_status = 'upcoming' ORDER BY event_date ASC LIMIT %s",
            (limit,)
        )
        events = cursor.fetchall()
        cursor.close()
        conn.close()
        
        return events if events else []
    
    except Exception as e:
        print(f"Error fetching events: {e}")
        return []

def format_event_for_response(event):
    """Format event data for user-friendly display"""
    if isinstance(event['event_date'], str):
        event_date = event['event_date']
    else:
        event_date = event['event_date'].strftime("%B %d, %Y at %I:%M %p") if event['event_date'] else "TBD"
    
    price_text = f"${event['ticket_price']}" if event['ticket_price'] and event['ticket_price'] > 0 else "FREE"
    
    return {
        'id': event['event_id'],
        'name': event['event_name'],
        'date': event_date,
        'location': event['location'],
        'price': price_text,
        'attendees': event.get('max_attendees', 'Unlimited'),
        'status': event['event_status']
    }

def analyze_user_request(message):
    """
    Analyze user request to determine search criteria
    
    Returns:
        dict with search parameters
    """
    message_lower = message.lower()
    
    search_params = {
        'keywords': [],
        'max_price': None,
        'event_type': None
    }
    
    # Detect price constraints FIRST (before event types)
    # This prevents words like "show" from interfering with price detection
    if any(word in message_lower for word in ['free', 'no cost', 'zero price']):
        search_params['max_price'] = 0
    elif any(word in message_lower for word in ['cheap', 'affordable', 'budget', 'under $20', 'under 20']):
        search_params['max_price'] = 20
    elif any(word in message_lower for word in ['under $50', 'under 50']):
        search_params['max_price'] = 50
    
    # Detect event types
    event_types = {
        'music': ['music', 'concert', 'festival', 'band', 'dj', 'song'],
        'tech': ['tech', 'technology', 'coding', 'developer', 'startup', 'ai', 'programming', 'conference'],
        'sports': ['sport', 'game', 'match', 'football', 'basketball', 'soccer', 'baseball', 'tournament'],
        'food': ['food', 'cooking', 'dinner', 'restaurant', 'cooking', 'cuisine', 'taste', 'culinary', 'chef'],
        'art': ['art', 'painting', 'gallery', 'exhibition', 'artist', 'craft'],
        'culture': ['cultural', 'culture', 'performance', 'theater', 'dance', 'musical'],
        'business': ['business', 'workshop', 'seminar', 'training', 'career', 'networking'],
    }
    
    for event_type, keywords in event_types.items():
        if any(keyword in message_lower for keyword in keywords):
            search_params['event_type'] = event_type
            search_params['keywords'].extend(keywords[:2])  # Add first 2 keywords
            break
    
    # Add keywords for location/venue if mentioned
    locations = ['downtown', 'park', 'center', 'hall', 'garden', 'beach']
    for location in locations:
        if location in message_lower:
            search_params['keywords'].append(location)
    
    return search_params

def generate_ai_response(message, context=""):
    """
    Generate a response using AI for event recommendations
    
    Args:
        message: User's message/question
        context: Additional context (user preferences, etc.)
    
    Returns:
        dict: Contains 'response' and 'recommended_events'
    """
    try:
        # Analyze the request to understand what the user wants
        search_params = analyze_user_request(message)
        recommended_events = []
        
        # Search for events based on the request
        if search_params['event_type'] or search_params['keywords'] or search_params['max_price'] is not None:
            recommended_events = search_events_in_database(
                keywords=search_params['keywords'] if search_params['keywords'] else None,
                max_price=search_params['max_price'],
                event_type=search_params['event_type']
            )
        else:
            # If no specific criteria, get all upcoming events
            recommended_events = get_all_upcoming_events(limit=5)
        
        # Format events for response
        formatted_events = [format_event_for_response(event) for event in recommended_events]
        
        # Generate response message
        response_message = generate_response_message(message, formatted_events, search_params)
        
        return {
            "response": response_message,
            "recommended_events": formatted_events
        }
    
    except Exception as e:
        print(f"Error generating AI response: {e}")
        return {
            "response": "I'm having trouble finding events right now. Please try again in a moment!",
            "recommended_events": [],
            "error": str(e)
        }

def generate_response_message(user_message, events, search_params):
    """
    Generate a natural language response based on search results
    """
    message_lower = user_message.lower()
    
    if not events:
        # No events found
        if search_params['event_type']:
            return f"I couldn't find any {search_params['event_type']} events matching your criteria right now. Try browsing all upcoming events!"
        elif search_params['max_price'] is not None and search_params['max_price'] == 0:
            return "No free events available at the moment. Check out our other affordable events!"
        else:
            return "No events match your request right now. Try adjusting your search criteria!"
    
    # Events found
    event_count = len(events)
    
    if event_count == 1:
        event = events[0]
        return f"Great! I found a perfect event for you: **{event['name']}** on {event['date']} at {event['location']}. Price: {event['price']}. Would you like to register for it?"
    else:
        price_info = ""
        if search_params['max_price'] is not None:
            price_info = f" under ${search_params['max_price']}" if search_params['max_price'] > 0 else " for free"
        
        type_info = f"{search_params['event_type']} " if search_params['event_type'] else ""
        
        return f"Awesome! I found {event_count} {type_info}events{price_info} that match your interests! Here are the top recommendations:\n" + \
               "\n".join([f"• **{e['name']}** - {e['date']} @ {e['location']} ({e['price']})" for e in events[:3]]) + \
               "\n\nClick on any event to register or get more details!"

