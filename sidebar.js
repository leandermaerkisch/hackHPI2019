sidebar_info = document.getElementById("info");
sidebar_list = document.getElementById("list");

function clear_sidebar() {
    let node = sidebar_info
    while (node.firstChild) {
        node.removeChild(node.firstChild);
    }
    node = sidebar_list
    while (node.firstChild) {
        node.removeChild(node.firstChild);
    }

}

function creatActorDiv(actor) {
    let div = document.createElement("div")
    div.onclick = function() { select_actor(actor) }
    div.style.backgroundColor = actor.color
    let label = document.createElement("label");
    label.innerHTML = actor.name
    let checkbox = document.createElement('input');
    checkbox.type = "checkbox";
    checkbox.className = "checkbox";
    checkbox.checked = true;
    checkbox.onclick = function () {
        if (this.checked) {
            actor.addTo(map)
        } else {
            actor.remove(map)
        }
    }
    div.appendChild(checkbox)
    div.appendChild(label)
    return div
}
/*
function creatMonthDiv(summary) {
    let div = document.createElement("div")
    div.onclick(function() { select_month(summary) })
    let label = document.createElement("p");
    label.innerHTML = actor.name
    let checkbox = document.createElement('input');
    checkbox.type = "checkbox";
    checkbox.className = "checkbox";
    checkbox.checked = true;
    checkbox.onclick = function () {
        if (this.checked) {
            actor.addTo(map)
        } else {
            actor.remove(map)
        }
    }
    div.appendChild(checkbox)
    div.appendChild(label)
    return div
}

function creatIncidentDiv(actor) {
    let div = document.createElement("div")
    div.onclick(function() { select_actor(actor) })
    div.style.backgroundColor = actor.color
    let label = document.createElement("label");
    label.innerHTML = actor.name
    let checkbox = document.createElement('input');
    checkbox.type = "checkbox";
    checkbox.className = "checkbox";
    checkbox.checked = true;
    checkbox.onclick = function () {
        if (this.checked) {
            actor.addTo(map)
        } else {
            actor.remove(map)
        }
    }
    div.appendChild(checkbox)
    div.appendChild(label)
    return div
}
*/

function select_nothing() {
    clear_sidebar()
    let b = document.createElement('button');
    b.innerHTML='collapse all';
    //b.setAttribute('class', 'btn');
    b.onclick = function() {
        important_actors.forEach(actor => {
            actor.collapse()
        })
    }
    sidebar_info.appendChild(b)
    important_actors.forEach(actor => {
        sidebar_list.appendChild(creatActorDiv(actor))
    })
}

function select_incident(inc) {
    clear_sidebar()
}

function select_month(summary) {
    clear_sidebar()
}

function select_actor(actor) {
    clear_sidebar()
}