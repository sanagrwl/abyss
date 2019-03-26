define(['views/pipelineUpdater', 'views/pipelineCreator',
    'views/scene', 'views/camera', 'views/pipelineText', 'views/pipelineProgress'],
  function (pipelineUpdater, pipelineCreator, scene, camera, pipelineText, pipelineProgress) {

    var nonGreenBuilds = {};
    var sphereScale = 15;
    var distanceBetweenSpheres = 30;
    var group_z_position = 300;
    var camera_default_z_location = 340;

    function spriteFromGroup(grp) {
      return grp.children[0];
    }

    function progressFromGroup(grp) {
      return grp.children[1];
    }

    function sphereFromGroup(grp) {
      return grp.children[2];
    }

    function createGroup(sphere, sprite, progress) {
      var group = new THREE.Object3D();

      group.add(sprite);
      group.add(progress);
      group.add(sphere);
      return group;
    }

    function adjustCameraPosition(camera_z_location) {
      var spheresCenter = new THREE.Vector3(0, 0, 0);

      var groups = _.values(nonGreenBuilds);

      _.each(groups, function (grp) {
        spheresCenter.add(grp.position);
      });

      spheresCenter.divideScalar(groups.length);


      camera.___moveCamera({x: spheresCenter.x, y: 0, z: camera_z_location}, 3000);
      return spheresCenter;
    }

    function rotateGroup(grp) {
      var sphere = sphereFromGroup(grp);
      sphere.__rotateOnAxis();

      var text = spriteFromGroup(grp);
      text.___rotate();

      var progress = progressFromGroup(grp);
      progress.___rotate();
    }

    function move(group, to, duration, onComplete) {
      var t = new TWEEN.Tween(group.position)
        .to(to, duration)
        .easing(TWEEN.Easing.Exponential.Out)
        .onUpdate(function () {
          group.position.x = this.x || group.position.x;
          group.position.y = this.y || group.position.y;
          group.position.z = this.z || group.position.z;
        });

      if (onComplete) {
        t.onComplete(onComplete);
      }

      t.start();
    }


    function adjustRows() {
      var groups = _.values(nonGreenBuilds);

      var count = 0;
      var maxInCircle = 0;
      var updatedDistance = 0;
      var updatedCameraZLocation = camera_default_z_location;

      _.each(groups, function (grp, i) {
        rotateGroup(grp);

        var angleFromCenter = 360 / maxInCircle;

        if (i === 0) {
          move(grp, {x: 0, y: 0, z: group_z_position}, 2000);
        } else {
          var degrees = count++ * angleFromCenter;
          var radians = degrees * (Math.PI / 180);
          var newPos = {
            x: Math.cos(radians) * updatedDistance,
            y: Math.sin(radians) * updatedDistance,
            z: group_z_position
          };

          move(grp, newPos, 2000);
        }

        updatedCameraZLocation += groups.length == 1 ? -10 : 3;
        updatedCameraZLocation += groups.length > 5 ? 2 : 0;

        if (count === maxInCircle) {
          count = 0;
          maxInCircle = maxInCircle + 6;
          updatedDistance += distanceBetweenSpheres;
        }
      });

      return adjustCameraPosition(updatedCameraZLocation);
    }

    function updatePipeline(pipelineSphereAndTextGroup, data) {
      var sphere = sphereFromGroup(pipelineSphereAndTextGroup);
      pipelineUpdater(sphere, data);
    }

    function addPipelineToFocusGroup(data) {
      var sphere = pipelineCreator.create(data, sphereScale);

      sphere.position.set(0, 0, 0);
      var sprite = pipelineText.create(data.name);

      sprite.position.set(0, 0, 0);
      sprite.scale.set(30, 30, 1.0);

      var progress = pipelineProgress.create()
      progress.position.set(0, 0, 0);
      progress.scale.set(30, 30, 1.0);

      var group = createGroup(sphere, sprite, progress);
      nonGreenBuilds[data.name] = group;

      scene.add(group);
    }

    function focusOn(data) {
      var group = nonGreenBuilds[data.name];
      if (group) {
        updatePipeline(group, data)
      } else {
        addPipelineToFocusGroup(data);
      }
    }

    function removeNonExistingPipelines(projectData) {
      var previousPipelineNames = _.keys(nonGreenBuilds);
      var newPipelineNames = _.pluck(projectData, "name");

      var nonExistingPipelineNames = _.xor(newPipelineNames, previousPipelineNames);

      nonExistingPipelineNames.forEach(function (name) {
        var grp = nonGreenBuilds[name];

        if (grp) {
          var sphere = sphereFromGroup(grp);
          pipelineUpdater(sphere, {prognosis: 'healthy'});

          delete nonGreenBuilds[name];
          move(grp, {x: 0, y: 0, z: 0}, 2000, function () {
            scene.remove(grp)
          });
        }
      });
    }

    function update(brokenData, sickBuildingData, healthyBuildingData) {
      var nonGreenPipelinesData = brokenData.concat(sickBuildingData).concat(healthyBuildingData);
      nonGreenPipelinesData.forEach(focusOn);

      removeNonExistingPipelines(nonGreenPipelinesData)
    }

    function count() {
      return _.keys(nonGreenBuilds).length;
    }

    return {
      update: update,
      count: count,
      focus: function () {
        var center = adjustRows();
        camera.lookAt(center)
      }
    };


  });