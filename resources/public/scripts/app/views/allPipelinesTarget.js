define(['three'], function() {

  var radians = 350;
  var targetPosition = new THREE.Vector3(0, 0, 0);

  var targetMarker = new THREE.Mesh(new THREE.IcosahedronGeometry(10, 2), new THREE.MeshNormalMaterial());
  targetMarker.visible = false;

  function updateTargetPosition() {
    var t = Date.now() * .0001;

    var phi = Math.cos(t * 1.1) * Math.sin(t * .8) * 2 * Math.PI;
    var theta = Math.cos(t * 1.2) * Math.sin(t * .85) * Math.PI;
    var target = new THREE.Vector3(
      radians * Math.sin(theta) * Math.cos(phi),
      radians * Math.sin(theta) * Math.sin(phi),
      radians * Math.cos(theta)
    );

    targetMarker.position.copy(target);
    targetPosition.copy(targetMarker.position);
    return targetPosition;
  }

  return updateTargetPosition;
});