define(['repository', 'views/materials', 'views/scene', 'views/camera', 'views/allPipelinesTarget',
    'views/nonGreenBuilds', 'views/pipelineUpdater', 'views/pipelineCreator', 'settings'],
  function (repository, materials, scene, camera, target, nonGreenBuilds, pipelineUpdater, pipelineCreator, settings) {

    var sphereScale = 15;

    var pipelineSpheres = {};
    var spherePositions = [];
    var scales = [];

    function createPipelineSphere(projectData) {
      var sphere = pipelineCreator.create(projectData, sphereScale);

      pipelineSpheres[projectData.name] = sphere;
      spherePositions.push(sphere.position.clone());
      scales.push(sphereScale * sphereScale);

      scene.add(sphere);

      return sphere;
    }

    function createAllPipelineSpheres(successfulBuilds) {
      successfulBuilds.forEach(createPipelineSphere)
    }

    function updatePositionsAndCalculateCenter(balls) {
      var center = new THREE.Vector3(0, 0, 0);
      balls.forEach(function (s, j) {
        spherePositions[j].copy(s.position);
        center.add(s.position);
      })

      center.divideScalar(balls.length);
      return center;

    }

    function startAnimation() {
      var targetPosition = target();

      var balls = _.values(pipelineSpheres);

      balls.forEach(function (ball, j) {
        ball.__rotateOnAxis();

        var nextPositionHolder = new THREE.Vector3();
        nextPositionHolder.copy(targetPosition);
        nextPositionHolder.sub(ball.position);
        nextPositionHolder.normalize();

        var direction = new THREE.Vector3(0, 0, 0);
        direction.add(nextPositionHolder);
        direction.normalize();

        var repulsion = new THREE.Vector3(0, 0, 0);

        for (var i = j; i < balls.length; i++) {
          nextPositionHolder.copy(ball.position);
          nextPositionHolder.sub(balls[i].position);
          var d = nextPositionHolder.length();
          d -= sphereScale;
          if (d < 0) {
            repulsion.add(nextPositionHolder);
          }
        }

        repulsion.normalize();
        repulsion.multiplyScalar(settings.repulsionFactor());
        direction.add(repulsion);

        direction.multiplyScalar(ball.directionVelocity);

        nextPositionHolder.copy(direction).sub(ball.attractionPosition).multiplyScalar(settings.attractionFactor());
        ball.attractionPosition.add(nextPositionHolder);
        ball.position.add(ball.attractionPosition);
      });

      var centerPosition = updatePositionsAndCalculateCenter(balls);

      if (nonGreenBuilds.count() === 0) {
        camera.lookAt(centerPosition);
      } else {
        nonGreenBuilds.focus();
      }
    }

    function removeNonExistingPipelines(newPipelinesData) {
      var previousPipelineNames = _.keys(pipelineSpheres);
      var newPipelineNames = _.pluck(newPipelinesData, "name");

      var nonExistingPipelineNames = _.xor(newPipelineNames, previousPipelineNames);

      previousPipelineNames.forEach(function (name, index) {
        if (_.contains(nonExistingPipelineNames, name)) {
          var sphere = pipelineSpheres[name];

          scene.remove(sphere)
          delete pipelineSpheres[name];
          spherePositions.splice(index, 1);
          scales.splice(index, 1);
        }
      })
    }

    function updatePipelines(pipelinesData) {
      _.each(pipelinesData, function (data) {
        var sphere = pipelineSpheres[data.name];
        if (!sphere) {
          createPipelineSphere(data);
        } else {
          pipelineUpdater(sphere, data);
        }
      });
    }

    function update(successfulBuilds) {
      $.when(updatePipelines(successfulBuilds))
        .then(function() {
          removeNonExistingPipelines(successfulBuilds);
        });
    }

    return {
      animate: startAnimation,
      init: createAllPipelineSpheres,
      update: update
    };
  });