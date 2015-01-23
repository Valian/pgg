define(["three", "utils/offscreenRenderer", "config"],
       function(THREE, OffscreenRenderer, config){

    return BumpmapPass;

    function BumpmapPass(properties) {

        var that = this;

        this.offscreenRenderer = createRenderer();

        this.makePass = makePass;

        function makePass(parametersArray) {

            var count = parametersArray.length;
            var uniforms = that.offscreenRenderer.uniforms;

            for(var i = 0; i < count; i++) {

                uniforms.heightmapTexture.value = parametersArray[i].heightmap;
                uniforms.texelSize.value = 1 / parametersArray[i].heightmap.width;
                uniforms.surfaceHeight.value = parametersArray[i].param.properties.planetSurface;
                uniforms.texelRealSize.value = computeTexelRealSize(parametersArray[i]);

                that.offscreenRenderer.render(parametersArray[i].bumpmap);

            }

        }

        function computeTexelRealSize(parameters) {

            var textureSize = parameters.bumpmap.width;
            var chunksPerSide = Math.pow(2, parameters.param.level);
            var part = 1 / (4 * textureSize * chunksPerSide);

            var planetProperties = parameters.param.properties;
            var perimeter = 2 * Math.PI * (planetProperties.planetRadius + planetProperties.planetSurface / 2);

            return part * perimeter;
        }

        function createRenderer() {

            var uniforms = {

                heightmapTexture: { type: 't', value: null },
                texelSize: { type: 'f', value: 0 },
                texelRealSize: { type: 'f', value: 0 },
                surfaceHeight: { type: 'f', value: 0 }

            };
            var vertex = config.heightmaps.bumpmapPassVert;
            var fragment = config.heightmaps.bumpmapPassFrag;

            var parameters = {

                uniforms: uniforms

            };

            return new OffscreenRenderer(vertex, fragment, parameters);

        }

    }

});
