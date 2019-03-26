define(function() {

  function get(key) { return localStorage.getItem(key); }

  function remove(key) { localStorage.removeItem(key); }

  function save(key, val) { localStorage.setItem(key, val); }

  function clear(key, val) { localStorage.clear(); }

  return {
    get: get,
    remove: remove,
    save: save,
    clear: clear
  };

});