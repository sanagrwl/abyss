define(['store', 'repository', 'jquery', 'lodash'], function (store, repo) {

  var cctrayUrlStoreKey = "cctrayUrl";
  var filterFieldStoreKey = "filterField";
  var excludeFieldStoreKey = "excludeField";

  var settings = $('#config-interface');
  var filterField = $('#filter-field');
  var excludeField = $('#exclude-field');
  var selectedPipelinesField = $('#selected-pipelines');
  var cctrayField = $('#ci-url-text');

  function onFail() {
    settings.show(200);
    cctrayField.focus();
    selectedPipelinesField.html('')
  }

  (function setConfigValues() {

    var setVal = function (storageKey, field) {
      var valFromStorage = store.get(storageKey);

      if (!_.isEmpty(valFromStorage)) {
        field.val(valFromStorage);
      }
    };

    setVal(cctrayUrlStoreKey, cctrayField);
    setVal(filterFieldStoreKey, filterField);
    setVal(excludeFieldStoreKey, excludeField);
  })();

  (function bindEvents() {

    $('#settings-close-btn').on('click', function () {
      settings.hide();
    });

    $('#config').on('click', showPipelinesToSelect);

    [filterField, excludeField].forEach(function (f) {
      f.on('keyup', _.debounce(showPipelinesToSelect, 300));
    });

    $('#ci-url-fetch-btn').on('click', showPipelinesToSelect);

    $('#settings-reset-btn').on('click', function () {
      store.clear();
      location.reload();
    });

    $('#settings-save-btn').on('click', function () {
      store.save(filterFieldStoreKey, filterField.val().trim());
      store.save(excludeFieldStoreKey, excludeField.val().trim());

      if (cctrayField.length > 0) {
        store.save(cctrayUrlStoreKey, cctrayField.val());
      }

      settings.hide();
      location.reload();
    });
  })();

  function showFilteredList(names) {
    selectedPipelinesField.html('');

    var appendName = function (name) {
      selectedPipelinesField.append('<label class="pipeline">' + name + '</label>')
    };

    (names || []).sort().forEach(appendName);
    selectedPipelinesField.show(250);
  }

  function showPipelinesToSelect() {
    if (_.isEmpty(cctrayField.val())) { onFail(); }

    return repo.filteredPipelinesNames(cctrayField.val(), filterField.val(), excludeField.val())
      .then(showFilteredList)
      .then(function() { settings.show(300); })
      .then(function() { selectedPipelinesField.show(300); })
      .fail(onFail);
  }

  return {
    cctrayUrl: function () { return cctrayField.val(); },
    includeFilter: function () { return filterField.val(); },
    excludeFilter: function () { return excludeField.val(); },
    show: showPipelinesToSelect
  };

});