function convex_hull_polyline(markers) {
    let points = markers.map(function(m) {
        return {x: m._latlng.lat, y: m._latlng.lng}
    })
    let hull_points = convexhull.makeHull(points)
    let latlngs = hull_points.map(function(p) {
        return [p.x, p.y]
    })
    return L.polygon(latlngs, {color: 'red'})
}