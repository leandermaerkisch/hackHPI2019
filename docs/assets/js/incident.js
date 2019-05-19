class Incident {
    constructor(input, parent) {
        this.name = input.event_type
        this.parent = parent
        let inc = this
        this.info = input
        this.latlng = [input.latitude, input.longitude];
        this.line = L.polyline([this.latlng, parent.latlng], { opacity: 0.5, dashArray: "10 10" })
        this.marker = L.marker(this.latlng, {
            opacity: parent.opacity,
            icon: iconMap.get(input.event_type)
        }).bindPopup(`${input.event_date}<br>${input.event_type}<br>against ${input.actor2}`)
        this.marker.on('mouseover', function (e) {
            if (!this.mouseStillOver) {
                this.openPopup();
                this.mouseStillOver = true
            }
        });
        this.marker.on('mouseout', function (e) {
            this.closePopup();
            this.mouseStillOver = false
        });
        this.marker.on("click", function () {
            select_element(inc)
        })
        let icon = this.marker.options.icon;
        icon.options.iconSize = [Math.sqrt(this.info.fatalities) * 10 + 30, Math.sqrt(this.info.fatalities) * 10 + 30];
        this.marker.setIcon(icon)
        this.color = null
        this.active = false
        this.mouseStillOver = false
    }
    addTo(m) {
        this.marker.addTo(m)
        this.line.addTo(m)
        this.active = true
    }
    setColor(col) {
        this.color = col
        this.line.setStyle({ color: col });
    }
    remove(m) {
        m.removeLayer(this.marker)
        m.removeLayer(this.line)
        this.active = false
    }
    getInfo() {
        let info = []
        info.push(["event", this.info.event_type])
        info.push(["sub-event", this.info.sub_event_type])
        info.push(["date", this.info.event_date])
        info.push(["fatalities", this.info.fatalities])
        info.push(["description", this.info.notes])
        return info
    }
    getAssociates() {
        let assoc = []
        assoc.push(["group", this.parent.parent])
        assoc.push(["month", this.parent])
        if (this.info.actor2) {
            if (actors_map.has(this.info.actor2)) {
                assoc.push(["actor2", actors_map.get(this.info.actor2)])
            }
        }
        return assoc
    }
    fillDivAs(label, div_svg) {
        let inc = this
        let div = d3.select(div_svg)
        div.style("background-color", "#FFFFFF88")
        div.append("h2")
            .text(function () { return `${label}: ${inc.info.event_type}` })
        div.append("p")
            .text(function () { return inc.info.event_date })
        div.append("p")
            .text(function () { return `${inc.info.fatalities} fatalities` })
        div.on("click", function () { select_element(inc) })
    }
    zoomOn() {
        this.parent.expand()
        map.setView(this.latlng, 8);
    }
}

class Connection {
    constructor(monthSummary1, monthSummary2) {
        this.from = monthSummary1
        this.to = monthSummary2
        //let distance = Math.sqrt(Math.pow(monthSummary2.latlng[0] - monthSummary1.latlng[0], 2) + Math.pow(monthSummary2.latlng[1] - monthSummary1.latlng[1], 2))
        //let direction = [(monthSummary2.latlng[0] - monthSummary1.latlng[0]) / distance / 20, (monthSummary2.latlng[1] - monthSummary1.latlng[1]) / distance / 20]
        //let rotatedDirection = [-direction[1], direction[0]]
        //let supportPoint1 = [monthSummary2.latlng[0] - direction[0] + rotatedDirection[0] / 2, monthSummary2.latlng[1] - direction[1] + rotatedDirection[1] / 2]
        //let supportPoint2 = [monthSummary2.latlng[0] - direction[0] - rotatedDirection[0] / 2, monthSummary2.latlng[1] - direction[1] - rotatedDirection[1] / 2]
        //this.line = L.polyline([monthSummary1.latlng, monthSummary2.latlng, supportPoint1, supportPoint2, monthSummary2.latlng])
        this.line = L.polyline.antPath([[this.from.latlng[0], this.from.latlng[1]], [this.to.latlng[0], this.to.latlng[1]]], {})
        this.from.connections.push(this)
        this.to.connections.push(this)
    }
    addTo(m) {
        this.line.addTo(m)
    }
    setColor(col) {
        this.line.setStyle({ color: col });
    }
    remove(m) {
        m.removeLayer(this.line)
    }
}

