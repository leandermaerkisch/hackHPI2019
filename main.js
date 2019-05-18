
var map = L.map('map').setView([13, 12], 8);

L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw', {
    maxZoom: 18,
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, ' +
        '<a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
        'Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    id: 'mapbox.light'
}).addTo(map);


var slider = document.getElementById("myRange");
var output = document.getElementById("demo");
output.innerHTML = slider.value
slider.oninput = function () {
    output.innerHTML = this.value;
    if (this.value < 50) {
        map.removeLayer(marker1)
    } else {
        marker1.addTo(map)
    }
}

incidents = load_file()
console.log(incidents)

var markers = L.markerClusterGroup({
    iconCreateFunction: function (cluster) {
        let markers = cluster.getAllChildMarkers()
        let incs = markers.map(mark => {
            return mark.owning_incident
        })
        let fatalities = incs.reduce(reducer = (accumulator, currentValue) => {
            return accumulator + currentValue.info.fatalities
        }, 0)
        let html = '<div class="circle">' + markers.length + '</div>';
        return L.divIcon({ html: html, iconSize: L.point(Math.sqrt(fatalities * 3) + 5, Math.sqrt(fatalities * 3) + 5) });
    }
});

incidents.forEach(incident => {
    markers.addLayer(incident.marker)
    //incident.addTo(map)
});

map.addLayer(markers);
console.log(markers)
colors = ["#FF0000", "#0000FF", "#00FF00"]

grouped = groupBy(incidents, "actor1")
grouped.forEach((group, group_index) => {
    group.forEach(inc => {
        inc.setColor(colors[group_index])
    })
})
/*
grouped.forEach((group, group_index) => {
    group
    connections = group.map((inc, index, array) => {
        if (index == array.length - 1 || inc.latlng[0] == array[index+1].latlng[0] && inc.latlng[1] == array[index+1].latlng[1]) {
            return null
        } else {
            return new Connection(inc, array[index + 1])
        }
    }).filter(val => { return val != null })

    connections.forEach(connection => {
        connection.addTo(map)
        connection.setColor(colors[group_index])
    });

})*/