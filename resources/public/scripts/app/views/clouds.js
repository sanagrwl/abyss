define(['views/camera', 'views/scene'], function (camera, scene) {

  var moveFn, moveOffset = 0.5,mesh;

  function slowDown(currentSpeed, nextMoveFn, currentMoveFn) {
    var newSpeed = currentSpeed;
    moveFn = function() {
      currentMoveFn(newSpeed)
      if (newSpeed < -1) {
        moveFn = nextMoveFn;
      }
      newSpeed -= 0.01;
    }
  }

  function init() {
    if (mesh) { return; }
    moveFn = function() {
      if (mesh.position.x < -300) {
        mesh.position.x += 2;
      } else {
        slowDown(2, moveRight, function(newOffset) {
          mesh.position.x += newOffset;
        })
      }
    };

    var texture = THREE.ImageUtils.loadTexture( '/images/cloud.png', null );
    texture.magFilter = THREE.LinearMipMapLinearFilter;
    texture.minFilter = THREE.LinearMipMapLinearFilter;

    var fog = new THREE.Fog( 0x4584b4, - 100, 1000 );

    var material = new THREE.ShaderMaterial( {

      uniforms: {

        "map": { type: "t", value: texture },
        "fogColor" : { type: "c", value: fog.color },
        "fogNear" : { type: "f", value: fog.near },
        "fogFar" : { type: "f", value: fog.far }

      },
      vertexShader: document.getElementById( 'dark-cloud-vs' ).textContent,
      fragmentShader: document.getElementById( 'dark-cloud-fs' ).textContent,
      depthWrite: false,
      depthTest: false,
      transparent: true

    } );

    var geometry = new THREE.Geometry();
    var plane = new THREE.Mesh( new THREE.PlaneGeometry( 64, 64 ) );

    for ( var i = 0; i < 750; i++ ) {

      plane.position.x = Math.random() * 1000 - 400;
      plane.position.y = Math.random() * 400;
      plane.position.z = i;
      plane.rotation.z = Math.random() * Math.PI;
      plane.scale.x = plane.scale.y = Math.random() * Math.random() * 1.5 + 0.5;

      plane.updateMatrix();

      geometry.merge(plane.geometry, plane.matrix)
    }

    mesh = new THREE.Mesh( geometry, material );
    mesh.position.x = -1000;
    scene.add( mesh );
  }

  function moveRight() {
    mesh.position.x += moveOffset;
    if (mesh.position.x > 230) {
      slowDown(moveOffset, moveLeft, function(newOffset) {
        mesh.position.x += newOffset;
      });
    }
  }

  function moveLeft() {
    mesh.position.x -= moveOffset;
    if (mesh.position.x < -200) {
      slowDown(moveOffset, moveRight, function(newOffset) {
        mesh.position.x -= newOffset;
      });
    }
  }

  function disperse() {
    if (mesh) {
      mesh.position.y += 1.8;
      if (mesh.position.y > 400) {
        scene.remove(mesh);
        mesh = null;
      }
    }
  }

  function animate(cloudsEnabled) {
    if (cloudsEnabled) {
      init();
    } else {
      moveFn = disperse;
    }
    moveFn();
  }

  return {
    animate: animate
  }
});