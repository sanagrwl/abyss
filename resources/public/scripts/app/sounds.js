define(["settings"], function(settings) {

  function createAudioMap() {

    function loadAudio(path) {
      var a = new Audio(path);
      a.addEventListener('ended', function() { a.currentTime = 0; });
      return a;
    }

    var aMap = {};

    $('#sick-to-healthy-build-sound-list option').each(function (index, o) {
      var audioPath = o.value;
      if (audioPath !== "none") {
        aMap[audioPath] = loadAudio(audioPath)
      }
    });

    return aMap;
  }

  var allAudioMap = createAudioMap();
  var previousHealthyBuilding = [];
  var previousSickBuilding = [];

  function audioPlaying(audio) {
    return audio.currentTime != 0;
  }

  function playSound(sound) {
    var audioForSound = allAudioMap[sound];
    if (audioForSound && !audioPlaying(audioForSound)) {
      audioForSound.play();
    }
  }

  function playSoundFor(data, compareList, sound) {
    data.forEach(function(d) {
      if (_.contains(compareList, d.name)) {
        playSound(sound);
        return;
      }
    })
  }

  function checkSickBuildingSuccess(healthy) {
    playSoundFor(healthy, previousSickBuilding, settings.selectedBrokenToHealtySound());
  }

  function checkBrokenBuild(sick) {
    var allPreviousBuilding = previousHealthyBuilding.concat(previousSickBuilding);

    playSoundFor(sick, allPreviousBuilding, settings.selectedBrokenBuildSound());
  }

  function updatePreviousBuilding(sickBuilding, healthyBuilding) {
    previousHealthyBuilding = _.pluck(healthyBuilding, "name");
    previousSickBuilding = _.pluck(sickBuilding, "name");
  }

  function play(healthy, sick, sickBuilding, healthyBuilding) {
    checkSickBuildingSuccess(healthy);
    checkBrokenBuild(sick);

    updatePreviousBuilding(sickBuilding, healthyBuilding)
  }

  return {
    play: play,
    playSound: playSound
  };

});