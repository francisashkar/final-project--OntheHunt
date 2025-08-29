from flask import Flask, jsonify, request
from flask_cors import CORS
from pymongo.mongo_client import MongoClient
from pymongo.server_api import ServerApi
import datetime
import base64
import re

# Initialize Flask application
app = Flask(__name__)

# Enable CORS for all routes
CORS(app)

# MongoDB connection
uri = "mongodb+srv://ashkarfrancis1:Nabill55@cluster0.jbpov.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
client = MongoClient(uri, server_api=ServerApi('1'))
db = client["jobfinder"]
job_collection = db["python"]
user_collection = db["users"]  # New collection for user data

@app.route('/api', methods=['GET'])
def api_root():
    return jsonify({"message": "API is running"}), 200

@app.route('/api/jobs', methods=['GET'])
def get_jobs():
    try:
        # Fetch jobs from MongoDB
        jobs = list(job_collection.find({}, {"_id": 0}))
        print(f"Fetched {len(jobs)} jobs from MongoDB")
        
        # Log the first job to see the structure
        if jobs:
            print("First job structure:", jobs[0])
        
        return jsonify(jobs), 200
    except Exception as e:
        print(f"Error fetching jobs: {e}")
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
        print(f"Error fetching featured jobs: {e}")
        return jsonify({"error": str(e)}), 500

@app.route('/api/health', methods=['GET'])
def health_check():
    try:
        # Test MongoDB connection
        count = job_collection.count_documents({})
        return jsonify({
            "status": "healthy",
            "mongodb": "connected",
            "job_count": count,
            "timestamp": datetime.datetime.now().isoformat()
        }), 200
    except Exception as e:
        return jsonify({
            "status": "unhealthy",
            "mongodb": "disconnected",
            "error": str(e),
            "timestamp": datetime.datetime.now().isoformat()
        }), 500

@app.route('/api/upload-profile-image', methods=['POST'])
def upload_profile_image():
    try:
        data = request.get_json()
        user_id = data.get('userId')
        image_data = data.get('imageData')  # Base64 string
        
        if not user_id or not image_data:
            return jsonify({"error": "Missing userId or imageData"}), 400
        
        # Validate base64 format
        if not re.match(r'^data:image/[a-zA-Z]+;base64,', image_data):
            return jsonify({"error": "Invalid image format"}), 400
        
        # Check if user exists, create if not
        user_doc = user_collection.find_one({"userId": user_id})
        
        if user_doc:
            # Update existing user
            result = user_collection.update_one(
                {"userId": user_id},
                {"$set": {"profileImage": image_data, "updatedAt": datetime.datetime.now()}}
            )
        else:
            # Create new user
            result = user_collection.insert_one({
                "userId": user_id,
                "profileImage": image_data,
                "createdAt": datetime.datetime.now(),
                "updatedAt": datetime.datetime.now()
            })
        
        if result.acknowledged:
            return jsonify({
                "success": True,
                "message": "Profile image uploaded successfully",
                "userId": user_id
            }), 200
        else:
            return jsonify({"error": "Failed to save image"}), 500
            
    except Exception as e:
        print(f"Error uploading profile image: {e}")
        return jsonify({"error": str(e)}), 500

@app.route('/api/profile-image/<user_id>', methods=['GET'])
def get_profile_image(user_id):
    try:
        user_doc = user_collection.find_one({"userId": user_id})
        
        if user_doc and user_doc.get("profileImage"):
            return jsonify({
                "success": True,
                "profileImage": user_doc["profileImage"]
            }), 200
        else:
            return jsonify({
                "success": False,
                "message": "No profile image found"
            }), 404
            
    except Exception as e:
        print(f"Error fetching profile image: {e}")
        return jsonify({"error": str(e)}), 500

@app.route('/api/delete-profile-image', methods=['DELETE'])
def delete_profile_image():
    try:
        data = request.get_json()
        user_id = data.get('userId')
        
        if not user_id:
            return jsonify({"error": "Missing userId"}), 400
        
        result = user_collection.update_one(
            {"userId": user_id},
            {"$unset": {"profileImage": ""}, "$set": {"updatedAt": datetime.datetime.now()}}
        )
        
        if result.acknowledged:
            return jsonify({
                "success": True,
                "message": "Profile image deleted successfully"
            }), 200
        else:
            return jsonify({"error": "Failed to delete image"}), 500
            
    except Exception as e:
        print(f"Error deleting profile image: {e}")
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    print("Starting Flask server...")
    print("MongoDB URI:", uri)
    print("Database:", "jobfinder")
    print("Collection:", "python")
    app.run(debug=True, host='0.0.0.0', port=5000)
