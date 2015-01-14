var require = {

  // Default load path for js files
  baseUrl: 'javascript/app',

  shim: {

    // --- Use shim to mix together all THREE.js subcomponents
    'threeCore': { exports: 'THREE' },
    'threeTrackballControls': { deps: ['threeCore'], exports: 'THREE' },
    'threeOrbitControls': { deps: ['threeCore'], exports: 'THREE' },
    'threeFlyControls': { deps: ['threeCore'], exports: 'THREE' },
    'threeOctree': { deps: ['threeCore'], exports: 'THREE' },
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
    threeOctree: '../lib/Octree',
    threeFlyControls: '../lib/FlyControls',
    threeTrackballControls: '../lib/TrackballControls',
    threeOrbitControls: '../lib/OrbitControls',
    // --- end THREE sub-components
    jquery: '../lib/jquery',
    statsCore: '../lib/stats',
    rendererStatsCore: '../lib/threex.rendererstats',
    detector: '../lib/Detector',
    seedrandom: '../lib/seedrandom.min',
  },

  //urlArgs: "bust=" + (new Date()).getTime(),

};
