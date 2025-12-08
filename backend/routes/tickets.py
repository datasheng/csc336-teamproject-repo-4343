from flask import Blueprint, request, jsonify
from database import get_db_connection

tickets_bp = Blueprint('tickets', __name__)

@tickets_bp.post("/")
def create_ticket():
    data = request.json

    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute (
            "INSERT INTO tickets (event_id, user_id, ticket_status, qr_code, purchase_date, check_in_time, purchase_source) VALUES (%s, %s, %s, %s, %s, %s, %s)",
            (data["event_id"], data["user_id"], data.get("ticket_status", "active"), data["qr_code"], data["purchase_date"], data["check_in_time"], data.get("purchase_source", "direct"))
        )
        conn.commit()
        ticket_id = cursor.lastrowid
        cursor.close()
        conn.close()
        return jsonify({"message": "Ticket created successfully", "ticket_id": ticket_id}), 201
    
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@tickets_bp.get("/")
def get_tickets():
    try:
        conn = get_db_connection()
        cursor = conn.cursor(dictionary=True)
        cursor.execute("SELECT ticket_id, event_id, user_id, ticket_status, qr_code, purchase_date, check_in_time, purchase_source FROM tickets")
        tickets = cursor.fetchall()
        cursor.close()
        conn.close()
        return jsonify(tickets)
    
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    
@tickets_bp.get("/<int:ticket_id>")
def get_ticket(ticket_id):
    try:
        conn = get_db_connection()
        cursor = conn.cursor(dictionary=True)
        cursor.execute("SELECT * FROM tickets WHERE ticket_id = %s", (ticket_id,))
        ticket = cursor.fetchone()
        cursor.close()
        conn.close()
        if ticket:
            return jsonify(ticket)
        else:
            return jsonify({"error": "Ticket not found"}), 404
    
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    
@tickets_bp.put("/<int:ticket_id>")
def update_ticket(ticket_id):
    try:
        data = request.json
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute (
            "UPDATE tickets SET event_id = %s, user_id = %s, ticket_status = %s, qr_code = %s, purchase_date = %s, check_in_time = %s, purchase_source = %s WHERE ticket_id = %s",
            (data["event_id"], data["user_id"], data["ticket_status"], data["qr_code"], data["purchase_date"], data["check_in_time"], data["purchase_source"], ticket_id)
        )
        conn.commit()
        cursor.close()
        conn.close()
        return jsonify({"message": "Ticket updated successfully"})
    
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@tickets_bp.delete("/<int:ticket_id>")
def delete_ticket(ticket_id):
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute("DELETE FROM tickets WHERE ticket_id = %s", (ticket_id,))
        conn.commit()
        cursor.close()
        conn.close()
        return jsonify({"message": "Ticket deleted successfully"})
    
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    
@tickets_bp.get("/event/<int:event_id>")
def get_tickets_by_event(event_id):
    try:
        conn = get_db_connection()
        cursor = conn.cursor(dictionary=True)
        cursor.execute("SELECT * FROM tickets WHERE event_id = %s", (event_id,))
        tickets = cursor.fetchall()
        cursor.close()
        conn.close()
        return jsonify(tickets)
    
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    
@tickets_bp.get("/by_user/<int:user_id>")
def get_tickets_by_user(user_id):
    try:
        conn = get_db_connection()
        cursor = conn.cursor(dictionary=True)
        cursor.execute("SELECT * FROM tickets WHERE user_id = %s", (user_id,))
        tickets = cursor.fetchall()
        cursor.close()
        conn.close()
        return jsonify(tickets)
    
    except Exception as e:
        return jsonify({"error": str(e)}), 500