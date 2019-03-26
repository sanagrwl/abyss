define(['views/timedEvents', 'jquery'], function(timedEvents) {

  var overlay = $('#overlay');

  function triggerRedAlert(enabled) {
    if (enabled) {
      overlay.addClass('red-alert');
    } else {
      overlay.removeClass('red-alert');
    }
  }

  function handleEvents(data) {
    triggerRedAlert(data['red-alert']);

    timedEvents.play();
  };

  return handleEvents;
});