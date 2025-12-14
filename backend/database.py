import mysql.connector
import os
from dotenv import load_dotenv
load_dotenv()
def get_db_connection():
    try:
        connection = mysql.connector.connect(
        host=os.getenv("DB_HOST"),
        user=os.getenv("DB_USER"),
        password=os.getenv("DB_PASSWORD"),
        database=os.getenv("DB_NAME"),
        connection_timeout=10
        )
        return connection
    
    except mysql.connector.Error as err:
        print(f"Connection Error: {err}")
        return None