import os
from dotenv import load_dotenv

# Load environment variables 
load_dotenv()


SECRET_KEY = os.getenv('SECRET_KEY', 'dev-secret-key-change-in-production')
