define(['settings', 'sounds', 'videos'], function(settings, sounds, videos) {

  var eventsPlayedToday = {};

  var timedEvents = {
    standUp: settings.standup
  }

  function isWeekDay() {
    return 0 < new Date().getDay() < 6;
  }

  function isWeekend() {
    return !isWeekDay();
  }

  function isMatchingHourAndMin(hour, min) {
    var d = new Date();
    return d.getHours() === hour && d.getMinutes() === min;
  }

  function shouldPlayMedia(standUpTime) {
    if (_.isEmpty(standUpTime) || isWeekend()) return;

    var hour_min = standUpTime.split(":");
    var hour = parseInt(hour_min[0]);
    var min = parseInt(hour_min[1]);

    return isMatchingHourAndMin(hour, min);
  }

  function playMedia(mediaSrc) {
    if (_.contains(mediaSrc, "/sounds/")) {
      sounds.playSound(mediaSrc);
    } else {
      videos.playVideo(mediaSrc);
    }
  }

  function executeEvent(eventName, eventSettings) {
    if (eventsPlayedToday[eventName]) return;

    var mediaSrc = eventSettings.media;
    if (mediaSrc === "none" || !shouldPlayMedia(eventSettings.time)) return;

    eventsPlayedToday[eventName] = true;
    setTimeout(function(){ eventsPlayedToday[eventName] = false; }, 65 * 1000);

    playMedia(mediaSrc);
  }

  function playTimedEvents() {
    _.each(timedEvents, function(settingsFn, eventName) {
        executeEvent(eventName, settingsFn());
    });
  }

  return {
    play: playTimedEvents
  };
})