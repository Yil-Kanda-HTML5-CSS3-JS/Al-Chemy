var modal = document.getElementById("element");

(function () {
  console.log('Esta función no tiene nombre y\
    se ejecutara inmediatamente');
}());

window.onclick = function(event)
{
  if (event.target == modal)
  {
    modal.style.display = "none";
  }
}

window.oncontextmenu = function ()
{
    if(event.button===2)
    {
      alert('Al-Chemy, creada por © Yil Kanda');
    }
    return false;     // cancel default menu
}

function openModalElement(id)
{
	modal.style.display = "block";
	read(id);
}

function welcome()
{
	alert('Tabla Periódica de los Elementos\n\nEl Sistema periódico o Tabla periódica es un esquema de todos los elementos químicos dispuestos por orden de número atómico creciente y en una forma que refleja la estructura de los elementos. Los elementos están ordenados en siete hileras horizontales, llamadas periodos, y en 18 columnas verticales, llamadas grupos.\n\nHaciendo clic en un elemento de la tabla obtendrá información sobre el número atómico, nombre, símbolo, la masa atómica, la valencia, el punto de ebullición y fusión, la densidad, la configuración electrónica, historia y etimología del mismo. Las masas atómicas entre paréntesis indican la masa del isótopo más estable.\n\nAl-Chemy\nCreado por Yil Kanda.')
}

function addDB()
{
	var numero = document.getElementById("numero").value;
	var nombre = document.getElementById("nombre").value;
	var simbolo = document.getElementById("simbolo").value;
	var masaAtomica = document.getElementById("masaAtomica").value;
	var valencia = document.getElementById("valencia").value;
	var ebullicion = document.getElementById("ebullicion").value;
	var fusion = document.getElementById("fusion").value;
	var densidad = document.getElementById("densidad").value;
	var confElectronica = document.getElementById("confElectronica").value;
	var grupo = document.getElementById("grupo").value;
	var descubrimiento = document.getElementById("descubrimiento").value;
	var descubridor = document.getElementById("descubridor").value;
	var etimologia = document.getElementById("etimologia").value;

	add(numero,nombre,simbolo,masaAtomica,valencia,ebullicion,fusion,densidad,confElectronica,grupo,descubrimiento,descubridor,etimologia);
}

function url(_url)
{
	window.location.href = _url.toString();
}
