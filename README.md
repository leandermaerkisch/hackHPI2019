# Unbounded
A visualization platform for mapping conflicts and tracking the movements of terrorist groups.

Try it out at https://arthurz0.github.io/hackHPI2019/

## Usage
### Basic map view
![alt text](https://github.com/arthurz0/hackHPI2019/blob/master/example/unbounded_nigeria_1.png "Nigeria Example")

Basic map view. Nodes of the same color represent the same actor. Each node is the summary of one month of events, and is connected to the nodes of the previous and following month. The oldest nodes are opaque, gradually decreasing in opacity until the newest node, which is the brightest.

### Hover on node
![alt text](https://github.com/arthurz0/hackHPI2019/blob/master/example/boko_haram_1.png "Boko Haram Example")

While hovering on a node, the particular month is displayed, along with the name of the group and a summary of the events for that month. An animated ant trial shows the chronological connection to the previous and next month nodes.

### Detailed breakdown
![alt text](https://github.com/arthurz0/hackHPI2019/blob/master/example/zoom_example.png "Boko Haram Zoom Example")

After clicking on a node, all of the events for that particular month are displayed within an area of influence. Each event has an icon corresponding to its type (Riot, Attack on civilians, Peaceful protest).


### Tech
Made using:
* [leaflet.js](https://leafletjs.com/)
* [d3](https://d3js.org/)

### Data Source
[Armed Conflict Location & Event Data Project (ACLED)](https://www.acleddata.com/)
