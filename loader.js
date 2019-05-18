function load_file() {
    return input_file.map(function(incident) {
        return new Incident(incident)
    })
}