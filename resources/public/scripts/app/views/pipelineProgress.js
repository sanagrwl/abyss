define(function () {

  var percent = 60 / 100;
  var color = '#555555';
  var lineWidth = 55;
  var radius = 110;
  var size = 300;

  var drawCircle = function(ctx) {
    ctx.translate(size / 2, size / 2);
    ctx.rotate((-1 / 2 / 180) * Math.PI);

    percent = Math.min(Math.max(0, percent || 1), 1);
    ctx.beginPath();
    ctx.arc(0, 0, radius, 0, Math.PI * 2 * percent, false);
    ctx.strokeStyle = color;
    ctx.lineCap = 'square';
    ctx.lineWidth = lineWidth;
    ctx.stroke();
  };

  function create() {

    var canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;
    var context = canvas.getContext('2d');

    drawCircle(context);

    var amap = new THREE.Texture(canvas);
    amap.needsUpdate = true;

    var mat = new THREE.SpriteMaterial({
      map: amap,
      transparent: false,
      useScreenCoordinates: false,
      color: 0xffffff
    });

    var sp = new THREE.Sprite(mat);

    sp.___rotate = function() {
      sp.material.rotation -= Math.random() / 10;;
    }

    return sp;
  }

  return {
    create: create
  };

});