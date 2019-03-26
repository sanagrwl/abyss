define(['views/camera', 'views/scene'], function (camera, scene) {

  var rain;

  function createRain() {

    var texture = THREE.ImageUtils.loadTexture("/images/raindrop.png");

    var geom2 = new THREE.Geometry();

    var rainMaterial = new THREE.PointCloudMaterial({
      size: 1,
      transparent: true,
      depthTest: false,
      map: texture,
      blending: THREE.AdditiveBlending
    });

    rainMaterial.color.setHSL(1.0, 0.2, 0.5);

    for (var i = 0; i < 6000; i++) {
      var particle = new THREE.Vector3();

      particle.x = _.random(-200, 200);
      particle.y = _.random(1, 400);
      particle.z = _.random(200, 350)

      particle.velocityY = 1 + Math.random();
      particle.velocityX = (Math.random() - 0.5) / 3;
      geom2.vertices.push(particle);
    }

    rain = new THREE.PointCloud(geom2, rainMaterial);
    rain.sortParticles = true;
    scene.add(rain);
  }

  function startRaining() {
    if (!rain) createRain();

    var vertices = rain.geometry.vertices;
    vertices.forEach(function (v) {
      v.y = v.y - (v.velocityY);
      v.x = v.x - (v.velocityX);

      if (v.y <= -100) v.y = _.random(1, 400);
      if (v.x <= -120 || v.x >= 120) v.velocityX = v.velocityX * -1;
    });
  }

  function stopRaining() {
    if (!rain) return;

    var vertices = rain.geometry.vertices;
    var dropsThatAreNotVisible = 0;
    vertices.forEach(function (v) {
      if (v.y > -100) {
        v.y = v.y - 3;
      } else {
        dropsThatAreNotVisible ++;
      }
    });

    if (dropsThatAreNotVisible >= vertices.length) {
      scene.remove(rain);
      rain = null;
    }
  }

  function animate(rainEffectEnabled) {
    if (rainEffectEnabled) {
      startRaining();
    } else {
      stopRaining();
    }
  }

  return {
    animate: animate
  }
});