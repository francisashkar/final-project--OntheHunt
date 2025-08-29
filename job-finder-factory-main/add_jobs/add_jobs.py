import pandas as pd
import numpy as np
from pymongo.mongo_client import MongoClient
from pymongo.server_api import ServerApi

# MongoDB connection URI
uri = "mongodb+srv://ashkarfrancis1:Nabill55@cluster0.jbpov.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"

# Connect to MongoDB
client = MongoClient(uri, server_api=ServerApi('1'))
db = client["jobfinder"]
job_collection = db["python"]

# Read data from the CSV file
csv_file_path = r"C:\Users\Ashka\final-project--OntheHunt 1.0\job-finder-factory-main\add_jobs\secrethunter.csv"
try:
    job_data = pd.read_csv(csv_file_path)
    print("CSV data loaded successfully!")
    print(f"Original data shape: {job_data.shape}")
    print("Original columns:", list(job_data.columns))
except Exception as e:
    print(f"Error loading CSV file: {e}")
    exit()

# Clean the data - remove rows with all NaN values and replace remaining NaN with empty strings
job_data = job_data.dropna(how='all')  # Remove rows where all columns are NaN
job_data = job_data.fillna('')  # Replace remaining NaN values with empty strings

# Fix column names to match what the backend expects
column_mapping = {
    'Company': 'company',  # Fix the capitalization
    'Title': 'Title',      # Keep as is
    'link': 'link',        # Keep as is
    'location': 'location', # Keep as is
    'uploaded': 'uploaded'  # Keep as is
}

# Rename columns
job_data = job_data.rename(columns=column_mapping)

# Remove the web-scraper-order column as it's not needed
if 'web-scraper-order' in job_data.columns:
    job_data = job_data.drop('web-scraper-order', axis=1)

print(f"Data shape after cleaning: {job_data.shape}")
print("Cleaned columns:", list(job_data.columns))

# Convert DataFrame to a list of dictionaries
job_list = job_data.to_dict(orient="records")

# Clean each job record to ensure no NaN values remain and add missing fields
cleaned_job_list = []
for job in job_list:
    cleaned_job = {}
    for key, value in job.items():
        # Convert NaN to empty string and ensure all values are strings
        if pd.isna(value) or value == 'nan' or value == 'NaN':
            cleaned_job[key] = ''
        else:
            cleaned_job[key] = str(value).strip()
    
    # Add missing fields that the backend expects
    if 'company' not in cleaned_job:
        cleaned_job['company'] = 'Unknown Company'
    if 'Title' not in cleaned_job:
        cleaned_job['Title'] = 'Untitled Job'
    if 'location' not in cleaned_job:
        cleaned_job['location'] = 'Remote'
    if 'uploaded' not in cleaned_job:
        cleaned_job['uploaded'] = 'Recently'
    if 'link' not in cleaned_job:
        cleaned_job['link'] = '#'
    
    # Add a default score field for featured jobs
    cleaned_job['score'] = 0
    
    cleaned_job_list.append(cleaned_job)

print(f"Cleaned {len(cleaned_job_list)} job records")

# Clear existing data to start fresh
job_collection.delete_many({})
print("Cleared existing data")

# Insert data into MongoDB
try:
    result = job_collection.insert_many(cleaned_job_list)
    print(f"Successfully inserted {len(result.inserted_ids)} records into MongoDB!")
    
    # Verify the data was inserted
    count = job_collection.count_documents({})
    print(f"Total documents in collection: {count}")
    
    # Show a sample of the inserted data
    sample_job = job_collection.find_one({})
    if sample_job:
        print("Sample job record:")
        for key, value in sample_job.items():
            if key != '_id':
                print(f"  {key}: {value}")
    
except Exception as e:
    print(f"Error inserting data into MongoDB: {e}")
    # Try to insert one by one to identify problematic records
    print("Attempting to insert records one by one...")
    successful_inserts = 0
    for i, job in enumerate(cleaned_job_list):
        try:
            job_collection.insert_one(job)
            successful_inserts += 1
        except Exception as single_error:
            print(f"Error inserting record {i}: {single_error}")
            print(f"Problematic record: {job}")
    
    print(f"Successfully inserted {successful_inserts} out of {len(cleaned_job_list)} records")

# Close the MongoDB connection
client.close()
print("MongoDB connection closed")
