define(['three'],
  function () {

    var colors = {
      healthy: "rgb(127,255,0)",
      'healthy-building': "rgb(255,255,0)",
      sick: "rgb(255,0,0)",
      'sick-building': "rgb(255,140,0)",
      sleeping: "rgb(169,169,169)"
    };

    function ballColor(pipelineData) {
      var color = colors[pipelineData.prognosis] || colors.sleeping;
      return new THREE.Color(color);
    }

    function pipelineMaterial(pipelineData, options) {
      var color = ballColor(pipelineData);

      options = options || {};
      if (options.onlyBallColor) {
        return color;
      }

      var mat = new THREE.MeshLambertMaterial();
      mat.color = ballColor(pipelineData);
      mat.ambient = mat.color;
      mat.shading = THREE.FlatShading;
      return mat;
    }

    return pipelineMaterial;
  });