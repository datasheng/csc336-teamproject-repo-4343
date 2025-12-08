from flask import Blueprint, request, jsonify
from database import get_db_connection

users_bp = Blueprint('users', __name__)

@users_bp.post("/")
def create_user():
    try:
        data = request.json
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute (
            "INSERT INTO USERS (user_name, email, password, is_vip) VALUES (%s, %s, %s, %s)",
            (data["user_name"], data["email"], data["password"], data.get("is_vip", False))
        )
        conn.commit()
        user_id = cursor.lastrowid
        cursor.close()
        conn.close()

        return jsonify({"message": "User created successfully", "user_id": user_id}), 201
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@users_bp.get("/")
def get_users():
    try:
        conn = get_db_connection()
        cursor = conn.cursor(dictionary=True)
        cursor.execute("SELECT * FROM USERS")
        users = cursor.fetchall()
        cursor.close()
        conn.close()
        return jsonify(users)
    
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    
@users_bp.get("/<int:user_id>")
def get_user(user_id):
    try:
        conn = get_db_connection()
        cursor = conn.cursor(dictionary=True)
        cursor.execute("SELECT * FROM USERS WHERE user_id = %s", (user_id,))
        user = cursor.fetchone()
        cursor.close()
        conn.close()
        if user:
            return jsonify(user)
        else:
            return jsonify({"error": "User not found"}), 404
    
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@users_bp.get("/by_email")
def get_user_by_email():
    email = request.args.get("email")
    try:
        conn = get_db_connection()
        cursor = conn.cursor(dictionary=True)
        cursor.execute("SELECT * FROM USERS WHERE email = %s", (email,))
        user = cursor.fetchone()
        cursor.close()
        conn.close()
        if user:
            return jsonify(user)
        else:
            return jsonify({"error": "User not found"}), 404
    
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    
@users_bp.put("/<int:user_id>")
def update_user(user_id):
    try:
        data = request.json
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute (
            "UPDATE USERS SET user_name = %s, email = %s, password = %s, is_vip = %s WHERE user_id = %s",
            (data["user_name"], data["email"], data["password"], data.get("is_vip", False), user_id)
        )
        conn.commit()
        cursor.close()
        conn.close()
        return jsonify({"message": "User updated successfully"})
    
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@users_bp.delete("/<int:user_id>")
def delete_user(user_id):
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute("DELETE FROM USERS WHERE user_id = %s", (user_id,))
        conn.commit()
        cursor.close()
        conn.close()
        return jsonify({"message": "User deleted successfully"})
    
    except Exception as e:
        return jsonify({"error": str(e)}), 500