define(["three", "utils/offscreenRenderer", "config"],
       function(THREE, OffscreenRenderer, config) {

    return FirstPass;

    function FirstPass(renderTargetSize, paralell, octaves) {

        var that = this;

        this.renderTargetSize = renderTargetSize;
        this.paralell = paralell;
        this.octaves = octaves;

        this.offscreenRenderer = createRenderer();

        this.makePass = makePass;

        function makePass(parametersArray, renderTarget) {

            that.offscreenRenderer.setRenderArea(parametersArray.length, that.octaves);
            that.offscreenRenderer.render(renderTarget, parametersArray);

        }

        function createRenderer() {

            var vertex = config.heightmaps.firstPassVert;
            var fragment = config.heightmaps.firstPassFrag;
            var attributes = {

                multiplier: {

                    type: 'f',
                    updateFunc: multipliersUpdate,
                    itemSize: 1

                },
                cornerPosition: {
                    type: '3fv',
                    updateFunc: getCornerUpdate(),
                    itemSize: 3
                }

            };

            var parameters = {

                attributes: attributes,
                rows: that.paralell,
                columns: that.octaves

            };

            return new OffscreenRenderer(vertex, fragment, parameters);

        }

        function multipliersUpdate(attribute, data, index, row, column) {

            var properties = data[row].param.properties;
            var noiseMultipliers = properties.noiseMultipliers;
            var noiseFrequency = properties.noiseFrequency;

            for(var i = 0; i < 6; i++) {

                var freq = noiseMultipliers[column].frequency * noiseFrequency;
                attribute.setX(index + i, freq);

            }

        }

        function getCornerUpdate() {

            var mod = 1 / (2 * that.renderTargetSize - 2);

            var topVector = new THREE.Vector3();
            var leftVector = new THREE.Vector3();
            var result = new THREE.Vector3();

            var temp1 = new THREE.Vector3();
            var temp2 = new THREE.Vector3();

            var cornerParameters = [

                [ -mod, -mod ],
                [ 1 + mod, -mod ],
                [ 1 + mod, 1 + mod ],
                [ -mod, -mod ],
                [ 1 + mod, 1 + mod ],
                [ -mod, 1 + mod ]

            ];

            function cornerUpdate(attribute, data, index, row) {

                var params = data[row].param;
                var corners = params.corners;
                var seed = params.properties.seed;

                var leftTop = corners[0];

                //rightTop - leftTop;
                topVector.copy(corners[1]).sub(corners[0]);
                //leftBottom - leftTop;
                leftVector.copy(corners[2]).sub(corners[0]);

                for(var i = 0; i < cornerParameters.length; i++) {

                    temp1.copy(topVector).multiplyScalar(cornerParameters[i][0]);
                    temp2.copy(leftVector).multiplyScalar(cornerParameters[i][1]);
                    result.copy(leftTop).add(temp1).add(temp2);

                    attribute.setXYZW( index + i, result.x, result.y, result.z, seed);

                }

            }

            return cornerUpdate;

        }

    }

});
