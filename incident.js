class Incident {
    constructor(input) {
        this.info = input
        this.latlng = [input.latitude, input.longitude];
        this.marker = L.circleMarker(this.latlng, {
            opacity: 0.5,
            radius: Math.sqrt(input.fatalities * 3) + 5
        }).bindPopup(input.notes)
        this.marker.owning_incident = this
        this.connections = []
    }
    addTo(m) {
        this.marker.addTo(m)
    }
    setColor(col) {
        this.marker.setStyle({color: col});
    }
    remove(m) {
        m.removeLayer(this.marker)
    }
}

class Connection {
    constructor(monthSummary1, monthSummary2) {
        this.from = monthSummary1
        this.to = monthSummary2
        let distance = Math.sqrt(Math.pow(monthSummary2.latlng[0] - monthSummary1.latlng[0], 2) + Math.pow(monthSummary2.latlng[1] - monthSummary1.latlng[1], 2))
        let direction = [(monthSummary2.latlng[0] - monthSummary1.latlng[0]) / distance / 20, (monthSummary2.latlng[1] - monthSummary1.latlng[1]) / distance / 20]
        let rotatedDirection = [-direction[1], direction[0]]
        let supportPoint1 = [monthSummary2.latlng[0] - direction[0] + rotatedDirection[0] / 2, monthSummary2.latlng[1] - direction[1] + rotatedDirection[1] / 2]
        let supportPoint2 = [monthSummary2.latlng[0] - direction[0] - rotatedDirection[0] / 2, monthSummary2.latlng[1] - direction[1] - rotatedDirection[1] / 2]
        this.line = L.polyline([monthSummary1.latlng, monthSummary2.latlng, supportPoint1, supportPoint2, monthSummary2.latlng], {opacity: 0.5})
    }
    addTo(m) {
        this.line.addTo(m)
    }
    setColor(col) {
        this.line.setStyle({color: col});
    }
    remove(m) {
        m.removeLayer(this.line)
    }
}

class MonthSummary {
    constructor(input) {
        let spl = input.date.split("-")
        this.year = parseInt(spl[0])
        this.month = parseInt(spl[1])
        this.latlng = input.latlng
        this.incidents = input.incidents.map(entry => {
            return new Incident(entry)
        })
        this.fatalities = this.incidents.reduce((acc, inc) => {
            return acc + inc.info.fatalities
        }, 0)
        this.marker = L.circleMarker(this.latlng, {
            opacity: 0.5,
            radius: Math.sqrt(this.fatalities) + 5
        })
        this.convex_hull = convex_hull_polyline(this.incidents)
        this.map = null
        this.isCollapsed = true
        this.noIncidents = this.incidents.length
    }
    addTo(m) {
        this.marker.addTo(m)
        this.map = m
    }
    remove(m) {
        this.collapse()
        m.removeLayer(this.marker)
    }
    setColor(col) {
        this.marker.setStyle({color: col});
        this.incidents.forEach(inc => {
            inc.setColor(col)
        });
        this.convex_hull.setStyle({color: col})
    }
    expand() {
        this.convex_hull.addTo(this.map)
        this.incidents.forEach(inc => {
            inc.addTo(m)
        })
        this.isCollapsed = false
    }
    collapse() {
        this.map.removeLayer(this.convex_hull)
        this.incidents.forEach(inc => {
            inc.remove()
        })
        this.isCollapsed = true
    }
}

class Actor {
    constructor(name, input) {
        this.name = name
        this.info = input
        this.months = input.map(m => { return new MonthSummary(m) })
        this.connections = this.months.map((month, index, array) => {
            if (index == array.length - 1 || month.latlng[0] == array[index+1].latlng[0] && month.latlng[1] == array[index+1].latlng[1]) {
                return null
            }
            return new Connection(month, array[index+1])
        }).filter(element => {
            return element != null
        })
        this.map = null
        this.noIncidents = this.months.reduce((acc, month) => {
            return acc + month.noIncidents
        }, 0)
    }
    addTo(m) {
        this.months.forEach(month => {
            month.addTo(m)
        })
        this.connections.forEach(connection => {
            connection.addTo(m)
        })
    }
    setColor(col) {
        this.months.forEach(month => {
            month.setColor(col)
        });
        this.connections.forEach(connection => {
            connection.setColor(col)
        })
    }
    remove(m) {
        this.months.forEach(month => {
            month.remove(m)
        })
        this.connections.forEach(connection => {
            connection.remove(m)
        })
    }
}