define(['settings'], function (settings) {

    var radius = 125;
    var angle = Math.PI * 1.5;
    var size = 380;

    function textMaterial(canvas) {
        var amap = new THREE.Texture(canvas);
        amap.needsUpdate = true;

        return new THREE.SpriteMaterial({
            map: amap,
            transparent: false,
            useScreenCoordinates: false,
            color: 0xffffff
        });
    }

    function renderDataForText(text) {
        // I hate this logic. If someone can come up with better solution, please do.
        // I can't spend time on this.
        // Too long of a name is a problem the way text/shape/canvas/webgl/grouping of objects is rendered.
        // NEED BETTER LOGIC than this.
        var shortenedText = text + ' ', fontSize = 50, numPadsPerLetter = 0.3;
        var minNumPadsPerLetter = 0.125, minFontSize = 30;
        var fontsizeMultiplier = 0.55;

        var calculateNumPadsLetter = function(text) {
            var v = numPadsPerLetter - 0.009 * (text.length - 20);
            return v >= minNumPadsPerLetter ? v : minNumPadsPerLetter;
        };

        var calculateFontSize = function(text) {
            var v = 50 - fontsizeMultiplier * (text.length - 20);
            return v >= minFontSize ? v : minFontSize;
        }

        if (shortenedText.length > 50) {
            shortenedText = shortenedText.substr(0, 47) + "...";
        }

        if (shortenedText.length > 20) {
            fontSize = calculateFontSize(shortenedText);
            numPadsPerLetter = calculateNumPadsLetter(shortenedText);;
        }

        return {text: shortenedText, fontSize: fontSize + "", numPadsPerLetter: numPadsPerLetter};
    }

    function createCanvas() {
        var canvas = document.createElement('canvas');
        canvas.width = size;
        canvas.height = size;

        return canvas;
    }

    function setTextStyling(context, fontSize) {
        context.font = fontSize + 'pt Calibri';
        context.textAlign = 'center';
        context.fillStyle = 'white';
        context.lineWidth = 4;
    }

    function drawTextAlongArc(canvas, text) {
        var renderData = renderDataForText(text);
        var context = canvas.getContext('2d');

        setTextStyling(context, renderData.fontSize);

        var x = size / 2;
        var y = size / 2;

        context.save();
        context.translate(x, y);
        context.rotate(angle);

        for (var i = 0; i < renderData.text.length; i++) {
            context.save();
            context.rotate(i * renderData.numPadsPerLetter);

            context.fillText(renderData.text[i], 0, -radius);
            context.restore();
        }
        context.restore();
        context.stroke();
    }

    function create(text) {
        var canvas = createCanvas();

        drawTextAlongArc(canvas, text);

        var mat = textMaterial(canvas);
        var sp = new THREE.Sprite(mat);

        sp.___rotate = function () {
            if (settings.rotateNonGreenText()) {
                sp.material.rotation -= 0.008;
            }
        }

        return sp;
    }

    return {
        create: create
    };

});