define(['views/scene', 'views/renderer', 'views/camera',
    'effectComposer', 'renderPass', 'renderPass', 'copyShader',
    'shaderPass', 'digitalGlitch', 'maskPass'],
  function (scene, renderer, camera) {

    var composer = new THREE.EffectComposer(renderer);
    composer.addPass(new THREE.RenderPass(scene, camera));

    var glitchPass = new THREE.GlitchPass();
    glitchPass.renderToScreen = true;

    composer.addPass(glitchPass);

    return composer;
  })