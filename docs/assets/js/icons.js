var iconExtent = [40, 40]

var iconBattles = L.icon({
    iconUrl: 'assets/images/clash.png',
    iconSize: iconExtent,
    iconAnchor: [iconExtent[0]/2, iconExtent[1]/2],
    popupAnchor: [-iconExtent[0]/2, -iconExtent[1]/2]
});

var iconViolence = L.icon({
    iconUrl: 'assets/images/crosshair.png',
    iconSize: iconExtent,
    iconAnchor: [iconExtent[0]/2, iconExtent[1]/2],
    popupAnchor: [-iconExtent[0]/2, -iconExtent[1]/2]
});

var iconProtests = L.icon({
    iconUrl: 'assets/images/power.png',
    iconSize: iconExtent,
    iconAnchor: [iconExtent[0]/2, iconExtent[1]/2],
    popupAnchor: [-iconExtent[0]/2, -iconExtent[1]/2]
});

var iconRiot = L.icon({
    iconUrl: 'assets/images/riot.png',
    iconSize: iconExtent,
    iconAnchor: [iconExtent[0]/2, iconExtent[1]/2],
    popupAnchor: [-iconExtent[0]/2, -iconExtent[1]/2]
});

var iconExplosion = L.icon({
    iconUrl: 'assets/images/blast.png',
    iconSize: iconExtent,
    iconAnchor: [iconExtent[0]/2, iconExtent[1]/2],
    popupAnchor: [-iconExtent[0]/2, -iconExtent[1]/2]
});

var iconStrategic = L.icon({
    iconUrl: 'assets/images/strategy.png',
    iconSize: iconExtent,
    iconAnchor: [iconExtent[0]/2, iconExtent[1]/2],
    popupAnchor: [-iconExtent[0]/2, -iconExtent[1]/2]
});

iconMap = new Map([
    ["Violence against civilians", iconViolence],
    ["Strategic developments", iconStrategic],
    ["Battles", iconBattles],
    ["Protests", iconProtests],
    ["Riots", iconRiot],
    ["Explosions/Remote violence", iconExplosion],
])

var iconBorder = L.icon({
    iconUrl: 'assets/images/border.png',
    iconSize: iconExtent,
    iconAnchor: [iconExtent[0]/2, iconExtent[1]/2],
    popupAnchor: [-iconExtent[0]/2, -iconExtent[1]/2]
});