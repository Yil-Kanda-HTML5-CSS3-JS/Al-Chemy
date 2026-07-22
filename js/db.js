// db.js — versión compatible Chrome + Firefox
(function () {
  "use strict";

  // Firefox en modo privado bloquea IndexedDB (indexedDB existe pero .open lanza SecurityError o dispara onerror).
  var idb = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB;
  if (!idb) {
    console.error("IndexedDB no disponible.");
    return;
  }

  var DBNAME  = "TablaPeriodica";
  var STORE   = "elementos";
  var VERSION = 2; // súbelo cuando cambies el esquema

  window.db = null;
  window.elementos = [];

  // 1) Cargar el JSON primero. IMPORTANTE: no abrir la BD hasta tener los datos,
  //    porque onupgradeneeded necesita el array para sembrar el store.
  function fetchElementos() {
    return new Promise(function (resolve, reject) {
      // fetch existe en Chrome/Firefox modernos; fallback a XHR por robustez.
      if (window.fetch) {
        fetch("js/elements.json", { cache: "no-cache" })
          .then(function (r) { if (!r.ok) throw new Error("HTTP " + r.status); return r.json(); })
          .then(resolve).catch(reject);
      } else {
        var xhr = new XMLHttpRequest();
        xhr.open("GET", "js/elements.json", true);
        xhr.onload = function () {
          if (xhr.status === 200) { try { resolve(JSON.parse(xhr.responseText)); } catch (e) { reject(e); } }
          else reject(new Error("HTTP " + xhr.status));
        };
        xhr.onerror = function () { reject(new Error("Error de red")); };
        xhr.send();
      }
    });
  }

  function openDB(data) {
    return new Promise(function (resolve, reject) {
      var req;
      try {
        req = idb.open(DBNAME, VERSION);
      } catch (e) {
        // Firefox en modo privado lanza aquí.
        return reject(e);
      }

      // Firefox dispara onblocked si otra pestaña tiene una versión anterior abierta.
      req.onblocked = function () {
        console.warn("IndexedDB bloqueada: cierra otras pestañas con la app abierta.");
      };

      req.onupgradeneeded = function (event) {
        var database = event.target.result;
        var tx = event.target.transaction; // usar la transacción de upgrade
        var store;

        if (!database.objectStoreNames.contains(STORE)) {
          store = database.createObjectStore(STORE, { keyPath: "id" });
          store.createIndex("numero",  "numero",  { unique: true });
          store.createIndex("simbolo", "simbolo", { unique: true });
          store.createIndex("grupo",   "grupo",   { unique: false });
        } else {
          store = tx.objectStore(STORE);
        }

        // Sembrar / actualizar dentro de la MISMA transacción de upgrade.
        // put() en vez de add() para no fallar en re-siembras.
        for (var i = 0; i < data.length; i++) store.put(data[i]);
      };

      req.onsuccess = function () {
        var database=req.result;
        var tx=database.transaction(STORE,"readwrite");
        var store=tx.objectStore(STORE);
        store.count().onsuccess=function(e){
          if(e.target.result===0){
            data.forEach(function(el){store.put(el);});
          }
        };
        resolve(database);
      };
      req.onerror   = function () { reject(req.error); };
    });
  }

  window.dbReady = fetchElementos()
    .then(function (data) { window.elementos = data; return openDB(data); })
    .then(function (database) {
      window.db = database;
      // Manejo de cambios de versión desde otra pestaña (Firefox lo aplica estrictamente).
      database.onversionchange = function () { database.close(); alert("La BD fue actualizada. Recarga la página."); };
      console.log("IndexedDB lista:", DBNAME, "v" + VERSION);
      return database;
    })
    .catch(function (err) {
      console.error("No se pudo inicializar IndexedDB:", err);
      alert("No se pudo inicializar la base de datos.\nSi usas Firefox en modo privado, ábrelo en modo normal.");
    });
})();