function getEventTypes(incidents) {
    let result = {
        "Violence against civilians": 0,
        "Strategic developments": 0,
        "Battles": 0,
        "Protests": 0,
        "Riots": 0,
        "Explosions/Remote violence": 0
    }
    incidents.forEach(incident => {
        result[incident.info.event_type] += 1
    })
    return result
}

function sumEventTypes(months) {
    return months.reduce(function (acc, month) {
        acc["Violence against civilians"] += month["Violence against civilians"]
        acc["Strategic developments"] += month["Strategic developments"]
        acc["Battles"] += month["Battles"]
        acc["Protests"] += month["Protests"]
        acc["Riots"] += month["Riots"]
        acc["Explosions/Remote violence"] += month["Explosions/Remote violence"]
        return acc
    }, {
            "Violence against civilians": 0,
            "Strategic developments": 0,
            "Battles": 0,
            "Protests": 0,
            "Riots": 0,
            "Explosions/Remote violence": 0
        })
}

class MonthSummary {
    constructor(input, parent) {
        this.name = input.date
        this.parent = parent
        this.info = input
        let spl = input.date.split("-")
        this.year = parseInt(spl[0])
        this.month = parseInt(spl[1])
        this.latlng = input.latlng
        this.opacity = 1.0 - ((2019 - this.year) * 12 + 5 - this.month) * 0.05
        this.incidents = input.incidents.map(entry => {
            return new Incident(entry, this)
        })
        this.eventTypes = getEventTypes(this.incidents)
        this.fatalities = this.incidents.reduce((acc, inc) => {
            return acc + inc.info.fatalities
        }, 0)
        this.marker = L.circleMarker(this.latlng, {
            opacity: this.opacity,
            fillOpacity: this.opacity / 2,
            radius: Math.sqrt(this.fatalities) + 5
        })
        this.convex_hull = convex_hull_polyline(this.incidents)
        this.map = null
        this.isCollapsed = true
        this.noIncidents = this.incidents.length
        this.marker.bindPopup(`${this.year}-${this.month}<br>${parent.name}<br>${this.incidents.length} incidents<br>${this.fatalities} fatalities`)
        let month = this
        this.marker.on('mouseover', function (e) {
            this.openPopup();
            month.addAllConnections()
            month.marker.bringToFront()
        });
        this.marker.on('mouseout', function (e) {
            this.closePopup();
            month.removeAllConnections()
        });
        this.color = null
        this.connections = []
    }
    addTo(m) {
        let month = this
        let parent = this
        this.marker.addTo(m).on('click', function (e) {
            select_element(month)
            if (parent.isCollapsed) {
                parent.expand()
            } else {
                parent.collapse()
            }
        });
        this.map = m
    }
    remove(m) {
        this.collapse()
        m.removeLayer(this.marker)
    }
    setColor(col) {
        this.color = col
        this.marker.setStyle({ color: col });
        this.incidents.forEach(inc => {
            inc.setColor(col)
        });
        this.convex_hull.setStyle({ color: col })
    }
    expand() {
        if (!this.isCollapsed) {
            return
        }
        this.convex_hull.addTo(this.map).bringToBack()
        this.incidents.forEach(inc => {
            inc.addTo(this.map)
        })
        this.marker.bringToFront()
        this.isCollapsed = false
    }
    collapse() {
        this.map.removeLayer(this.convex_hull)
        this.incidents.forEach(inc => {
            inc.remove(this.map)
        })
        this.isCollapsed = true
    }
    getInfo() {
        let info = []
        info.push(["month", this.info.date])
        return info
    }
    getAssociates() {
        let assoc = []
        assoc.push(["group", this.parent])
        this.incidents.forEach(inc => {
            assoc.push(["incident", inc])
        })
        return assoc
    }
    fillDivAs(label, div_svg) {
        let month = this
        let div = d3.select(div_svg)
        div.style("background-color", "#FFFFFF88")
        div.append("h2")
            .text(function () { return `${label}: ${month.info.date}` })
        div.append("p")
            .text(function () { return month.info.event_date })
        div.append("p")
            .text(function () { return `${month.incidents.length} incidents` })
        div.append("p")
            .text(function () { return `${month.fatalities} fatalities` })
        div.on("click", function () { select_element(month) })
    }
    zoomOn() {
        if (this.map) {
            if (!this.parent.active) {
                this.parent.addTo(this.map)
            }
            map.setView(this.latlng, 8);
        }
    }
    addAllConnections() {
        this.connections.forEach(connection => {
            connection.addTo(this.map)
        })
    }
    removeAllConnections() {
        this.connections.forEach(connection => {
            connection.remove(this.map)
        })
    }
}

