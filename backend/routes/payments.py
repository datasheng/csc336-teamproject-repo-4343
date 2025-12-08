from flask import Blueprint, request, jsonify
from database import get_db_connection

payments_bp = Blueprint('payments', __name__)

@payments_bp.post("/")
def create_payment():
    try:
        data = request.json
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute (
            "INSERT INTO PAYMENTS (user_id, amount, platform_fee, payment_method) VALUES (%s, %s, %s, %s)",
            (data["user_id"], data["amount"], data["platform_fee"], data["payment_method"])
        )
        conn.commit()
        payment_id = cursor.lastrowid
        cursor.close()
        conn.close()

        return jsonify({"message": "Payment created successfully", "payment_id": payment_id}), 201
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@payments_bp.get("/")
def get_payments():
    try:
        conn = get_db_connection()
        cursor = conn.cursor(dictionary=True)
        cursor.execute("SELECT * FROM PAYMENTS")
        payments = cursor.fetchall()
        cursor.close()
        conn.close()
        return jsonify(payments)
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    
@payments_bp.get("/<int:payment_id>")
def get_payment(payment_id):
    try:
        conn = get_db_connection()
        cursor = conn.cursor(dictionary=True)
        cursor.execute("SELECT * FROM PAYMENTS WHERE payment_id = %s", (payment_id,))
        payment = cursor.fetchone()
        cursor.close()
        conn.close()
        if payment:
            return jsonify(payment)
        else:
            return jsonify({"error": "Payment not found"}), 404
    
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    
@payments_bp.put("/<int:payment_id>")
def update_payment(payment_id):
    try:
        data = request.json
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute (
            "UPDATE PAYMENTS SET user_id = %s, amount = %s, platform_fee = %s, payment_method = %s WHERE payment_id = %s",
            (data["user_id"], data["amount"], data["platform_fee"], data["payment_method"], payment_id)
        )
        conn.commit()
        cursor.close()
        conn.close()
        return jsonify({"message": "Payment updated successfully"})
    
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@payments_bp.delete("/<int:payment_id>")
def delete_payment(payment_id):
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute("DELETE FROM PAYMENTS WHERE payment_id = %s", (payment_id,))
        conn.commit()
        cursor.close()
        conn.close()
        return jsonify({"message": "Payment deleted successfully"})
    
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@payments_bp.get("/by_user/<int:user_id>")
def get_payments_by_user(user_id):
    try:
        conn = get_db_connection()
        cursor = conn.cursor(dictionary=True)
        cursor.execute("SELECT * FROM PAYMENTS WHERE user_id = %s", (user_id,))
        payments = cursor.fetchall()
        cursor.close()
        conn.close()
        return jsonify(payments)
    
    except Exception as e:
        return jsonify({"error": str(e)}), 500