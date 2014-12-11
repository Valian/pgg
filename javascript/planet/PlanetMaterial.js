function PlanetMaterial(parameters) {

    this.updateTime = false;
    this.clock = null;

    THREE.ShaderMaterial.call(this, parameters);

    this.update = function() {

        if (this.updateTime) {
            updateTime();
        }

    }

    this.setUniform = function(key, value, type) {

        this.uniforms[key] = {
            value: value,
            type: type
        }

    }

    var updateTime = function() {

        if (!this.clock) {
            this.clock = new THREE.Clock();
        }

        var delta = this.clock.getDelta();
        this.actualTime = (this.actualTime || 0) + delta;

        this.setUniform('time', this.actualTime, 'f');
    }
}

PlanetMaterial.prototype = Object.create(THREE.ShaderMaterial.prototype);

PlanetMaterial.prototype.clone = function() {

    var material = new PlanetMaterial();

    material = THREE.Material.prototype.clone.call(this, material);

    material.updateTime = this.updateTime;

    //from ShaderMaterial clone method
    material.fragmentShader = this.fragmentShader;
    material.vertexShader = this.vertexShader;

    material.uniforms = THREE.UniformsUtils.clone(this.uniforms);

    material.attributes = this.attributes;
    material.defines = this.defines;

    material.shading = this.shading;

    material.wireframe = this.wireframe;
    material.wireframeLinewidth = this.wireframeLinewidth;

    material.fog = this.fog;

    material.lights = this.lights;

    material.vertexColors = this.vertexColors;

    material.skinning = this.skinning;

    material.morphTargets = this.morphTargets;
    material.morphNormals = this.morphNormals;

    return material;
}
