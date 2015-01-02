define(["statsCore", "rendererStatsCore"], function(Stats, THREEx) {

    var stats = new Stats();
    stats.domElement.style.position = 'absolute';
    stats.domElement.style.top = '0px';
    document.body.appendChild(stats.domElement);

    var rendererStats = new THREEx.RendererStats();
    rendererStats.domElement.style.position = 'absolute';
    rendererStats.domElement.style.bottom = '0px';
    document.body.appendChild(rendererStats.domElement);

    return {

        update: function(renderer) {

            stats.update();
            rendererStats.update(renderer);

        },

    };
})
