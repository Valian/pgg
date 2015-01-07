define(["planet/planetProperties", "resources", "config"],
       function(properties, resources, config){

    var planetPaths = resources.getJSON( config.planetTypesList );

    var loadedPlanets = loadTypes(planetPaths || []);

    return {

        planetTypes: loadedPlanets,
        debug: loadProperties('debugPlanet'),

    }


    function loadTypes(paths) {

        var types = [];

        for(var i=0; i<paths.length; i++) {

            var name = paths[i];

            try {

                types.push(loadProperties(name));

            } catch(e) {

                console.warn(e);

            }

        }

        return types;

    }

    function loadProperties(name) {

        var path = config.basePlanetsDataDir + name + "/";
        var parsed = resources.getJSON(path + "properties.json",
                                       { addParenthesis: true });


        if(!parsed.rendFragShaderPath) {

            throw "Properties must set rendFragShaderPath!";

        }

        return properties.create(name, path, parsed.rendFragShaderPath, parsed);

    }

});
