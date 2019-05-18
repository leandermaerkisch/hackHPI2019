class Incident {
    constructor(input) {
        this.info = input
        this.latlng = [input.latitude, input.longitude];
        this.color = "#FF0000"
        this.marker = L.circleMarker(this.latlng, {
            opacity: 0.5,
            radius: Math.sqrt(input.fatalities * 3) + 5,
            color: this.color
        }).bindPopup(input.notes)
        this.marker.owning_incident = this
        this.connections = []
    }
    addTo(m) {
        this.marker.addTo(m)
    }
    setColor(col) {
        this.color = col
        this.marker.setStyle({color: col});
    }
}



class Connection {
    constructor(inc1, inc2) {
        this.from = inc1
        this.to = inc2
        let distance = Math.sqrt(Math.pow(inc2.latlng[0] - inc1.latlng[0], 2) + Math.pow(inc2.latlng[1] - inc1.latlng[1], 2))
        let direction = [(inc2.latlng[0] - inc1.latlng[0]) / distance / 20, (inc2.latlng[1] - inc1.latlng[1]) / distance / 20]
        let rotatedDirection = [-direction[1], direction[0]]
        let supportPoint1 = [inc2.latlng[0] - direction[0] + rotatedDirection[0] / 2, inc2.latlng[1] - direction[1] + rotatedDirection[1] / 2]
        let supportPoint2 = [inc2.latlng[0] - direction[0] - rotatedDirection[0] / 2, inc2.latlng[1] - direction[1] - rotatedDirection[1] / 2]
        this.line = L.polyline([inc1.latlng, inc2.latlng, supportPoint1, supportPoint2, inc2.latlng], {opacity: 0.5})
    }

    addTo(m) {
        this.line.addTo(m)
    }
    setColor(col) {
        this.line.setStyle({color: col});
    }
} 

function groupBy(array, criteria) {
    let dict = new Map()
    array.forEach(entry => {
        let val = entry.info[criteria]
        if (dict.has(val)) {
            dict.get(val).push(entry)
        } else {
            dict.set(val, [entry])
        }
    })
    return Array.from(dict.values())
}