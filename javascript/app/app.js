define(function (require) {

    var THREE = require("three"),
        camera = require("camera"),
        controls = require("controls"),
        renderer = require("renderer"),
        globalScene = require("scene"),
        stats = require("stats"),
        planetManager = require("planet/planetManager"),
        heightmapManager = require("planet/heightmapManager"),
        PlanetContainer = require('containers/planetContainer'),
        PlanetFactory = require('factories/planetFactory'),
        seedrandom = require('seedrandom');

    var planetContainer = new PlanetContainer();
    var planetFactory = new PlanetFactory();
    var randomGen = seedrandom(123);

    var newPlanet = planetFactory.createPlanet(randomGen().toString());
    newPlanet.position.z -= 60000;
    newPlanet.position.x += 20000;

    planetContainer.addPlanet(newPlanet);
    var scene = new THREE.Scene();
    scene.add(planetContainer.planets);

    function run() {

        var clock = new THREE.Clock();
        planetManager.generatePlanets();

        function render() {

            var delta = clock.getDelta();
            requestAnimationFrame(render);

            planetContainer.updateAll();
            heightmapManager.update();
            controls.update(delta);
            camera.updateFrustum();
            stats.update(renderer);
            renderer.render(scene, camera);
        }

        render();

    }

    return {run: run};
});
