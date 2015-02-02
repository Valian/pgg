define(["planet/planetProperties", "config"],
       function(properties, config){

    var planets = config.planets;
    var typesConfig = config.config.planetTypes;
    var types = loadTypes(planets, typesConfig);

    return types;

    function loadTypes(planets, data) {

        var types = {};
        for(var categoryName in data) {

            var category = [];
            for(var planetNr in data[categoryName]) {

                var planetName = data[categoryName][planetNr];
                if(!planets[planetName]) continue;

                var p = properties.create(planetName, planets[planetName]);
                category.push(p);

            }

            types[categoryName] = category;

        }

        return types;

    }

});
