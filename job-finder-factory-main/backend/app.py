from flask import Flask, jsonify
from flask_cors import CORS
from pymongo.mongo_client import MongoClient
from pymongo.server_api import ServerApi
import datetime

# Initialize Flask application
app = Flask(__name__)

# Enable CORS for all routes
CORS(app)

# MongoDB connection
uri = "mongodb+srv://ashkarfrancis1:Nabill55@cluster0.jbpov.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
client = MongoClient(uri, server_api=ServerApi('1'))
db = client["jobfinder"]  # Replace with your database name
job_collection = db["python"]  # Replace with your collection name

@app.route('/api', methods=['GET'])
def api_root():
    return jsonify({"message": "API is running"}), 200

@app.route('/api/jobs', methods=['GET'])
def get_jobs():
    try:
        # Fetch jobs from MongoDB, including the specified columns
        jobs = list(job_collection.find({}, {"_id": 0, "link": 1, "Title": 1, "company": 1, "location": 1, "uploaded": 1, "score": 1}))
        return jsonify(jobs), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/jobs/featured', methods=['GET'])
def get_featured_jobs():
    try:
        # Fetch top 5 featured jobs with highest scores
        top_jobs = list(job_collection.find({}, {"_id": 1, "link": 1, "Title": 1, "company": 1, "location": 1, "uploaded": 1, "score": 1}).sort("score", -1).limit(5))
        
        # Convert and format jobs for the frontend
        featured_jobs = []
        for job in top_jobs:
            # Format job data according to the frontend Job interface
            featured_job = {
                "_id": str(job.get("_id")),
                "title": job.get("Title", "Untitled Job"),
                "company": job.get("company", "Unknown Company"),
                "location": job.get("location", "Remote"),
                "postedDate": job.get("uploaded", "Recently"),
                "jobType": "Full-time",  # Default value
                "salary": "$80,000 - $120,000",  # Default value
                "description": f"Join {job.get('company', 'our company')} and work on exciting projects in {job.get('location', 'a great location')}.",
                "logo": f"https://ui-avatars.com/api/?name={job.get('company', 'Company')}&background=6366f1&color=fff"
            }
            featured_jobs.append(featured_job)
            
        return jsonify(featured_jobs), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500


if __name__ == "__main__":
    app.run(debug=True)
