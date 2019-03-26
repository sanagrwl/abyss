define(['views/scene', 'views/camera', 'skyShader'],
  function (scene, camera) {

    var sky, sunSphere;

    var effectController = {
      turbidity: 10,
      reileigh: 1,
      mieCoefficient: 0.005,
      mieDirectionalG: 0.8,
      luminance: 1,
      inclination: 0.49, // elevation / inclination
      azimuth: 0.25, // Facing front,
      sun: false
    };

    function initializeSun() {
      var uniforms = sky.uniforms;
      uniforms.turbidity.value = effectController.turbidity;
      uniforms.reileigh.value = effectController.reileigh;
      uniforms.luminance.value = effectController.luminance;
      uniforms.mieCoefficient.value = effectController.mieCoefficient;
      uniforms.mieDirectionalG.value = effectController.mieDirectionalG;

      var theta = Math.PI * (effectController.inclination - 0.5);
      var phi = 2 * Math.PI * (effectController.azimuth - 0.5);

      var distance = 400000;
      sunSphere.position.x = distance * Math.cos(phi);
      sunSphere.position.y = distance * Math.sin(phi) * Math.sin(theta);
      sunSphere.position.z = distance * Math.sin(phi) * Math.cos(theta);

      sunSphere.visible = effectController.sun;

      sky.uniforms.sunPosition.value.copy(sunSphere.position);
    }


    function initSky() {

      sky = new THREE.Sky();
      scene.add(sky.mesh);

      sunSphere = new THREE.Mesh(new THREE.SphereGeometry(20000, 30, 30), new THREE.MeshBasicMaterial({color: 0xffffff}));
      sunSphere.position.y = -700000;
      scene.add(sunSphere);

      initializeSun();

      camera.lookAt(sunSphere.position)
    }

    var reileighChange = 0.01

    function illuminatedMoon() {
      if (effectController.reileigh > 0) {
        effectController.reileigh -= reileighChange
        initializeSun();
      }
    }

    function sunrise() {
      if (effectController.reileigh < 1) {
        effectController.reileigh += reileighChange
        initializeSun();
      }
    }

    function update(nightTime) {
      if (nightTime) {
        illuminatedMoon();
      } else {
        sunrise();
      }
    }

    return {
      init: initSky,
      update: update
    };


  });