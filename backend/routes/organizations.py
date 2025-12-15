from flask import Blueprint, request, jsonify
from database import get_db_connection
import jwt
from datetime import datetime, timedelta
import config

orgs_bp = Blueprint('organizations', __name__)

@orgs_bp.post("/", strict_slashes=False)
def create_org():
    try:
        data = request.json
        conn = get_db_connection()
        if not conn:
            return jsonify({"error": "Database connection failed"}), 500
        cursor = conn.cursor()
        cursor.execute (
            "INSERT INTO ORGANIZATIONS (org_name, address, email, is_premium, password) VALUES (%s, %s, %s, %s, %s)",
            (data["org_name"], data.get("address"), data["email"], data.get("is_premium", False), data["password"])
        )
        conn.commit()
        org_id = cursor.lastrowid
        cursor.close()
        conn.close()

        return jsonify({"message": "Organization created successfully", "org_id": org_id}), 201
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@orgs_bp.get("/", strict_slashes=False)
def get_all_orgs():
    try:
        conn = get_db_connection()
        if not conn:
            return jsonify({"error": "Database connection failed"}), 500
        cursor = conn.cursor(dictionary=True)
        cursor.execute("SELECT * FROM ORGANIZATIONS")
        orgs = cursor.fetchall()
        cursor.close()
        conn.close()
        return jsonify(orgs)
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    
@orgs_bp.post("/login", strict_slashes=False)
def login_org():
    try:
        data = request.json
        email = data.get("email")
        password = data.get("password")
        
        if not email or not password:
            return jsonify({"error": "Email and password required"}), 400
        
        conn = get_db_connection()
        if not conn:
            print(f"Database connection failed for login attempt: {email}")
            return jsonify({"error": "Database connection failed"}), 500
        
        cursor = conn.cursor(dictionary=True)
        cursor.execute("SELECT * FROM ORGANIZATIONS WHERE email = %s", (email,))
        org = cursor.fetchone()
        cursor.close()
        conn.close()
        
        if org and org["password"] == password:
            # Remove password from response
            org_data = {k: v for k, v in org.items() if k != "password"}
            # Generate JWT token
            token = jwt.encode({
                'org_id': org['org_id'],
                'email': org['email'],
                'exp': datetime.utcnow() + timedelta(hours=24)
            }, config.SECRET_KEY, algorithm='HS256')
            return jsonify({"message": "Login successful", "org": org_data, "token": token}), 200
        else:
            return jsonify({"error": "Invalid email or password"}), 401
    
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    
@orgs_bp.put("/<int:org_id>", strict_slashes=False)
def update_org(org_id):
    try:
        data = request.json
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute (
            "UPDATE ORGANIZATIONS SET org_name = %s, address = %s, email = %s, is_premium = %s WHERE org_id = %s",
            (data["org_name"], data.get("address"), data["email"], data.get("is_premium", False), org_id)
        )
        conn.commit()
        cursor.close()
        conn.close()
        return jsonify({"message": "Organization updated successfully"})
    
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    
@orgs_bp.delete("/<int:org_id>", strict_slashes=False)
def delete_org(org_id):
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute("DELETE FROM ORGANIZATIONS WHERE org_id = %s", (org_id,))
        conn.commit()
        cursor.close()
        conn.close()
        return jsonify({"message": "Organization deleted successfully"})
    
    except Exception as e:
        return jsonify({"error": str(e)}), 500