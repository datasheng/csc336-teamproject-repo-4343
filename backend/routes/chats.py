from flask import Blueprint, request, jsonify
from database import get_db_connection
from services.ai_service import generate_ai_response

chats_bp = Blueprint('chats', __name__)

@chats_bp.post("/", strict_slashes=False)
def create_chat():
    try:
        data = request.json
        message = data.get("message")
        user_id = data.get("user_id")  # Optional - users can chat without being logged in
        
        if not message:
            return jsonify({"error": "Message is required"}), 400
        
        # Generate AI response
        ai_response = generate_ai_response(message)
        
        # Try to store chat in database (optional - don't fail if DB is down)
        try:
            conn = get_db_connection()
            if conn:
                cursor = conn.cursor()
                try:
                    # Only store if user_id is provided (optional)
                    if user_id:
                        cursor.execute (
                            "INSERT INTO CHAT_HISTORY (user_id, message, response) VALUES (%s, %s, %s)",
                            (user_id, message, ai_response.get("response"))
                        )
                    else:
                        # Skip database insertion if no user_id
                        print(f"Skipping database insert - no user_id provided")
                    conn.commit()
                except Exception as db_error:
                    print(f"Database insert error: {db_error}")
                finally:
                    cursor.close()
                    conn.close()
        except Exception as db_conn_error:
            print(f"Database connection error: {db_conn_error}")
        
        # Always return AI response regardless of database status
        return jsonify({
            "response": ai_response.get("response"),
            "recommended_events": ai_response.get("recommended_events", []),
            "message": "Chat processed successfully"
        }), 200
    
    except Exception as e:
        print(f"Error in create_chat: {e}")
        return jsonify({
            "response": "I'm having trouble connecting right now. Please try again in a moment!",
            "error": str(e)
        }), 500

@chats_bp.get("/", strict_slashes=False)
def get_all_chats():
    try:
        conn = get_db_connection()
        if not conn:
            return jsonify({"error": "Database connection failed"}), 500
        cursor = conn.cursor(dictionary=True)
        cursor.execute("SELECT * FROM CHAT_HISTORY")
        chats = cursor.fetchall()
        cursor.close()
        conn.close()
        return jsonify(chats)
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    
@chats_bp.get("/<int:chat_id>", strict_slashes=False)
def get_chat(chat_id):
    try:
        conn = get_db_connection()
        if not conn:
            return jsonify({"error": "Database connection failed"}), 500
        cursor = conn.cursor(dictionary=True)
        cursor.execute("SELECT * FROM CHAT_HISTORY WHERE chat_id = %s", (chat_id,))
        chat = cursor.fetchone()
        cursor.close()
        conn.close()
        if chat:
            return jsonify(chat)
        else:
            return jsonify({"error": "Chat not found"}), 404
    
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@chats_bp.put("/<int:chat_id>", strict_slashes=False)
def update_chat(chat_id):
    try:
        data = request.json
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute (
            "UPDATE CHAT_HISTORY SET user_id = %s, message = %s, response = %s, recommended_event_id = %s WHERE chat_id = %s",
            (data["user_id"], data["message"], data["response"], data.get("recommended_event_id"), chat_id)
        )
        conn.commit()
        cursor.close()
        conn.close()
        return jsonify({"message": "Chat updated successfully"})
    
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@chats_bp.delete("/<int:chat_id>", strict_slashes=False)
def delete_chat(chat_id):
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute("DELETE FROM CHAT_HISTORY WHERE chat_id = %s", (chat_id,))
        conn.commit()
        cursor.close()
        conn.close()
        return jsonify({"message": "Chat deleted successfully"})
    
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@chats_bp.get("/recommended/<int:event_id>", strict_slashes=False)
def get_chats_by_recommended_event(event_id):
    try:
        conn = get_db_connection()
        cursor = conn.cursor(dictionary=True)
        cursor.execute("SELECT * FROM CHAT_HISTORY WHERE recommended_event_id = %s", (event_id,))
        chats = cursor.fetchall()
        cursor.close()
        conn.close()
        return jsonify(chats)
    
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@chats_bp.get("/by_user/<int:user_id>", strict_slashes=False)
def get_chats_by_user(user_id):
    try:
        conn = get_db_connection()
        cursor = conn.cursor(dictionary=True)
        cursor.execute("SELECT * FROM CHAT_HISTORY WHERE user_id = %s", (user_id,))
        chats = cursor.fetchall()
        cursor.close()
        conn.close()
        return jsonify(chats)
    
    except Exception as e:
        return jsonify({"error": str(e)}), 500