from flask import Blueprint, request, jsonify
from database import get_db_connection
import jwt
from datetime import datetime, timedelta
import config

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

        # Generate token for new user
        token = jwt.encode({
            'user_id': user_id,
            'email': data["email"],
            'exp': datetime.utcnow() + timedelta(hours=24)
        }, config.SECRET_KEY, algorithm='HS256')

        return jsonify({"message": "User created successfully", "user_id": user_id, "token": token}), 201
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

@users_bp.post("/login")
def login_user():
    try:
        data = request.json
        email = data.get("email")
        password = data.get("password")
        
        if not email or not password:
            return jsonify({"error": "Email and password required"}), 400
        
        conn = get_db_connection()
        cursor = conn.cursor(dictionary=True)
        cursor.execute("SELECT * FROM USERS WHERE email = %s", (email,))
        user = cursor.fetchone()
        cursor.close()
        conn.close()
        
        if user and user["password"] == password:
            # Remove password from response
            user_data = {k: v for k, v in user.items() if k != "password"}
            # Generate JWT token
            token = jwt.encode({
                'user_id': user['user_id'],
                'email': user['email'],
                'exp': datetime.utcnow() + timedelta(hours=24)
            }, config.SECRET_KEY, algorithm='HS256')
            return jsonify({"message": "Login successful", "user": user_data, "token": token}), 200
        else:
            return jsonify({"error": "Invalid email or password"}), 401
    
    except Exception as e:
        return jsonify({"error": str(e)}), 500