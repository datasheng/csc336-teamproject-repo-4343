from flask import Blueprint, request, jsonify
from database import get_db_connection

events_bp = Blueprint('events', __name__)

@events_bp.post("/", strict_slashes=False)
def create_event():
    try:
        data = request.json
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute (
            "INSERT INTO EVENTS (org_id, event_name, event_date, location, max_attendees, ticket_price, event_category, event_status, is_sponsored, sponsor_name, vip_access_time, general_access_time) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)",
            (data["org_id"], data["event_name"], data["event_date"], data["location"], data.get("max_attendees"), data["ticket_price"], data.get("event_category", "other"), data.get("event_status", "upcoming"), data.get("is_sponsored", False), data.get("sponsor_name"), data.get("vip_access_time"), data.get("general_access_time"))
        )
        conn.commit()
        cursor.close()
        event_id = cursor.lastrowid
        conn.close()
        return jsonify({"message": "Event created successfully", "event_id": event_id}), 201
    
    except Exception as e:
        print(f"Error creating event: {str(e)}")
        return jsonify({"error": str(e)}), 500

@events_bp.get("/", strict_slashes=False)
def get_all_events():
    try:
        conn = get_db_connection()
        if not conn:
            return jsonify({"error": "Database connection failed"}), 500
        cursor = conn.cursor(dictionary=True)
        cursor.execute("SELECT * FROM EVENTS")
        events = cursor.fetchall()
        cursor.close()
        conn.close()
        return jsonify(events)
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    
@events_bp.get("/<int:event_id>", strict_slashes=False)
def get_event(event_id):
    try:
        conn = get_db_connection()
        if not conn:
            return jsonify({"error": "Database connection failed"}), 500
        cursor = conn.cursor(dictionary=True)
        cursor.execute("SELECT * FROM EVENTS WHERE event_id = %s", (event_id,))
        event = cursor.fetchone()
        cursor.close()
        conn.close()
        if event:
            return jsonify(event)
        else:
            return jsonify({"error": "Event not found"}), 404
    
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    
@events_bp.put("/<int:event_id>", strict_slashes=False)
def update_event(event_id):
    try:
        data = request.json
        conn = get_db_connection()
        if not conn:
            return jsonify({"error": "Database connection failed"}), 500
        cursor = conn.cursor()
        cursor.execute (
            "UPDATE EVENTS SET org_id = %s, event_name = %s, event_date = %s, location = %s, max_attendees = %s, ticket_price = %s, event_category = %s, event_status = %s, is_sponsored = %s, sponsor_name = %s, vip_access_time = %s, general_access_time = %s WHERE event_id = %s",
            (data["org_id"], data["event_name"], data["event_date"], data["location"], data.get("max_attendees"), data["ticket_price"], data.get("event_category", "other"), data.get("event_status", "upcoming"), data.get("is_sponsored", False), data["sponsor_name"], data["vip_access_time"], data.get("general_access_time"), event_id)
        )
        conn.commit()
        cursor.close()
        conn.close()
        return jsonify({"message": "Event updated successfully"})
    
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@events_bp.delete("/<int:event_id>", strict_slashes=False)
def delete_event(event_id):
    try:
        conn = get_db_connection()
        if not conn:
            return jsonify({"error": "Database connection failed"}), 500
        cursor = conn.cursor()
        
        # First, delete all tickets associated with this event
        cursor.execute("DELETE FROM tickets WHERE event_id = %s", (event_id,))
        
        # Then delete the event
        cursor.execute("DELETE FROM EVENTS WHERE event_id = %s", (event_id,))
        conn.commit()
        
        # Check if event was deleted
        if cursor.rowcount == 0:
            cursor.close()
            conn.close()
            return jsonify({"error": "Event not found"}), 404
        
        cursor.close()
        conn.close()
        return jsonify({"message": "Event deleted successfully", "event_id": event_id}), 200
    
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    
@events_bp.get("/by_org/<int:org_id>", strict_slashes=False)
def get_events_by_org(org_id):
    try:
        conn = get_db_connection()
        if not conn:
            return jsonify({"error": "Database connection failed"}), 500
        cursor = conn.cursor(dictionary=True)
        cursor.execute("SELECT * FROM EVENTS WHERE org_id = %s", (org_id,))
        events = cursor.fetchall()
        cursor.close()
        conn.close()
        return jsonify(events)
    
    except Exception as e:
        return jsonify({"error": str(e)}), 500
