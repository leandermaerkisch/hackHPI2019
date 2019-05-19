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

function createAssociates(associates) {
    sidebar_list.selectAll("div")
        .data(associates)
        .enter()
        .append("div")
        .each(function (assoc) { assoc[1].fillDivAs(assoc[0], this) })
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
    createAssociates(element.getAssociates())
    if (element instanceof Actor) {
        createIncidentsPlot(element)
    }
}