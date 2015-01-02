require( ['detector', 'app', 'container'], function ( Detector, app, container ) {

    if ( ! Detector.webgl ) {

        Detector.addGetWebGLMessage();

    }
    else {

        app.run();
        container.innerHTML = "";

    }

} );
