class Border {
    constructor(array) {
        let border = this
        this.name = array[0]
        this.latlng = array[1]
        this.marker = L.marker(this.latlng, { icon: iconBorder })
            .bindPopup("nothing added yet...")
        this.marker.on('mouseover', function (e) {
            this.openPopup();
        });
        this.marker.on('mouseout', function (e) {
            this.closePopup();
        });
        this.marker.on("click", function () {
            select_element(border)
        })
        this.crossing_groups = []
    }
    addTo(m) {
        this.marker.addTo(m)
    }
    push(group) {
        this.crossing_groups.push(group)
        let icon = this.marker.options.icon;
        icon.options.iconSize = [Math.sqrt(this.crossing_groups.length) * 15 + 15, Math.sqrt(this.crossing_groups.length) * 15 + 15];
        icon.options.iconAnchor = [icon.options.iconSize[0] / 2, icon.options.iconSize[1] / 2]
        this.marker.setIcon(icon)
        this.marker.bindPopup(this.crossing_groups.reduce((acc, group) => {
            return acc.concat(`${group.name}<br>`)
        }, ""))
        group.borders_crossed.push(this)
    }
    getInfo() {
        let info = []
        info.push(["border", "contains groups which have crossed this border"])
        return info
    }
    getAssociates() {
        let assoc = []
        this.crossing_groups.forEach(group => {
            assoc.push(["group", group])
        })
        return assoc
    }
    fillDivAs(label, div_svg) {
        let border = this
        let div = d3.select(div_svg)
        div.style("background-color", "#AAAAAA88")
        div.append("h2")
            .text(function () { return `${label}: ${border.name}` })
        div.on("click", function () { select_element(border) })
    }
}