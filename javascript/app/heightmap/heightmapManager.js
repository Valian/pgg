define(["config"], function(config) {

    var genConfig = config.config.heightmapGenerator;
    var data = {};

    return {

        getTexture: getTexture,
        update: update,
        markAsUnused: markAsUnused

    }


    function getTexture(parameters) {

        var generator = parameters.generator;

        if(!data[generator.name]) createNewDataObject(generator);

        var genData = data[generator.name];
        var texName = toTextureName(parameters);
        var renderedTex = genData.unused[texName];

        if(!renderedTex) {

            return addToQueue(genData, parameters);

        }

        genData.unusedCount--;
        genData.used[texName] = renderedTex;
        delete genData.unused[texName];

        return renderedTex;

    }

    function createNewDataObject(generator) {

        data[generator.name] = {

            generator: generator,
            used: {},
            unused: {},
            toRender: [],
            unusedCount: 0,
            lastQueryTime: undefined,

        };

    }

    function addToQueue(genData, parameters) {

        var renderData = getRenderTargets(genData);
        renderData.param = parameters;

        genData.toRender.push(renderData);

        return renderData;

    }

    function update() {

        for(var key in data) {

            var genData = data[key];
            var waitingToRender = genData.toRender.length;

            if(waitingToRender > 0) {

                var generator = genData.generator;
                generator.generateTextures( genData.toRender );

                for(var i=0; i<genData.toRender.length; i++) {

                    var texName = toTextureName(genData.toRender[i].param);
                    genData.used[texName] = genData.toRender[i];

                }

                genData.toRender = [];

            }

        }

    }


    function markAsUnused( parameters ) {

        var generator = parameters.generator;
        var genData = data[generator.name];
        var texName = toTextureName(parameters);

        if(genData.used[texName]) {

            var tex = genData.used[texName];

            if(genData.unusedCount < genConfig.maxUnusedTextureCount) {

                genData.unusedCount++;
                genData.unused[texName] = tex;

            } else {

                genData.used[texName].heightmap.dispose();
                genData.used[texName].bumpmap.dispose();

            }

            delete genData.used[texName];

        }

    }

    function getRenderTargets(genData) {

        for(var k in genData.unused) {

            if(genData.unused.hasOwnProperty(k)) {

                var tex = genData.unused[k];
                genData.unusedCount--;
                delete genData.unused[k];
                return tex;

            }

        }

        return {

            heightmap: genData.generator.createRenderTarget(),
            bumpmap: genData.generator.createRenderTarget()

        }

    }

    function toTextureName(param) {

        var lt = param.corners[0];
        var lb = param.corners[2];
        var seed = param.properties.seed;

        return vecToStr(lt) + vecToStr(lb) + seed.toFixed(1);

        function vecToStr(vec) {

            return vec.x.toFixed(1) + vec.y.toFixed(1) + vec.z.toFixed(1);

        }

    }

});
