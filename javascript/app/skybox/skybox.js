define(['three', 'config', 'resources'],
       function(THREE, config, resources){

    Skybox.prototype = Object.create(THREE.PointCloud.prototype);

    var skyboxConfig = config.config.skybox;

    return Skybox;

    function Skybox(data) {

        var that = this;
        this.starCount = data.length;
        this.data = data;

        var material = createMaterial();
        var geometry = createGeometry(data);

        THREE.PointCloud.call(this, geometry, material);
        this.frustumCulled = false;

        this.update = update;


        function update(camera) {
            that.position.copy(camera.perspectiveCamera.position);
        }

        function createMaterial() {

            var vertex = config.skybox.starVertex;
            var fragment = config.skybox.starFragment;
            var attributes = {

                size: { type: 'f', value: [] },
                theta: { type: 'f', value: [] },
                phi: { type: 'f', value: [] }

            };
            var uniforms = {

                imageTex: {

                    type: "t",
                    value: resources.getTexture(skyboxConfig.starTexture)

                }

            };

            return new THREE.ShaderMaterial( {

                uniforms: uniforms,
                attributes: attributes,
                vertexShader: vertex,
                fragmentShader: fragment,
                transparent: true,
                side: THREE.DoubleSide,
                sizeAttenuation: false,
                blending: THREE.AdditiveBlending

            });

        }

        function createGeometry(data) {

            var geometry = new THREE.BufferGeometry();

            var radius = skyboxConfig.skyboxSize;

            var starCount = data.length;
            var posArray = new Float32Array( starCount * 3 );
            var positions = new THREE.BufferAttribute( posArray, 3 );
            var sizes = new THREE.BufferAttribute( new Float32Array(starCount), 1 );

            for(var i = 0; i < starCount; i++) {

                var x = Math.sin(data[i].theta) * Math.cos(data[i].phi);
                var y = Math.sin(data[i].theta) * Math.sin(data[i].phi);
                var z = Math.cos(data[i].theta);

                positions.setXYZ( i, x * radius, y * radius, z  * radius);
                sizes.setX(i, data[i].size);

            }

            geometry.addAttribute( "position", positions );
            geometry.addAttribute( "size", sizes );

            return geometry;

        }

    }

});
