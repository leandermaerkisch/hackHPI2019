sidebar_info = d3.select("#info");
sidebar_list = d3.select("#list");
sidebar_stats = d3.select("#stats");
sidebar = d3.select("#sidebar")

function clear_sidebar() {
    sidebar_info.selectAll("*").remove()
    sidebar_list.selectAll("*").remove()
    sidebar_stats.selectAll("*").remove()
    sidebar_info.style("background-color", "#FFFFFF")
    sidebar_list.style("background-color", "#FFFFFF")
    sidebar.style("background-color", "#FFFFFF")
}

function createInfo(infos) {
    let enter = sidebar_info
        .selectAll("div")
        .data(infos)
        .enter()
        .append("div")
    enter.append("p")
        .text(i => { return i[0] })
        .style("font-weight", "bold")
    enter.append("p")
        .text(i => { return i[1] })
}

function toggleCommonEvent(actor1, actor2) {
    actor1.addTo(map)
    actor2.addTo(map)
    let inc1 = actor1.months.map(month => {
        return month.incidents.map(inc => {
            if (inc.info.actor2 == actor2.name) {
                return inc
            } else {
                return null
            }
        }).filter(element => { return element != null })
    }).flat()
    let inc2 = actor2.months.map(month => {
        return month.incidents.map(inc => {
            if (inc.info.actor2 == actor1.name) {
                return inc
            } else {
                return null
            }
        }).filter(element => { return element != null })
    }).flat()
    let incs = inc1.concat(inc2)
    let shouldShow = incs.some(inc => { return inc.active == false })
    incs.forEach(inc => {
        if (shouldShow) {
            inc.addTo(map)
        } else {
            inc.remove(map)
        }
    })
}

function createAssociates(associates, element=null) {
    sidebar_list.selectAll("div")
        .data(associates)
        .enter()
        .append("div")
        .each(function (assoc) { assoc[1].fillDivAs(assoc[0], this) })
        .filter(function (assoc) { return assoc[0] == "closely related" })
        .append("button")
            .text("toggle common events")
            .on("click", function (assoc) {
                d3.event.stopPropagation()
                toggleCommonEvent(element, assoc[1])
            })
            .property("disabled", function (assoc) { return (assoc[1].map == null || element.map == null) ? true : null })
}

function remove_by_substring(string) {
    important_actors.filter(actor => {
        return actor.name.includes(string)
    }).forEach(actor => {
        actor.remove(map)
    })
    select_nothing()
}

function select_nothing() {
    clear_sidebar()
    //b.setAttribute('class', 'btn');
    sidebar_info.append("button")
        .on("click", function () {
            important_actors.forEach(actor => {
                actor.collapse()
            })
        })
        .text("collapse all")
    sidebar_info.append("button")
        .on("click", function () {
            remove_by_substring("Protesters")
        })
        .text("hide protestors")
    sidebar_info.append("button")
        .on("click", function () {
            remove_by_substring("Military Forces")
        })
        .text("hide Military Forces")
    sidebar_info.append("button")
        .on("click", function () {
            remove_by_substring("Rioters")
        })
        .text("hide rioters")
    sidebar_info.append("button")
        .on("click", function () {
            remove_by_substring("Unidentified Armed Group")
        })
        .text("hide unidentified armed group")
    sidebar_info.append("button")
        .on("click", function () {
            important_actors.filter(actor => {
                let strings = ["Protesters", "Military Forces", "Rioters", "Unidentified Armed Group"]
                return !strings.some(string => { return actor.name.includes(string) })
            }).forEach(actor => {
                actor.remove(map)
            })
            select_nothing()
        })
        .text("hide terrorists")
    sidebar_info.append("button")
        .on("click", function () {
            important_actors.forEach(actor => {
                actor.addTo(map)
            })
            select_nothing()
        })
        .text("show all")

    createAssociates(important_actors.map(function (actor) {
        return ["group", actor]
    }))
}

function select_element(element) {
    clear_sidebar()
    if (element.color) {
        sidebar_info.style("background-color", element.color.concat("88"))
        sidebar_list.style("background-color", element.color.concat("88"))
        sidebar.style("background-color", element.color.concat("88"))
    }
    sidebar_info.append("h1")
        .text(element.name)
        .on("click", function () { element.zoomOn() })
    createInfo(element.getInfo())
    createAssociates(element.getAssociates(), element)
    if (element instanceof Actor) {
        createIncidentsPlot(element)
    }
}