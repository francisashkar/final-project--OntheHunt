from flask import Flask, jsonify
from flask_cors import CORS
from pymongo.mongo_client import MongoClient
from pymongo.server_api import ServerApi

# Initialize Flask application
app = Flask(__name__)

# Enable CORS for all routes
CORS(app)

# MongoDB connection
uri = "mongodb+srv://ashkarfrancis1:frafra45@cluster0.jbpov.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
client = MongoClient(uri, server_api=ServerApi('1'))
db = client["jobfinder"]  # Replace with your database name
job_collection = db["python"]  # Replace with your collection name

@app.route('/api/jobs', methods=['GET'])
def get_jobs():
    try:
        # Fetch jobs from MongoDB, including the specified columns
        jobs = list(job_collection.find({}, {"_id": 0, "link": 1, "Title": 1, "company": 1, "location": 1, "uploaded": 1, "score": 1}))
        return jsonify(jobs), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500


if __name__ == "__main__":
    app.run(debug=True)
