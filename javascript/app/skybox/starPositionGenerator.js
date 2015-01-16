define(['three', 'utils/offscreenRenderer', 'config'],
       function(THREE, OffscreenRenderer, config) {

    return StarPositionGenerator;

    function StarPositionGenerator(size, seed) {

        var that = this;

        this.size = size;
        this.seed = seed;
        this.offscreenRenderer = createRenderer();

        this.generate = generate;

        function generate(middlePos) {

            var uniforms = that.offscreenRenderer.uniforms;
            var renderTarget = that.offscreenRenderer.createRenderTarget(

                that.size * 2,
                that.size * that.size

            );

            uniforms.middlePosition.value = middlePos.toArray();

            that.offscreenRenderer.render(renderTarget);

            return renderTarget;

        }

        function createRenderer() {

            var vertex = config.skybox.positionGeneratorVertex;
            var fragment = config.skybox.positionGeneratorFragment;
            var uniforms = {

                seed: { type: 'f', value: that.seed },
                middlePosition: { type: '3fv', value: [0,0,0] }

            };
            var attributes = {

                cornerPosition: {

                    type: '3fv',
                    itemSize: 3,
                    initFunc: initCornerPositionAttribute,
                    initData: { size: that.size }

                },
                floatComponent: {

                    type: 'f',
                    itemSize: 1,
                    initFunc: initFloatComponentAttribute,

                }

            };

            return new OffscreenRenderer(vertex, fragment, {

                uniforms: uniforms,
                attributes: attributes,
                rows: size,
                columns: 2,

            });

        }

        function initFloatComponentAttribute(attribute, data, startingIndex, row, column) {

            for(var i=0; i < 6; i++) {

                attribute.setX(startingIndex + i, column);

            }

        }


        function initCornerPositionAttribute(attribute, data, startingIndex, row)
        {

            //TODO - fix to take exact value at pixels
            var size2 = data.size / 2;
            attribute.setXYZ( startingIndex + 0, -size2, size2, row - size2 );
            attribute.setXYZ( startingIndex + 1, size2, size2, row - size2 );
            attribute.setXYZ( startingIndex + 2, size2, -size2, row - size2 );

            attribute.setXYZ( startingIndex + 3, -size2, size2, row - size2 );
            attribute.setXYZ( startingIndex + 4, size2, -size2, row - size2 );
            attribute.setXYZ( startingIndex + 5, -size2, -size2, row - size2 );

        }

    }

});
