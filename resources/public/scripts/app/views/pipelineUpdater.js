define(['views/materials'], function (materials) {

  function pulserFn(sphere, fromScale, toScale) {
    return function () {

      if (sphere.pulserRunning) {
        return;
      }

      var backTween = new TWEEN.Tween({x: toScale})
        .to({x: fromScale}, 100)
        .easing(TWEEN.Easing.Elastic.In)
        .onUpdate(function () {
          sphere.scale.set(this.x, this.x, this.x);
        })
        .onComplete(function () {
          sphere.pulserRunning = false;
        });

      new TWEEN.Tween({x: fromScale})
        .to({x: toScale}, 100)
        .easing(TWEEN.Easing.Linear.None)
        .onUpdate(function () {
          sphere.scale.set(this.x, this.x, this.x);
        })
        .onComplete(function () {
          backTween.start();
        })
        .start();
    }
  }

  function pulse(sphere) {
    if (sphere.pulser) {
      sphere.pulser();
      return;
    }

    var scale = sphere.scale.x;
    var shrinkScale = parseInt(scale/2);

    sphere.pulser = pulserFn(sphere, scale, shrinkScale);

    sphere.pulser();
  }

  function update(sphere, pipelineData) {
    var ballColor = materials(pipelineData, {onlyBallColor: true});
    sphere.material.color = ballColor;

    if (pipelineData.prognosis === "sick") {
      pulse(sphere);
    }
  }

  return update;

});