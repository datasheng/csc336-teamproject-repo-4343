import mysql.connector

def get_db_connection():
    try:
        connection = mysql.connector.connect(
        host="localhost",
        user="appuser",
        password="DaSdj3Asa16",
        database="Ticketr"
        )
        return connection
    
    except mysql.connector.Error as err:
        print(f"Connection Error: {err}")
        return None