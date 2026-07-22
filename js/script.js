var modal = document.getElementById("element");

(function () { console.log('Función inicial'); }());

window.onclick = function (event) {
  if (event.target === modal) modal.style.display = "none";
};

window.oncontextmenu = function (event) {
  if (event && event.button === 2) alert('Al-Chemy, creada por © Yil Kanda');
  return false;
};

function openModalElement(id) {
  modal.style.display = "block";
  read(id);
}

// Lee un elemento por id (o por número atómico) desde IndexedDB y lo pinta.
function read(id) {
  var key = String(id);
  var content = document.getElementById("modal-content");
  content.innerHTML = "<p style='padding:1rem'>Cargando…</p>";

  window.dbReady.then(function () {
    var tx = window.db.transaction("elementos", "readonly");
    var store = tx.objectStore("elementos");

    // La store usa keyPath "id"; si tus ids coinciden con el número atómico basta con get(key).
    // Como fallback, si no aparece por id, buscamos por el índice "numero".
    var req = store.get(key);
    req.onsuccess = function () {
      if (req.result) return render(req.result);
      var byNum = store.index("numero").get(key);
      byNum.onsuccess = function () {
        if (byNum.result) render(byNum.result);
        else content.innerHTML = "<p style='padding:1rem'>Elemento no encontrado.</p>";
      };
      byNum.onerror = fail;
    };
    req.onerror = fail;

    function fail(e) {
      console.error(e);
      content.innerHTML = "<p style='padding:1rem'>Error leyendo la base de datos.</p>";
    }
  });
}

function render(el) {
  var rows = [
    ["Número atómico", el.numero],
    ["Nombre",         el.nombre],
    ["Símbolo",        el.simbolo],
    ["Masa atómica",   el.masaAtomica],
    ["Valencia",       el.valencia],
    ["P. ebullición",  el.ebullicion],
    ["P. fusión",      el.fusion],
    ["Densidad",       el.densidad],
    ["Config. electrónica", el.confElectronica],
    ["Grupo",          el.grupo],
    ["Descubrimiento", el.descubrimiento],
    ["Descubridor",    el.descubridor],
    ["Etimología",     el.etimologia],
  ];
  var html = ''
    + '<span class="close" onclick="document.getElementById(\'element\').style.display=\'none\'" style="float:right;cursor:pointer;font-size:1.4rem">&times;</span>'
    + '<h2 style="margin-top:0">' + escape(el.nombre) + ' (' + escape(el.simbolo) + ')</h2>'
    + '<table style="width:100%;border-collapse:collapse">';
  for (var i = 0; i < rows.length; i++) {
    html += '<tr>'
         +  '<th style="text-align:left;padding:4px 8px;border-bottom:1px solid #333">' + rows[i][0] + '</th>'
         +  '<td style="padding:4px 8px;border-bottom:1px solid #333">' + escape(rows[i][1] == null ? "—" : rows[i][1]) + '</td>'
         +  '</tr>';
  }
  html += '</table>';
  document.getElementById("modal-content").innerHTML = html;
}

function escape(v) {
  return String(v).replace(/[&<>"']/g, function (c) {
    return ({ "&":"&amp;", "<":"&lt;", ">":"&gt;", '"':"&quot;", "'":"&#39;" })[c];
  });
}

function welcome() {
  alert('Tabla Periódica de los Elementos\n\n…');
}

function addDB() {
  var v = function (id) { return document.getElementById(id).value; };
  add(v("numero"), v("nombre"), v("simbolo"), v("masaAtomica"), v("valencia"),
      v("ebullicion"), v("fusion"), v("densidad"), v("confElectronica"),
      v("grupo"), v("descubrimiento"), v("descubridor"), v("etimologia"));
}

function url(_url) {
  window.location.href = String(_url);
}
