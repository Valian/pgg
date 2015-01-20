define(['three', 'skybox/starPositionGenerator', 'skybox/skybox', 'config', 'resources'],
       function(THREE, StarPositionGenerator, Skybox, config, resources) {

    var skyboxConfig = config.config.skybox;

    return SkyboxGenerator;

    function SkyboxGenerator(seed) {

        var that = this;

        this.seed = seed;
        this.gridResolution = skyboxConfig.gridResolution;
        this.starImagePath = skyboxConfig.starTexture;
        this.starPositionGenerator = new StarPositionGenerator(this.gridResolution, seed);

        var scene = new THREE.Scene();
        var material = createMaterial();
        var geometry = createGeometry();
        this.mesh = createMesh(geometry, material, scene);

        this.generate = generate;

        function generate(middlePos) {

            var skybox = new Skybox(skyboxConfig.skyboxSize, skyboxConfig.skyboxTextureSize);
            var starData = that.starPositionGenerator.generate(middlePos);

            updateAttributes(starData);

            skybox.render(scene);

            return {

                skybox: skybox,
                data: starData,
                mesh: that.mesh

            }

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
                    value: resources.getTexture(that.starImagePath)

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

        function createGeometry() {

            var geometry = new THREE.BufferGeometry();
            var starCount = Math.pow(that.gridResolution, 3);
            var vertexes = starCount * 2 * 3;

            var posArray = new Float32Array( vertexes * 3 );
            var positions = new THREE.BufferAttribute( posArray, 3 );

            for(var i = 0; i < starCount; i++) {

                //  indices
                //  5------------4,2
                //  |            /|
                //  |          /  |
                //  |        /    |
                //  |      /      |
                //  |    /        |
                //  |  /          |
                //  |/            |
                // 0,3 -----------1

                var index = i * 6;

                positions.setXYZ( index + 0, -0.5,  0.5, 0 );
                positions.setXYZ( index + 1,  0.5,  0.5, 0 );
                positions.setXYZ( index + 2,  0.5, -0.5, 0 );

                positions.setXYZ( index + 3, -0.5,  0.5, 0 );
                positions.setXYZ( index + 4,  0.5, -0.5, 0 );
                positions.setXYZ( index + 5, -0.5, -0.5, 0 );

            }

            geometry.addAttribute( "position", positions );

            var sizes = new THREE.BufferAttribute( new Float32Array(vertexes), 1 );
            var thetas = new THREE.BufferAttribute( new Float32Array(vertexes), 1 );
            var phis = new THREE.BufferAttribute( new Float32Array(vertexes), 1 );

            for(var i = 0; i < vertexes; i++) {

                sizes.setX(i, 1);
                thetas.setX(i, 0);
                phis.setX(i, 0);

            }

            geometry.addAttribute( "size", sizes );
            geometry.addAttribute( "theta", thetas );
            geometry.addAttribute( "phi", phis );

            return geometry;

        }

        function updateAttributes(data) {

            var attributes = that.mesh.geometry.attributes;

            for(var i = 0; i < data.length; i++) {

                for(var j = 0; j < 6; j++) {

                    var index = i * 6 + j;

                    attributes.size.setX(index, data[i].size);
                    attributes.theta.setX(index, data[i].theta);
                    attributes.phi.setX(index, data[i].phi);

                }

            }

        }

        function createMesh(geometry, material, scene) {

            var mesh = new THREE.Mesh(geometry, material);
            mesh.frustumCulled = false;
            scene.add(mesh);

            return mesh;

        }

    }

});
