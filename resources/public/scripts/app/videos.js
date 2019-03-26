define(['jquery'], function() {

  function createVideoMap() {
    var videoOverlay = document.getElementById('video-overlay');

    function loadVideo(path, index) {
      var videoElm = document.createElement('video');
      videoElm.src = path;
      videoElm.id = "video" + index;
      videoOverlay.appendChild(videoElm);
      videoElm.onended = function(e) {
        $("#" + videoElm.id).hide();
      };
      //var a = new Audio(path);
      //a.addEventListener('ended', function() { a.currentTime = 0; });
      return videoElm.id;
    }

    var aMap = {};

    $('#standup-list option').each(function (index, o) {
      var path = o.value;
      if (path !== "none" && _.contains(path, '/videos/')) {
        aMap[path] = loadVideo(path, index)
      }
    });

    return aMap;
  }

  var allVideoMap = createVideoMap();

  function playVideo(path) {
    var elmId = allVideoMap[path];
    if (elmId) {
      var $elm = $("#" + elmId);
      $elm.prop('width', window.innerWidth);
      $elm.prop('height', window.innerHeight);
      $elm.show();
      $elm[0].play();
    }
  }

  return {
    playVideo: playVideo
  };

});