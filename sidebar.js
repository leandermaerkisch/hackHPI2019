sidebar_info = d3.select("#info");
sidebar_list = d3.select("#list");

function clear_sidebar() {
    sidebar_info.selectAll("*").remove()
    sidebar_list.selectAll("*").remove()
}

function createInfo(infos) {
    let enter = sidebar_info
        .selectAll("div")
        .data(infos)
        .enter()
        .append("div")
    enter.append("p")
        .text(i => { return i[0] })
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
    sidebar_info.append("h1")
        .text(element.name)
    createInfo(element.getInfo())
    createAssociates(element.getAssociates())
}