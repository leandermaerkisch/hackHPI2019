function load_file() {
    return Object.entries(actor_object).map(pair => {
        let [name, value] = pair
        return new Actor(name, value)
    })
}