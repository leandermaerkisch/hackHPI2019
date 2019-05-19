var type_color_palette = palette(['tol', 'mpn65'], 6)

const type_color = {
    "Violence against civilians": "#".concat(type_color_palette[0]),
    "Strategic developments": "#".concat(type_color_palette[1]),
    "Battles": "#".concat(type_color_palette[2]),
    "Protests": "#".concat(type_color_palette[3]),
    "Riots": "#".concat(type_color_palette[4]),
    "Explosions/Remote violence": "#".concat(type_color_palette[5])
}

function appendLegend() {
    let legspacing = 25
    let legend = sidebar_stats.append("svg")
        .selectAll("*")
        .data(Object.entries(type_color))
        .enter()
        .append("g")

    legend.append("rect")
        .attr("fill", function (entry) { return entry[1] })
        .attr("width", 20)
        .attr("height", 20)
        .attr("y", function (d, i) {
            return i * legspacing
        })
        .attr("x", 0);

    legend.append("text")
        .attr("class", "label")
        .attr("y", function (d, i) {
            return i * legspacing + 15
        })
        .attr("x", 30)
        .attr("text-anchor", "start")
        .text(function (entry) {
            return entry[0];
        });
}

function createIncidentsPlot(actor) {
    appendLegend()
    let margin = { top: 10, right: 30, bottom: 30, left: 40 }
    let width = 600 - margin.left - margin.right
    let height = 500 - margin.top - margin.bottom;

    let x = d3.scaleTime()
        .domain([new Date(2018, 1, 1), new Date(2019, 4, 31)])
        .rangeRound([0, width]);
    let max_inc = Math.max(...actor.months.map(month => { return month.incidents.length }))
    let y = d3.scaleLinear()
        .domain([0, max_inc])
        .range([height, 0]);

    let svg = sidebar_stats.append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform",
            "translate(" + margin.left + "," + margin.top + ")");
    let block_width = x(new Date(2019, 2, 28)) - x(new Date(2019, 2, 1))
    let blocks = actor.months.map(month => {
        let entries = Array.from(Object.entries(month.eventTypes))
        return entries.map(function (pair, i, array) {
            let [type, number] = pair
            let start = array.slice(0, i).reduce((acc, entry) => {
                return acc - entry[1]
            }, month.incidents.length)
            return {
                offset: start,
                number: number,
                color: type_color[type],
                startY: y(start),
                startX: x(new Date(month.year, month.month, 1)) - block_width
            }
        })
    }).flat()
    svg.selectAll("rect")
        .data(blocks)
        .enter()
        .append("rect")
        .attr("y", block => { return block.startY })
        .attr("x", block => { return block.startX })
        .attr("width", block_width)
        .attr("height", function (block) { return block.number / max_inc * height })
        .style("fill", block => { return block.color })

    // add the x Axis
    svg.append("g")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x));

    // add the y Axis
    svg.append("g")
        .call(d3.axisLeft(y));

}