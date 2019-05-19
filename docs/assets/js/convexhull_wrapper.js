function convex_hull_polyline(incs) {
    let points = incs.map(function(inc) {
        return {x: inc.latlng[0], y: inc.latlng[1]}
    })
    let hull_points = convexhull.makeHull(points)
    let latlngs = hull_points.map(function(p) {
        return [p.x, p.y]
    })
    return L.polygon(latlngs, {color: 'red', stroke: false})
}