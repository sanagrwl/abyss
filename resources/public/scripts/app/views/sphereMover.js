define(function () {
  function moveObj(from, to, duration, cb) {

    new TWEEN.Tween(from)
      .to(to, duration)
      .easing(TWEEN.Easing.Exponential.Out)
      .onUpdate(function () {
        cb(this.x, this.y, this.z);
      }).start();

  }

  return moveObj;
})