
var map = L.map('map').setView([13, 12], 8);
map.on("click", function() { select_nothing() })

L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw', {
    maxZoom: 18,
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, ' +
        '<a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
        'Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    id: 'mapbox.light'
}).addTo(map);

actors = load_file()
actors_map = new Map(actors.map(actor => {
    return [actor.name, actor]
}))
important_actors = actors.filter(actor => {
    return actor.noIncidents > 50
})
var color_palette = palette(['tol', 'qualitative'], important_actors.length)
important_actors.forEach((actor, index) => {
    actor.setColor("#".concat(color_palette[index]))
    actor.addTo(map)
})
select_nothing()