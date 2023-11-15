from flask import Flask, request
from flask_cors import CORS
from data_processing import get_missions

app = Flask(__name__)
CORS(app)

# @app.get('/')
# def retrieve_data():
#    return get_missions()

# endpoint allows user to upload files
# file is then passed on to the get_missions func in data_processing.py 
@app.post('/upload')
def upload_file():
   #  get file from req body 
    if 'file' not in request.files:
        return "No file uploaded!"
    print('file successfully selected')
    file = request.files['file']

    # Check if the uploaded file is a CSV
    if not file.filename.endswith('.csv'):
        return "Invalid file type! Please upload a CSV."

    print('sending csv to data processing')
    missions = get_missions(file)
    return missions

# TODO 
# CREATE FRONTEND MATCHING THE IR STYLING ON FIGMA / CANVA 
# USE REACT TO IMPLEMENT DESIGN