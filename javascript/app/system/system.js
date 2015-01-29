define(['three'], function(THREE) {

    function System(sun, planets) {

        THREE.Object3D.call(this);

        this.sun = sun;
        this.planets = planets;

        this.add(sun);

        for(var i=0; i<planets.length; i++) {

            this.add(planets[i]);

        }

    }

    System.prototype = Object.create(THREE.Object3D.prototype);
    System.prototype.constructor = System;
    System.prototype.update = function(camera) {

        this.sun.update(camera);
        for(var i=0; i<this.planets.length; i++) {

            this.planets[i].update(camera);

        }

    }
    System.prototype.dispose = function(camera) {

        this.sun.dispose();
        for(var i=0; i<this.planets.length; i++) {

            this.planets[i].dispose();

        }

    }

    return System;



});
