require(['detector', 'app'], function(Detector, App) {

    if (!Detector.webgl) {
        Detector.addGetWebGLMessage();
    }
    else {
    	new App().run();
        document.getElementById('threejs-container').innerHTML = "";
    }
});
