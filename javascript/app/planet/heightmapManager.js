define(function() {

    var maxUnusedTextureCount = 60;
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

        if(!renderedTex) return addToQueue(genData, parameters);

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
            unusedCount: 0

        };

    }

    function addToQueue(genData, parameters) {

        var renderData = {

            renderTarget: getRenderTarget(genData),
            param: parameters

        };

        genData.toRender.push(renderData);
        return renderData.renderTarget;

    }

    function update() {

        for(var key in data) {

            var genData = data[key];

            if( genData.toRender.length > 0 ) {

                var generator = genData.generator;

                for(var i=0; i<genData.toRender.length; i++) {

                    var texName = toTextureName(genData.toRender[i].param);
                    genData.used[texName] = genData.toRender[i].renderTarget;

                }

                generator.generateTextures( genData.toRender );

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

            if(genData.unusedCount < maxUnusedTextureCount) {

                genData.unusedCount++;
                genData.unused[texName] = tex;

            } else {

                genData.used[texName].dispose();

            }

            delete genData.used[texName];

        }

    }

    function getRenderTarget(genData) {

        for(var k in genData.unused) {

            if(genData.unused.hasOwnProperty(k)) {

                var tex = genData.unused[k];
                genData.unusedCount--;
                delete genData.unused[k];
                return tex;

            }

        }

        return genData.generator.createRenderTarget();

    }

    function toTextureName(param) {

        var lt = param.corners[0];
        var lb = param.corners[2];
        var seed = param.seed;

        return vecToStr(lt) + vecToStr(lb) + seed.toFixed(1);

        function vecToStr(vec) {

            return vec.x.toFixed(1) + vec.y.toFixed(1) + vec.z.toFixed(1);

        }

    }

});
