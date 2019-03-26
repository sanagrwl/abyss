define(['views/camera', 'views/scene'], function (camera, scene) {
  var snowParticles = [];

  function init() {
    var geometry = new THREE.Geometry();

    var sprite1 = THREE.ImageUtils.loadTexture("/images//snowflake1.png");
    var sprite2 = THREE.ImageUtils.loadTexture("/images/snowflake2.png");
    var sprite3 = THREE.ImageUtils.loadTexture("/images/snowflake3.png");
    var sprite4 = THREE.ImageUtils.loadTexture("/images/snowflake4.png");
    var sprite5 = THREE.ImageUtils.loadTexture("/images/snowflake5.png");

    for (var i = 0; i < 4000; i++) {

      var vertex = new THREE.Vector3();
      vertex.x = Math.random() * 2000 - 1000;
      vertex.y = Math.random() * 2000 - 1000;
      vertex.z = Math.random() * 2000 - 1000;

      geometry.vertices.push(vertex);

    }

    var parameters = [
      [[1.0, 0.2, 0.5], sprite2, 20],
      [[0.95, 0.1, 0.5], sprite3, 15],
      [[0.90, 0.05, 0.5], sprite1, 10],
      [[0.85, 0, 0.5], sprite5, 8],
      [[0.80, 0, 0.5], sprite4, 5],
    ];

    parameters.forEach(function (p) {

      var color = p[0];
      var sprite = p[1];
      var size = p[2];

      var mat = new THREE.PointCloudMaterial({
        size: size,
        map: sprite,
        blending: THREE.AdditiveBlending,
        depthTest: false,
        transparent: true
      });
      mat.color.setHSL(color[0], color[1], color[2]);

      var particles = new THREE.PointCloud(geometry, mat);

      particles.rotation.x = Math.random() * 6;
      particles.rotation.y = Math.random() * 6;
      particles.rotation.z = Math.random() * 6;

      snowParticles.push(particles);
      scene.add(particles);

    });
  }

  function stopSnowing() {
    snowParticles.forEach(function (sp) {
      scene.remove(sp)
    });
    snowParticles = [];
  }

  var snowSpeedMultiplier = 0.00005;
  function updateSnowSpeed(blizzardEffectEnabled) {
    if (blizzardEffectEnabled) {
      snowSpeedMultiplier = 0.0005;
    } else {
      snowSpeedMultiplier = 0.00005
    }
  }

  function startSnowing() {
    if (snowParticles.length === 0) {
      init();
    }

    var time = Date.now() * snowSpeedMultiplier;
    snowParticles.forEach(function (sp, i) {
      sp.rotation.y = time * ( i < 4 ? i + 1 : -( i + 1 ) );
    });
  }

  function animate(snowEffectEnabled, blizzardEffectEnabled) {

    if (snowEffectEnabled) {
      startSnowing();
      updateSnowSpeed(blizzardEffectEnabled)
    } else {
      stopSnowing();
    }
  }

  return {
    animate: animate
  }
});