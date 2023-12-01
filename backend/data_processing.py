import pandas as pd
import spacy
from spacy.matcher import PhraseMatcher
from spacy.tokens import Span
from flask import jsonify, session
from datetime import datetime


# Generate a unique filename for user CSV file
def generate_unique_filename():
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    return f"missions_outputs_{timestamp}.csv"


# allow users to upload their own abstracts
def get_missions(input):
    export = pd.read_csv("export_mission.csv")

    review = input

    export["MONTH"] = export["MONTH"].astype(str).str.zfill(2)
    export["DAY"] = export["DAY"].astype(str).str.zfill(2)

    # Create 'LAUNCH DATE' column by concatenating YEAR, MONTH, and DAY
    export["LAUNCH DATE"] = (
        export["MONTH"].astype(str) + "/" + export["DAY"] + "/" + export["YEAR"]
    )

    # get the pid and other columns for each mission
    pid_name = export[
        ["PID", "NAME", "MISSION TYPE", "LAUNCH LOCATION", "LAUNCH DATE"]
    ][0:]

    # reset the index column in the review sheet since the first two columns do not contain data
    # ABSTRACT_NUM will be used to merge to the results later
    # move ABSTRACT_NUM to the start of the dataframe
    # print("before")
    # print(review)
    # first_column = review.pop("ABSTRACT_NUM")
    # print("first col")
    # print(first_column)
    # review.insert(0, "ABSTRACT_NUM", first_column)
    # print("AFTER")

    # print(review)

    abstracts = pd.DataFrame(review["ABSTRACT"][0:])

    # reset the index values
    abstracts = abstracts["ABSTRACT"].reset_index().drop(columns=["index"])

    #########################################################################

    # load the pretrained model
    nlp = spacy.load("en_core_web_sm")

    # make a matcher object
    matcher = PhraseMatcher(nlp.vocab)

    # add the patterns from the "NAME" column in the pid_name dataframe to the matcher object
    patterns = [nlp.make_doc(name) for name in pid_name["NAME"]]
    matcher.add("NAME", patterns)

    # make each abstract a document object to be processed, saved in the doc_abs list
    doc_abs = [nlp.make_doc(abstract) for abstract in abstracts["ABSTRACT"].apply(str)]

    # How this code works:
    # 1. For each document object in doc_abs, find a match if there is one by making the match a Span object
    # 2. For each Span object in a document add it to the entities attribute of the Document object
    # 3. Add the document with its updated list of entities to the docs list

    docs = []
    for doc in doc_abs:
        matches = matcher(doc)
        spans = [
            Span(doc, start, end, label=match_id) for match_id, start, end in matches
        ]
        doc.ents = spacy.util.filter_spans(spans)
        docs.append(doc)

    # get the matches in each abstract
    matches = [matcher(doc) for doc in doc_abs]

    rows_to_append = []
    count = 0  # Initialize count outside the loop
    for match_list in matches:
        for match_id, start, end in match_list:
            span = doc_abs[count][start:end]
            matched_name = span.text
            matched_row = pid_name[pid_name["NAME"] == matched_name]
            if not matched_row.empty:
                # Add the row to the list
                rows_to_append.append(matched_row.iloc[0].to_dict())
        count += 1  # Increment count after processing each abstract

    # Convert the list of rows to a DataFrame
    doc_dataframe = pd.DataFrame(rows_to_append)

    ######################################################################

    # rename the PID column to MISSION PID
    doc_dataframe = doc_dataframe.rename(columns={"PID": "AUTO MISSION PID"})

    # drop the columns after the ABSTRACT
    review.drop(review.iloc[:, 10:], inplace=True, axis=1)

    # merge the review csv with the ABSTRACT_NUM column
    # doc_dataframe = doc_dataframe.merge(review, on="ABSTRACT_NUM")

    # Select specific columns
    filtered_dataframe = doc_dataframe[
        ["NAME", "AUTO MISSION PID", "MISSION TYPE", "LAUNCH LOCATION", "LAUNCH DATE"]
    ]

    # remove duplicates
    filtered_dataframe.drop_duplicates(inplace=True)

    # returns all matches and converts it to JSON
    return filtered_dataframe.to_json()


