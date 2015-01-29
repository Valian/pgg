define(["planet/planetProperties", "config"],
       function(properties, config){

    var planets = config.planets;
    var typesConfig = config.config.planetTypes;
    var types = loadTypes(planets, typesConfig);

    return types;

    function loadTypes(planets, config) {

        var types = {};
        for(var categoryName in config.data) {

            var category = [];
            for(var planetNr in config.data[categoryName]) {

                var planetName = config.data[categoryName][planetNr];
                if(!planets[planetName]) continue;

                var p = properties.create(planetName, planets[planetName]);
                category.push(p);

            }

            types[categoryName] = category;

        }

        return types;

    }

});
