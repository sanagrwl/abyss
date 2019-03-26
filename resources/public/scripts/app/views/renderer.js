define(['three'], function() {

  var renderer = new THREE.WebGLRenderer( { antialias: true });
  renderer.setSize( window.innerWidth, window.innerHeight );
  document.getElementById("container").appendChild(renderer.domElement);

  renderer.setClearColor( 0, 1 );
  //renderer.setPi( window.devicePixelRatio );

  return renderer;
});