# NASA Internship Project - *NASA MISSION IDENTIFIER*

Collaborators: **Abram Astle & Randal Michel**

Overview: *This tool is designed for the cosmically curious. It provides a unique platform for users to upload either an abstract or a CSV file, then scans the content for references to NASA missions. Upon detection, it furnishes detailed information including the mission name, PID, Title, and Citation Source.
This tool is invaluable for researchers, students, and space enthusiasts alike, who are seeking to connect their studies or interests with specific NASA missions.*

## Technologies used

**Python, Flask, Pandas, SpaCy, vite + React**

The NASA Mission Identifier leverages a natural language library called SpaCy in order to pinpoint missions that are stated in the abstract. Pandas, a python data analysis library, turns user submitted abstracts or CSVs into a structured dataframe and then cross references it against a vast repository of NASA related missions, returning key information such as mission type and launch details.

## Video Walkthrough

Here's a walkthrough of the NASA Mission Identifier:

<img src='https://github.com/c-a-s-t-l-e/nasa-mission-identity/blob/main/new_nmi.gif' />


