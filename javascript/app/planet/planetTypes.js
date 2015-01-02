define(["planet/planetProperties", "resources", "config"],
       function(properties, resources, config){

    var planetPaths = resources.getFile(config.planetTypesList);
    var loadedPlanets = loadTypes(planetPaths || []);

    return {

        types: loadedPlanets,
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
        var parsed = resources.getFile(path + "properties.json");

        if(typeof(parsed) === "string") {

            parsed = JSON.parse(parsed);

        }

        if(!parsed.genFragShaderPath || !parsed.rendFragShaderPath) {

            throw "Properties must set both genFragShaderPath and rendFragShaderPath";

        }

        return properties.create(name, path, parsed.genFragShaderPath,
                                 parsed.rendFragShaderPath, parsed);

    }

});
