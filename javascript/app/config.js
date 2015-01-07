define(function() {

    var baseDataDir = "/data/";
    var basePlanetsDataDir = baseDataDir + "planets/";

    return {

        baseDataDir: baseDataDir,
        basePlanetsDataDir: basePlanetsDataDir,
        planetTypesList: basePlanetsDataDir + "types.json",
        heightmapGeneratorFirstPassVertex: baseDataDir + "heightmapFirstPassVertex",
        heightmapGeneratorFirstPassFrag: baseDataDir + "heightmapFirstPassFrag",
        heightmapGeneratorSecondPassVertex: baseDataDir + "heightmapSecondPassVertex",
        heightmapGeneratorSecondPassFrag: baseDataDir + "heightmapSecondPassFrag",
        planetVertex: basePlanetsDataDir + "planetVertex",
        generatorParallelity: 50,
        debug: true,

    };

});
