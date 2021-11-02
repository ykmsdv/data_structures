#### Data Structures - Wekly Assignment 07

##### Assignment requirements:

Finish parsing and cleaning the rest of the data in your assigned "zone" (the zone that corresponds with the last digit of your student ID number) and all other zones, and update/replace your PostgreSQL table(s) with the new data.

##### Solution:
For this assignment I created a new script, which executes all the steps from the first 3 weekly assignments, but for all zones. This script cleans and saves all data for the AA meetings, and fetches their lat and long coordinates from the TAMU Geo API. For the insertion to the PostgreSQL database, I have 3 separate scripts - create_table to create the two tables with their structures from the schema, insert_data to insert the cleaned in the first part of the assignment meetings data, and validate_data to make a query to confirm the creation and insertion were done properly.