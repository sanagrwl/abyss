define(['settings'], function (settings) {

  function filteredPipelinesNames(cctrayUrl, filter, exclude) {
    return $.get("/filternames", {url: cctrayUrl, select: filter, exclude: exclude})
      .then(function (data) {
        return data.names;
      });
  }

  function pipelines(cctrayUrl, filter, exclude) {
    return $.get("/pipelines", {
      url: cctrayUrl,
      select: filter,
      exclude: exclude,
      "red-alert-threshold": settings.redAlertThreshold(),
      "glitch-effect-threshold": settings.glitchEffectThreshold()
    });
  }

  return {
    filteredPipelinesNames: filteredPipelinesNames,
    pipelines: pipelines
  }

});