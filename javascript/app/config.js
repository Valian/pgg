define(function() {

    var baseDataDir = "/data/";
    var basePlanetsDataDir = baseDataDir + "planets/";

    return {

        baseDataDir: baseDataDir,
        basePlanetsDataDir: basePlanetsDataDir,
        planetTypesList: basePlanetsDataDir + "types.json",
        heightmapGeneratorVertex: baseDataDir + "heightmapVertex",
        planetVertex: basePlanetsDataDir + "planetVertex",
        debug: true,

    };

});
