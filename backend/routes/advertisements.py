from flask import Blueprint, request, jsonify
from database import get_db_connection

advertisements_bp = Blueprint('advertisements', __name__)

@advertisements_bp.post("/", strict_slashes=False)
def create_advertisements():
    try:
        data = request.json
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute (
            "INSERT INTO ADVERTISEMENTS (advertiser_name, advertisement_type, event_id, start_date, end_date, cost, status) VALUES (%s, %s, %s, %s, %s, %s, %s)",
            (data["advertiser_name"], data.get("advertisement_type", "banner"), data["event_id"], data["start_date"], data["end_date"], data["cost"], data.get("status", "active"))
        )
        conn.commit()
        cursor.close()
        advertisement_id = cursor.lastrowid
        conn.close()
        return jsonify({"message": "Advertisement created successfully", "advertisement_id": advertisement_id}), 201
    
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@advertisements_bp.get("/", strict_slashes=False)
def get_all_advertisements():
    try:
        conn = get_db_connection()
        cursor = conn.cursor(dictionary=True)
        cursor.execute("SELECT * FROM ADVERTISEMENTS")
        advertisements = cursor.fetchall()
        cursor.close()
        conn.close()
        return jsonify(advertisements)
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    
@advertisements_bp.get("/<int:advertisement_id>", strict_slashes=False)
def get_advertisement(advertisement_id):
    try:
        conn = get_db_connection()
        cursor = conn.cursor(dictionary=True)
        cursor.execute("SELECT * FROM ADVERTISEMENTS WHERE advertisement_id = %s", (advertisement_id,))
        advertisement = cursor.fetchone()
        cursor.close()
        conn.close()
        if advertisement:
            return jsonify(advertisement)
        else:
            return jsonify({"error": "Advertisement not found"}), 404
    
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@advertisements_bp.put("/<int:advertisement_id>", strict_slashes=False)
def update_advertisement(advertisement_id):
    try:
        data = request.json
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute(
            "UPDATE ADVERTISEMENTS SET advertiser_name = %s, advertisement_type = %s, event_id = %s, start_date = %s, end_date = %s, cost = %s, status = %s WHERE advertisement_id = %s",
            (data["advertiser_name"], data.get("advertisement_type", "banner"), data["event_id"], data["start_date"], data["end_date"], data["cost"], data.get("status", "active"), advertisement_id)
        )
        conn.commit()
        cursor.close()
        conn.close()
        return jsonify({"message": "Advertisement updated successfully"})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@advertisements_bp.delete("/<int:advertisement_id>", strict_slashes=False)
def delete_advertisement(advertisement_id):
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute("DELETE FROM ADVERTISEMENTS WHERE advertisement_id = %s", (advertisement_id,))
        conn.commit()
        cursor.close()
        conn.close()
        return jsonify({"message": "Advertisement deleted successfully"})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@advertisements_bp.get("/by_event/<int:event_id>", strict_slashes=False)
def get_advertisements_by_event(event_id):
    try:
        conn = get_db_connection()
        cursor = conn.cursor(dictionary=True)
        cursor.execute("SELECT * FROM ADVERTISEMENTS WHERE event_id = %s", (event_id,))
        advertisements = cursor.fetchall()
        cursor.close()
        conn.close()
        return jsonify(advertisements)
    except Exception as e:
        return jsonify({"error": str(e)}), 500