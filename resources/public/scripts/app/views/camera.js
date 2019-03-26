define(['three'], function () {

  function defaultLocation(){
    return  {x: 0, y: 0, z: 200}
  };

  var camera = new THREE.PerspectiveCamera( 50, window.innerWidth / window.innerHeight, 0.5, 2000000 );
  camera.position.z = defaultLocation().z;
  camera.position.y = defaultLocation().y;
  camera.setLens(20);


  function moveCamera(to, duration) {
    new TWEEN.Tween(camera.position)
      .to(to, duration)
      .easing(TWEEN.Easing.Exponential.Out)
      .onUpdate(function() {
        camera.position.x = this.x || camera.position.x;
        camera.position.y = this.y || camera.position.y;
        camera.position.z = this.z || camera.position.z;
      })
      .start();
  }

  camera.___moveCamera = moveCamera;

  return camera;

});