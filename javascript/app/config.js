define(["resources"], function(resources) {

    var dataUrl = "/data/load/";
    var data = resources.getJSON(dataUrl, {cache: false});
    var config = data.config;
    var pgg = config.pgg;

    for(var i = 0; i < pgg.notIncludedPlanets.length; i++) {


        delete data.planets[pgg.notIncludedPlanets[i]];

    }

    if(pgg.debug) {

        data.planets = {

            debugPlanet: data.planets[pgg.debugPlanetName],

        };

    } else {

        delete data.planets[pgg.debugPlanetName];

    }

    //debugger;

    return data;

});
