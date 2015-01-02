var require = {

  // Default load path for js files
  baseUrl: 'javascript/app',

  shim: {

    // --- Use shim to mix together all THREE.js subcomponents
    'threeCore': { exports: 'THREE' },
    'threeFlyControls': { deps: ['threeCore'], exports: 'THREE' },
    // --- end THREE sub-components
    'statsCore': { exports: 'Stats' },
    'rendererStatsCore': { exports: 'THREEx'},
    'detector': { exports: 'Detector' },

  },
  // Third party code lives in js/lib
  paths: {

    // --- start THREE sub-components
    three: '../lib/three',
    threeCore: '../lib/three.min',
    threeFlyControls: '../lib/FlyControls',
    // --- end THREE sub-components
    jquery: '../lib/jquery',
    statsCore: '../lib/stats',
    rendererStatsCore: '../lib/threex.rendererstats',
    detector: '../lib/Detector',
    seedrandom: '../lib/seedrandom.min',
  }

};