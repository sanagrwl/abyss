define(['views/scene', 'three'], function(scene){

  function directionalLight() {
    var light = new THREE.DirectionalLight( 0xffffff , 1.3);
    light.position.set( 300, 1000, 500 );
    light.target.position.set( 0, 0, 0 );
    return light;
  }

  function spotLight() {
    var light = new THREE.SpotLight( 0xffffff );
    light.position.set( -300, -1000, 500 );
    light.target.position.set(0, 0, 0);
    return light;
  }

  [
    new THREE.AmbientLight( 0x000000 ),
    directionalLight(),
    spotLight()
  ].forEach(function(light) {
    scene.add(light);
  });

});