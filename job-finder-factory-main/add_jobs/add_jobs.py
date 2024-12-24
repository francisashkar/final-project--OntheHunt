import pandas as pd
from pymongo.mongo_client import MongoClient
from pymongo.server_api import ServerApi

# MongoDB connection URI (replace <db_password> with your actual password)
uri = "mongodb+srv://ashkarfrancis1:frafra45@cluster0.jbpov.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"

# Connect to MongoDB
client = MongoClient(uri, server_api=ServerApi('1'))
db = client["jobfinder"]  # Replace with your database name
job_collection = db["python"]  # Replace with your collection name

# Read data from the CSV file
csv_file_path = r"C:\Users\Ashka\Downloads\jobfinder\job-finder-factory-main\add_jobs\secrethunter.csv"
try:
    job_data = pd.read_csv(csv_file_path)
    print("CSV data loaded successfully!")
except Exception as e:
    print(f"Error loading CSV file: {e}")
    exit()

# Convert DataFrame to a list of dictionaries
job_list = job_data.to_dict(orient="records")

# Insert data into MongoDB
try:
    job_collection.insert_many(job_list)
    print(f"Inserted {len(job_list)} records into MongoDB!")
except Exception as e:
    print(f"Error inserting data into MongoDB: {e}")
