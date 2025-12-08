from flask import Blueprint, request, jsonify
from database import get_db_connection

orgs_bp = Blueprint('organizations', __name__)

@orgs_bp.post("/")
def create_org():
    try:
        data = request.json
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute (
            "INSERT INTO ORGANIZATIONS (org_name, address, email, is_premium) VALUES (%s, %s, %s, %s)",
            (data["org_name"], data.get("address"), data["email"], data.get("is_premium", False))
        )
        conn.commit()
        org_id = cursor.lastrowid
        cursor.close()
        conn.close()

        return jsonify({"message": "Organization created successfully", "org_id": org_id}), 201
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@orgs_bp.get("/")
def get_all_orgs():
    try:
        conn = get_db_connection()
        cursor = conn.cursor(dictionary=True)
        cursor.execute("SELECT * FROM ORGANIZATIONS")
        orgs = cursor.fetchall()
        cursor.close()
        conn.close()
        return jsonify(orgs)
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    
@orgs_bp.get("/<int:org_id>")
def get_org(org_id):
    try:
        conn = get_db_connection()
        cursor = conn.cursor(dictionary=True)
        cursor.execute("SELECT * FROM ORGANIZATIONS WHERE org_id = %s", (org_id,))
        org = cursor.fetchone()
        cursor.close()
        conn.close()
        if org:
            return jsonify(org)
        else:
            return jsonify({"error": "Organization not found"}), 404
    
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    
@orgs_bp.put("/<int:org_id>")
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
    
@orgs_bp.delete("/<int:org_id>")
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