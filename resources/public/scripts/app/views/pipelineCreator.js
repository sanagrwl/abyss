define(['views/materials', 'settings'], function (materials, settings) {

  function vertices() {
    return  [
      -1,-1,-1,    1,-1,-1,    1, 1,-1,    -1, 1,-1,
      -1,-1, 1,    1,-1, 1,    1, 1, 1,    -1, 1, 1,
    ];
  }

  function faces() {
    return [
      2,1,0,    0,3,2,
      0,4,7,    7,3,0,
      0,1,5,    5,4,0,
      1,2,6,    6,5,1,
      2,3,7,    7,6,2,
      4,5,6,    6,7,4
    ];
  }

  var geometries = {
    icosahedron: function() { return new THREE.IcosahedronGeometry(.5, 1);},
    torus: function() { return new THREE.TorusGeometry(0.32, 0.2, 7, 7, 6.3);},
    cylinder: function() { return new THREE.CylinderGeometry(0.31, 0.31, 0.8); },
    cone: function() { return new THREE.CylinderGeometry(0.31, 0, 0.85); },
    coil: function() { return new THREE.TorusKnotGeometry(0.30, 0.05, 200, 10, _.random(1, 10), _.random(1, 15), 1); },
    tetrahedron: function() { return new THREE.TetrahedronGeometry(0.5, 0);},
    octahedron: function() {return new THREE.OctahedronGeometry(0.5, 0)},
    ball: function() {return new THREE.PolyhedronGeometry(vertices(), faces(), 0.5, 3)}
  };

  function randomShape() {
    var allShapes = _.keys(geometries);
    var selectedShapeIndex = _.random(0, allShapes.length - 1);
    return geometries[allShapes[selectedShapeIndex]]();
  }

  var projectShapes = {};


  function createoGeo(projectData) {
    var shapeType = settings.shapeType();
    var shapeFn = geometries[shapeType] || randomShape;
    if (shapeType === "random" && projectShapes[projectData.name]) {
      return projectShapes[projectData.name].clone();
    } else if(shapeType === "random") {
      projectShapes[projectData.name] = shapeFn();
      return projectShapes[projectData.name].clone();
    }
    else {
      projectShapes = {}
    }

    return shapeFn();
  }

  function generateRandomPosition() {
    var radians = 15;
    var phi = Math.random() * 2 * Math.PI;
    var theta = Math.random() * Math.PI;

    var position = new THREE.Vector3();
    position.set(radians * Math.sin(theta) * Math.cos(phi),
      radians * Math.sin(theta) * Math.sin(phi),
      radians * Math.cos(theta));

    return position;
  }

  function createSphere(scale, projectData) {
    var position = generateRandomPosition();

    var g = createoGeo(projectData);

    var material = materials(projectData);

    var mesh = new THREE.Mesh(g, material);
    mesh.position.copy(position);
    mesh.scale.set(scale, scale, scale);
    mesh.rotation.set(Math.random() * 2 * Math.PI, Math.random() * 2 * Math.PI, Math.random() * 2 * Math.PI);

    var rotationAxis = new THREE.Vector3(_.random(0.5,2.5) - Math.random(), _.random(0.5,2.5) - Math.random(), _.random(0.5,2.5) - Math.random());
    rotationAxis.normalize();

    var rotationSpeed =.03 + .02 * Math.random();

    mesh.__rotateOnAxis = function() {
      mesh.rotateOnAxis(rotationAxis, rotationSpeed);
    };

    return mesh;
  }

  function create(projectData, scale) {
    var scaleFactor = 1 - (scale - 5) / 25;

    var originals = {
      attractionPosition: new THREE.Vector3(0, 0, 0),
      directionVelocity: 2. * ( 2. * ( .8 + .2 * scaleFactor ))
    };

    var sphere = createSphere(scale, projectData);

    $.extend(sphere, originals);

    return sphere;
  }

  return {
    create: create
  };
});