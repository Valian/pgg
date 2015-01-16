var require = {
  baseUrl: 'javascript/app',
  shim: {
    threeCore: {exports: 'THREE'},
    threeTrackballControls: {deps: ['threeCore'], exports: 'THREE'},
    threeOrbitControls: {deps: ['threeCore'], exports: 'THREE'},
    threeFlyControls: {deps: ['threeCore'], exports: 'THREE'},
    threeOctree: {deps: ['threeCore'], exports: 'THREE'},
    threePointerLockControls: {deps: ['threeCore'], exports: 'THREE'},
    statsCore: {exports: 'Stats'},
    rendererStatsCore: {exports: 'THREEx'},
    threeWindowResize: {exports: 'THREEx'},
    threeFullScreen: {exports: 'THREEx'},
    detector: {exports: 'Detector'},
  },
  paths: {
    three: '../lib/three',
    threeCore: '../lib/three.min',
    threeOctree: '../lib/Octree',
    threeFlyControls: '../lib/FlyControls',
    threeFullScreen: '../lib/threex.fullscreen',
    threeWindowResize: '../lib/THREEx.WindowResize',
    threeTrackballControls: '../lib/TrackballControls',
    threePointerLockControls: '../lib/PointerLockControls',
    threeOrbitControls: '../lib/OrbitControls',
    jquery: '../lib/jquery',
    statsCore: '../lib/stats',
    rendererStatsCore: '../lib/threex.rendererstats',
    detector: '../lib/Detector',
    seedrandom: '../lib/seedrandom.min',
  },
};
