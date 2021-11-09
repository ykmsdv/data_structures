#### Data Structures - Wekly Assignment 10

#### Assignment requirements:
Design three interfaces for visualizations for your three data sources (AA, process blog, and sensors). Include the following information for each of the three designs for final assignments:

- What will the visualization look like? Will it be interactive? If so, how?
- How will the data need to be mapped to the visual elements?
- For that mapping, what needs to be done to the data? Be specific and clear. Will it require filtering, aggregation, restructuring, and/or something else? How will this be done?
- What is the default view (if any)?
- What assumptions are you making about the user?

#### Solution:

##### Final assignment 1
##### AA Meetings
- What will the visualization look like? Will it be interactive? If so, how? *The data is visualized on a map with point markers indicating each meeting location. Users can filter out meetings based on different criteria: Weekday, Start or End Time, Meeting Type, Special Interest, and Accessibility of the location. There is a tooltip that shows how many meetings there are for each weekday for the particular location the user hovers over. On click of the location or once the user filters out the meetings based on their criteria, a side panel displays the meetings meeting the criteria with all respective details - weekday, start time, end time, special interest, etc.*

*Wishlist: A button to filter all meetings in the next two hours for cases when the user wants to visit a meeting ASAP and does not have preferences for any other filters.

![](aa-01.PNG)
![](aa-02.PNG)
![](aa-03.PNG)

- How will the data need to be mapped to the visual elements? *Data maps to the filters and the filters map to the visualization.*


- For that mapping, what needs to be done to the data? Be specific and clear. Will it require filtering, aggregation, restructuring, and/or something else? How will this be done? *For the initial display of all locations, the data for the location details should be queried (all from locations table). Once the user interacts with the visualization, the data is queried based on the user's criteria (query for all meetings on Modays).*

- What is the default view (if any)? *The default view is the map with all locations indicated with point markers and the filters available above the map.*


- What assumptions are you making about the user? *The users may need to use the visualization when they need a meeting as soon as possible, when they are planning their schedule, or when they are looking for a specific type/interest or accessibility options.*

##### Final assignment 2
##### Process Blog
- What will the visualization look like? Will it be interactive? If so, how? *The data is represented as small multiple radar charts - one for each day I collected data for. They are distributed in 3 columns - one Monday, Tuesday and Wednesday, and 4 rows for each week.*

![](process_blog.PNG)

- For that mapping, what needs to be done to the data? Be specific and clear. Will it require filtering, aggregation, restructuring, and/or something else? How will this be done? *Each radar chart will take the data filtered by the day it represents.*

- What assumptions are you making about the user? *The user would like to compare and see the progression of the variables throughout the week.*

##### Final assignment 3
##### Sensor data
- What will the visualization look like? Will it be interactive? If so, how? *The data is represented as a grouped bar chart - average temperature at night and percent deep sleep.*

![](sensors.PNG)

- How will the data need to be mapped to the visual elements? *The two variables are using different axis, the one on the left represents the temperature, and the one on the right - the percent deep sleep*

- For that mapping, what needs to be done to the data? Be specific and clear. Will it require filtering, aggregation, restructuring, and/or something else? How will this be done? *The data from the temperature sensor needs to be manipulated, so the average temperature at night (filtered by time) is calculated and displayed for each day.*

- What assumptions are you making about the user? *The user would like to explore if the temperature affects deep sleep, which is important for the mind and body recovery at night.*