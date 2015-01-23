require(['detector', 'app'], function(Detector, App) {

	if(Detector.webgl) {
    	var app = new App(515125);
    	app.run();
	}
	else {
		Detector.addGetWebGLMessage();
	}
});
