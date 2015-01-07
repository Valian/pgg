define(["planet/planetProperties", "config"],
       function(properties, config){

    var loadedPlanets = loadTypes(config.planets);

    return loadedPlanets;


    function loadTypes(planets) {

        var types = [];

        for(var name in planets) {

            var p = properties.create(name, planets[name]);
            types.push(p);

        }

        return types;

    }

});