########################################## TEMPORARY FIX ##########################################
# take in file as parameter to allow users to upload their own abstracts
def get_missions_csv(file):
    # read in the sheets seperately saved as csv's

    review = pd.read_csv(file)
    export = pd.read_csv("export_mission.csv")

    # ABSTRACT_NUM will be used to merge to the results later
    review["ABSTRACT_NUM"] = review.index

    # move ABSTRACT_NUM to the start of the dataframe
    first_column = review.pop("ABSTRACT_NUM")
    review.insert(0, "ABSTRACT_NUM", first_column)

    export["MONTH"] = export["MONTH"].astype(str).str.zfill(2)
    export["DAY"] = export["DAY"].astype(str).str.zfill(2)

    # Create 'LAUNCH DATE' column by concatenating YEAR, MONTH, and DAY
    export["LAUNCH DATE"] = (
        export["MONTH"].astype(str) + "/" + export["DAY"] + "/" + export["YEAR"]
    )

    # get the pid and name for each mission
    pid_name = export[
        ["PID", "NAME", "MISSION TYPE", "LAUNCH LOCATION", "LAUNCH DATE"]
    ][0:]

    # grab the abstracts from the review csv
    abstracts = pd.DataFrame(review["ABSTRACT"][0:])

    # reset the index values
    abstracts = abstracts["ABSTRACT"].reset_index().drop(columns=["index"])

    #########################################################################

    # load the pretrained model
    nlp = spacy.load("en_core_web_sm")

    # make a matcher object
    matcher = PhraseMatcher(nlp.vocab)

    # add the patterns from the "NAME" column in the pid_name dataframe to the matcher object
    patterns = [nlp.make_doc(name) for name in pid_name["NAME"]]
    matcher.add("NAME", patterns)

    # make each abstract a document object to be processed, saved in the doc_abs list
    doc_abs = [nlp.make_doc(abstract) for abstract in abstracts["ABSTRACT"].apply(str)]

    # How this code works:
    # 1. For each document object in doc_abs, find a match if there is one by making the match a Span object
    # 2. For each Span object in a document add it to the entities attribute of the Document object
    # 3. Add the document with its updated list of entities to the docs list

    docs = []
    for doc in doc_abs:
        matches = matcher(doc)
        spans = [
            Span(doc, start, end, label=match_id) for match_id, start, end in matches
        ]
        doc.ents = spacy.util.filter_spans(spans)
        docs.append(doc)

    # get the matches in each abstract
    matches = [matcher(doc) for doc in doc_abs]

    # make an empty dataframe
    doc_dataframe = pd.DataFrame(columns=["ABSTRACT_NUM", "NAME"])

    # fill the dataframe with matches that exist in the abstracts
    count = 0
    for match_list in matches:
        for match_id, start, end in match_list:
            rule_id = nlp.vocab.strings[match_id]
            span = doc_abs[count][start:end]
            doc_dataframe.loc[len(doc_dataframe)] = [count, span.text]
        count += 1

    ######################################################################

    # merge the mission names with their respective pid's,
    doc_dataframe = doc_dataframe.merge(pid_name, on="NAME")

    # rename the PID column to MISSION PID
    doc_dataframe = doc_dataframe.rename(columns={"PID": "AUTO MISSION PID"})

    # Merge matched data back into the original DataFrame
    merged_dataframe = review.merge(doc_dataframe, on="ABSTRACT_NUM", how="left")

    # Fill NaN values with None or another placeholder
    merged_dataframe.fillna("None", inplace=True)

    # Get unique file name to avoid race conditions
    unique_filename = generate_unique_filename()

    # Save merged data to csv
    merged_dataframe.to_csv(unique_filename, index=False)

    # Return only the columns with matched data in JSON format
    filtered_dataframe = merged_dataframe[
        [
            "ABSTRACT_NUM",
            "NAME",
            "AUTO MISSION PID",
            "LAUNCH LOCATION",
            "MISSION TYPE",
            "LAUNCH DATE",
        ]
    ].dropna()

    # remove duplicates
    filtered_dataframe.drop_duplicates(inplace=True)

    # returns all matches and converts it to JSON
    return {"data": filtered_dataframe.to_json(), "filename": unique_filename}
