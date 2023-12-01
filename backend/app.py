from flask import Flask, request, send_from_directory, session
from flask_cors import CORS
from data_processing import get_missions, get_missions_csv
import pandas as pd

app = Flask(__name__)
app.secret_key = "test123"
CORS(app, supports_credentials=True)


# endpoint allows users to submit a single abstract
# abstract is then passed to get_missions as a dataframe
@app.post("/submit-abstract")
def submit_abstract():
    abstract_text = request.json.get("abstractText")
    if not abstract_text:
        return "No abstract text provided!", 400

    # create a DataFrame with necessary columns for a single abstract
    abstract_df = pd.DataFrame(
        {
            "ABSTRACT": [abstract_text],
            "ABSTRACT_NUM": [0],
        }
    )

    # Call get_missions with DataFrame instead of file
    missions = get_missions(abstract_df)
    return missions


# endpoint allows user to upload files
# file is then passed on to the get_missions func in data_processing.py
@app.post("/upload")
def upload_file():
    #  get file from req body
    if "file" not in request.files:
        return "No file uploaded!"

    file = request.files["file"]

    # check if the uploaded file is a CSV
    if not file.filename.endswith(".csv"):
        return "Invalid file type! Please upload a CSV."

    print("sending csv to data processing")
    res = get_missions_csv(file)

    # Set the session variable
    session["csv_filename"] = res["filename"]
    print(session)
    return {"data": res["data"], "filename": res["filename"]}


@app.route("/file-download/<filename>")
def file_downloads(filename):
    print(session)
    # dir path needs to be changed for prod
    directory_path = "/Users/randalmichel/NMI-tool/nasa-mission-identity/backend/"
    try:
        return send_from_directory(
            directory_path,
            filename,
            as_attachment=True,
            download_name="missions_output.csv",
        )
    except Exception as e:
        return str(e)
