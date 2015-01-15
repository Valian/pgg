define(["three", "renderer"], function(THREE, renderer) {

    return OffscreenRenderer;

    function OffscreenRenderer(vertexShader, fragShader, params) {

        this.vertexShader = vertexShader;
        this.fragmentShader = fragShader;

        this.rows = params.rows ? params.rows : 1;
        this.columns = params.columns ? params.columns : 1;

        this.attributes = params.attributes ? params.attributes : {};
        this.uniforms = params.uniforms ? params.uniforms : {};
        this.defines = params.defines ? params.defines : {};

        var that = this;

        var totalRows = that.rows;
        var totalColumns = that.columns;

        var scene = new THREE.Scene();
        var material = createMaterial();
        var geometry = createGeometry();

        this.mesh = createMesh(geometry, material, scene);
        this.camera = createCamera(scene);

        this.setRenderArea = setRenderArea;
        this.render = render;


        function render(renderTarget, renderData) {

            var meshAttribs = that.mesh.geometry.attributes;
            for(var key in that.attributes) {

                var attrib = that.attributes[key];
                if(attrib.updateFunc) {

                    updateAttribute(meshAttribs[key], attrib.updateFunc, renderData);

                }

            }

            renderer.render( scene, that.camera, renderTarget, true );

        }

        function setRenderArea(rows, columns) {

            that.rows = rows;
            that.columns = columns;
            that.camera.top = rows;
            that.camera.updateProjectionMatrix();

        }

        function createMaterial() {

            for(var key in that.attributes) {

                that.attributes[key].value = [];

            }

            var materialParameters = {

                attributes: that.attributes,
                vertexShader: that.vertexShader,
                fragmentShader: that.fragmentShader,
                uniforms: that.uniforms,
                defines: that.defines,
                side: THREE.DoubleSide,

            };

            return new THREE.ShaderMaterial(materialParameters);

        }

        function createGeometry() {

            var planeGeometry = new THREE.BufferGeometry();

            that.attributes.position = {

                type: '3fv',
                itemSize: 3,
                initFunc: function(attr, data, index, row, column) {

                    var row1 = row + 1;
                    var column1 = column + 1;

                    attr.setXYZ( index + 0, column, row1, 0 );
                    attr.setXYZ( index + 1, column1, row1, 0 );
                    attr.setXYZ( index + 2, column1, row, 0 );

                    attr.setXYZ( index + 3, column, row1, 0);
                    attr.setXYZ( index + 4, column1, row, 0);
                    attr.setXYZ( index + 5, column, row, 0);

                },
                updateFunc: undefined,
                initData: undefined

            };

            for(var name in that.attributes) {

                var attrib = that.attributes[name];

                if(!attrib.itemSize) {

                    console.warn("attribute " + name + " doesn't have defined item size property!" );
                    continue;

                }

                var bufferAttribute = createAttribute(

                    attrib.itemSize,
                    attrib.initFunc,
                    attrib.initData

                );

                planeGeometry.addAttribute( name, bufferAttribute );

            }

            return planeGeometry;

        }

        function createAttribute(itemSize, initFunc, initData) {

            var vertexes = totalRows * totalColumns * 2 * 3;
            var array = new Float32Array( vertexes * itemSize );
            var attrib = new THREE.BufferAttribute( array, itemSize );

            initFunc = initFunc || function(attrib, data, index) {

                var startingIndex = index * attrib.itemSize;
                var endingIndex = startingIndex + 6 * attrib.itemSize;

                for(var i = startingIndex; i < endingIndex; i++) {

                    attrib.array[i] = 0;

                }

            }

            updateAttribute(attrib, initFunc, initData);

            return attrib;

        }

        function updateAttribute(attribute, updateFunc, data) {

            for(var row=0; row<that.rows; row++) {

                for(var column = 0; column < that.columns; column++) {

                    var startingIndex = 6 * (column + row * totalColumns);

                    updateFunc(attribute, data, startingIndex, row, column);

                }

            }

            attribute.needsUpdate = true;

        }

        function createMesh(geometry, material, scene) {

            var mesh = new THREE.Mesh(geometry, material);
            mesh.FrustumCulled = false;
            scene.add(mesh);

            return mesh;

        }

        function createCamera(scene) {

            var camera = new THREE.OrthographicCamera(0, that.columns, that.rows, 0, 1, 1000);
            camera.position.set(0, 0, 10);
            scene.add(camera);

            return camera;

        }

    }

});
