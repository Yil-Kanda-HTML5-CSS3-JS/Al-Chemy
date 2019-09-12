//prefixes of implementation that we want to test
window.indexedDB = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB;
//prefixes of window.IDB objects
window.IDBTransaction = window.IDBTransaction || window.webkitIDBTransaction || window.msIDBTransaction;
window.IDBKeyRange = window.IDBKeyRange || window.webkitIDBKeyRange || window.msIDBKeyRange;
if (!window.indexedDB) {
	window.alert("Tu navegador no soporta una versión estable de IndexedDB.")
}

DBNAME = "TablaPeriodica";
STORE = "elementos";
VERSION = 1;

var elementos = [];
var xmlhttp = new XMLHttpRequest();
var url = "js/elements.json";

xmlhttp.onreadystatechange = function() {
  if (this.readyState == 4 && this.status == 200) {
    elementos = JSON.parse(this.responseText);
  }
};
xmlhttp.open("GET", url, true);
xmlhttp.setRequestHeader("Content-type", "application/json");
xmlhttp.send();

var db;
var request = window.indexedDB.open(DBNAME, VERSION);
console.log(request);
request.onerror = function(event) {
	console.log("Error: " + event);
};
request.onsuccess = function(event) {
	db = request.result;
	console.log("Success: " + db);
};
request.onupgradeneeded = function(event) {
	var db = event.target.result;
	var objectStore = db.createObjectStore(STORE, {
		keyPath: "id"
	});
	for (var i in elementos) {
		objectStore.add(elementos[i]);
	}
}
/*
function add()
{
	var request = db.transaction(["elementos"], "readwrite")
	.objectStore("elementos")
	.add({});
	request.onsuccess = function(event)
	{
		alert("Berilio Ha sido agregado a la base de datos.");
	};
	request.onerror = function(event)
	{
		alert("No se puede agregar el valor a la base de datos\r\nBerilio ya existe en la base de datos ");
	}
}
*/
function add(_numero, _nombre, _simbolo, _masaAtomica, _valencia, _ebullicion, _fusion, _densidad, _confElectronica, _grupo, _descubrimiento, _descubridor, _etimologia) {
	var request = db.transaction([STORE], "readwrite").objectStore(STORE).add({
		id: _numero.toString(),
		numero: _numero.toString(),
		nombre: _nombre.toString(),
		simbolo: _simbolo.toString(),
		masaAtomica: _masaAtomica.toString(),
		valencia: _valencia.toString(),
		ebullicion: _ebullicion.toString(),
		fusion: _fusion.toString(),
		densidad: _densidad.toString(),
		confElectronica: _confElectronica.toString(),
		grupo: _grupo.toString(),
		descubrimiento: _descubrimiento.toString(),
		descubridor: _descubridor.toString(),
		etimologia: _etimologia.toString()
	});
	request.onsuccess = function(event) {
		alert("El elemento ha sido agregado a la base de datos.");
	};
	request.onerror = function(event) {
		alert("No se puede agregar el elemento a la base de datos\r\nYa existe en la base de datos ");
	}
}

function read(id) {
	var transaction = db.transaction([STORE]);
	var objectStore = transaction.objectStore(STORE);
	var request = objectStore.get(id);
	request.onerror = function(event) {
		alert("¡No hay ningún elemento registrado!");
	};
	request.onsuccess = function(event) {
		// Do something with the request.result!
		if (request.result) {
			//alert("Numero: " + request.result.numero + ", Nombre: " + request.result.nombre + ", Simbolo: " + request.result.simbolo);
			var html = '';
			html += '<h1>' + request.result.numero + ' ' + request.result.nombre + ' ' + (request.result.simbolo) + '</h1>';
			html += '<p>';
			html += '<strong>Masa Atómica:</strong> ' + request.result.masaAtomica + '<br>';
			html += '<strong>Valencia:</strong> ' + request.result.valencia + '<br>';
			html += '<strong>Punto de Ebullición, ºC:</strong> ' + request.result.ebullicion + '<br>';
			html += '<strong>Punto de Fusión, ºC:</strong> ' + request.result.fusion + '<br>';
			html += '<strong>Densidad (g/ml):</strong> ' + request.result.densidad + '<br>';
			html += '<strong>Configuración Electrónica:</strong> ' + request.result.confElectronica + '<br>';
			html += '<strong>Grupo:</strong> ' + request.result.grupo + '<br>';
			html += '<strong>Fecha de Descubrimiento:</strong> ' + request.result.descubrimiento + '<br>';
			html += '<strong>Descubierto por:</strong> ' + request.result.descubridor + '<br>';
			html += '<strong>Etimología:</strong> ' + request.result.etimologia + '<br>';
			html += '</p>';
			//var message = "Numero: " + request.result.numero + ", Nombre: " + request.result.nombre + ", Simbolo: " + request.result.simbolo;
			document.getElementById("modal-content").innerHTML = html;
		} else {
			//alert("El elemento no pudo ser encontrado en la base de datos!");
			var html = '"¡El elemento no pudo ser encontrado en la base de datos!"';
			document.getElementById("modal-content").innerHTML = html;
		}
	};
}

function readAll() {
	var objectStore = db.transaction(STORE).objectStore(STORE);
	//Solo cuenta el número de elementos
	var countRequest = objectStore.count();
	countRequest.onsuccess = function() {
		var length = countRequest.result;
		console.log("Length: " + length);
	}
	objectStore.openCursor().onsuccess = function(event) {
		var cursor = event.target.result;
		if (cursor) {
			alert("id " + cursor.key + ", Numero " + cursor.value.numero + ", Nombre: " + cursor.value.nombre + ", Simbolo: " + cursor.value.simbolo);
			var message = "id " + cursor.key + ", Numero " + cursor.value.numero + ", Nombre: " + cursor.value.nombre + ", Simbolo: " + cursor.value.simbolo;
			console.log(message);
			cursor.continue();
		} else {
			alert("No hay más elementos!");
		}
	};
}

function remove(id) {
	var request = db.transaction([STORE], "readwrite").objectStore(STORE).delete(id);
	request.onsuccess = function(event) {
		alert("¡El elemento ha sido eliminado de la base de datos!");
	}
	request.onerror = function(event) {
		alert("¡No existe el elemento que se desea eliminar!");
	};
}