class Actor {
    constructor(name, input) {
        let actor = this
        this.active = false
        this.name = name
        this.info = input
        this.months = input.map(m => { return new MonthSummary(m, actor) })
        this.eventTypes = sumEventTypes(this.months)
        this.connections = this.months.map((month, index, array) => {
            if (index == array.length - 1 || month.latlng[0] == array[index + 1].latlng[0] && month.latlng[1] == array[index + 1].latlng[1]) {
                return null
            }
            return new Connection(month, array[index + 1])
        }).filter(element => {
            return element != null
        })
        this.map = null
        this.noIncidents = this.months.reduce((acc, month) => {
            return acc + month.noIncidents
        }, 0)
        this.color = "#FFFFFF88"
        this.map = null
        this.expanded = false
        this.borders_crossed = []
        this.closely_related = []
        this.strongly_corelated = []
    }
    addTo(m) {
        this.map = m
        this.months.forEach(month => {
            month.addTo(m)
        })
        this.active = true
    }
    setColor(col) {
        this.color = col
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
        this.active = false
    }
    collapse() {
        this.months.forEach(month => {
            month.collapse()
        })
        this.expanded = false
    }
    getInfo() {
        let info = []
        if (this.map == null) {
            info.push(["NOTICE", "not displayed on the map"])
        }
        return info
    }
    getAssociates() {
        let assoc = []
        this.borders_crossed.forEach(border => {
            assoc.push(["border crossed", border])
        })
        this.closely_related.forEach(group => {
            assoc.push(["many common events", group])
        })
        this.strongly_corelated.forEach(group => {
            assoc.push(["closely related", group])
        })
        this.months.forEach(month => {
            assoc.push(["month", month])
        })
        return assoc
    }
    fillDivAs(label, div_svg) {
        let actor = this
        let div = d3.select(div_svg)
        div.append("h2")
            .text(function () { return `${label}: ${actor.name}` })
        div.on("click", function () { select_element(actor) })
        div.style("background-color", actor.color.concat("88"))
        div.append("input")
            .attr("type", "checkbox")
            .property("checked", function () { return (actor.active) ? true : false })
            .property("disabled", function () { return (actor.map == null) ? true : null })
            .on("click", function () {
                d3.event.stopPropagation()
                if (this.checked) {
                    actor.addTo(map)
                } else {
                    actor.remove(map)
                }
            })
        div.append("label").text("is visible")
        div.append("button")
            .text("toggle expand")
            .on("click", function () {
                d3.event.stopPropagation()
                if (actor.expanded) {
                    actor.collapse()
                } else {
                    actor.expand()
                }
            })
    }
    zoomOn() {
        if (this.map) {
            if (!this.active) {
                this.addTo(this.map)
            }
            map.setView(this.months[0].latlng, 8);
        }
    }
    expand() {
        if (this.map == null) {
            return
        }
        if (!this.active) {
            this.addTo(this.map)
        }
        if (this.expanded) {
            return
        }
        this.months.forEach(month => { month.expand() })
        this.expanded = true
    }
}