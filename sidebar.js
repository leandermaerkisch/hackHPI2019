sidebar_info = d3.select("#info");
sidebar_list = d3.select("#list");
sidebar_stats = d3.select("#stats");
sidebar = d3.select("#sidebar")

function clear_sidebar() {
    sidebar_info.selectAll("*").remove()
    sidebar_list.selectAll("*").remove()
    sidebar_stats.selectAll("*").remove()
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
    createAssociates(important_actors.map(function(actor) {
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