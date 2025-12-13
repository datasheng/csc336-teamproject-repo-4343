from flask import Flask
from flask_cors import CORS
from database import get_db_connection
from routes.users import users_bp
from routes.organizations import orgs_bp
from routes.events import events_bp
from routes.tickets import tickets_bp
from routes.payments import payments_bp
from routes.chats import chats_bp
from routes.advertisements import advertisements_bp
import config

def create_app():
    app = Flask(__name__)
    CORS(app)

    # Register blueprints
    app.register_blueprint(users_bp, url_prefix='/api/users')
    app.register_blueprint(orgs_bp, url_prefix='/api/organizations')
    app.register_blueprint(events_bp, url_prefix='/api/events')
    app.register_blueprint(tickets_bp, url_prefix='/api/tickets')
    app.register_blueprint(payments_bp, url_prefix='/api/payments')
    app.register_blueprint(chats_bp, url_prefix='/api/chats')
    app.register_blueprint(advertisements_bp, url_prefix='/api/advertisements')

    @app.get("/")
    def home():
        return {
            "message": "TicketR API is running",
            "endpoints": {
                "users": "/api/users",
                "organizations": "/api/organizations",
                "events": "/api/events",
                "tickets": "/api/tickets",
                "payments": "/api/payments",
                "auth": "/api/auth",
                "chats": "/api/chats",
                "advertisements": "/api/advertisements"
            }
        }

    @app.get("/test-db")
    def test_db():
        conn = get_db_connection()
        if conn is None:
            return {"error": "Database connection failed"}, 500
        cursor = conn.cursor()
        cursor.execute("SELECT DATABASE();")
        db_name = cursor.fetchone()
        cursor.close()
        conn.close()
        return {"database": db_name[0]}

    return app

if __name__ == "__main__":
    app = create_app()
    app.run(debug=True)