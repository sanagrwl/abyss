requirejs.config({
  baseUrl: 'scripts/app',
  paths: {
    lib: '../lib',
    jquery: '../lib/jquery',
    repository: 'server/repository',
    three: '../lib/three',
    lodash: '../lib/lodash',
    text: '../lib/requireText',
    glitchpass: '../lib/glitchpass',
    effectComposer: '../lib/effectComposer',
    renderPass: '../lib/renderPass',
    copyShader: '../lib/copyShader',
    shaderPass: '../lib/shaderPass',
    digitalGlitch: '../lib/digitalGlitch',
    maskPass: '../lib/maskPass',
    skyShader: '../lib/skyShader'
  },

  shim: {
    three: {exports: 'THREE'},
    jquery: {exports: '$'},
    lodash: {exports: '_'},
    effectComposer: {exports: 'THREE', deps: ['three']},
    glitchpass: {exports: 'THREE', deps: ['three']},
    renderPass: {exports: 'THREE', deps: ['three']},
    copyShader: {exports: 'THREE', deps: ['three']},
    shaderPass: {exports: 'THREE', deps: ['three']},
    digitalGlitch: {exports: 'THREE', deps: ['three']},
    maskPass: {exports: 'THREE', deps: ['three']},
    skyShader: {exports: 'THREE', deps: ['three']}
  }
});


require(['main', 'config', 'three', 'lib/tween', 'jquery', 'lodash',
    'effectComposer', 'renderPass', 'glitchpass', 'copyShader', 'shaderPass', 'digitalGlitch',
    'maskPass', 'skyShader'],
  function (main, config) {
    var url = config.cctrayUrl();
    var includeFilter = config.includeFilter();
    var excludeFilter = config.excludeFilter();

    _.isEmpty(config.cctrayUrl()) ? config.show() : main(url, includeFilter, excludeFilter)
  });


