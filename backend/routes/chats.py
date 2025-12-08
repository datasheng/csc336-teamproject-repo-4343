from flask import Blueprint, request, jsonify
from database import get_db_connection

chats_bp = Blueprint('chats', __name__)

@chats_bp.post("/")
def create_chat():
    try:
        data = request.json
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute (
            "INSERT INTO CHAT_HISTORY (user_id, message, response, recommended_event_id) VALUES (%s,%s, %s, %s)",
            (data["user_id"], data["message"], data["response"], data.get("recommended_event_id"))
        )
        conn.commit()
        cursor.close()
        chat_id = cursor.lastrowid
        conn.close()
        return jsonify({"message": "Chat created successfully", "chat_id": chat_id}), 201
    
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@chats_bp.get("/")
def get_all_chats():
    try:
        conn = get_db_connection()
        cursor = conn.cursor(dictionary=True)
        cursor.execute("SELECT * FROM CHAT_HISTORY")
        chats = cursor.fetchall()
        cursor.close()
        conn.close()
        return jsonify(chats)
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    
@chats_bp.get("/<int:chat_id>")
def get_chat(chat_id):
    try:
        conn = get_db_connection()
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

@chats_bp.put("/<int:chat_id>")
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

@chats_bp.delete("/<int:chat_id>")
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

@chats_bp.get("/recommended/<int:event_id>")
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

@chats_bp.get("/by_user/<int:user_id>")
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