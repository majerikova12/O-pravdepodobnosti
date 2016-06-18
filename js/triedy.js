setTimeout(function(){load();},1000);
id_trieda = null;
triedy = null;
my_id = null;

function load(){
	if (pomp){
		document.getElementById("neprihlaseny").style.display = "none";
		document.getElementById("vsetky_triedy").style.display = "inline";
		$.ajax({
			method: "POST",
			url: "vypis_tried.php"
		})
			.done(function(msg) {
			//console.log(msg);
			    var pom = JSON.parse(msg);
			    triedy=pom.triedy;
			    my_id=pom.my_id;
			    var tab = document.getElementById("tab_triedy");
			    tab.innerHTML = "";
			    for (var i=0; i<triedy.length; i++){
			      	var tr = document.createElement("tr");
			      	tr.innerHTML = "<td style='padding-top:17px'>"+triedy[i].nazov+"</td><td><button class='btn btn-default' onclick='vojdi_do_triedy("+i+");'>Vstúp do triedy</button>";
			      	tab.appendChild(tr);
			    }
			})
	} else{
		document.getElementById("neprihlaseny").style.display = "inline";
		document.getElementById("vsetky_triedy").style.display = "none";
		return;
	}
}


function load_ziakov(){
	if (pomp){
		document.getElementById("neprihlaseny").style.display = "none";
		document.getElementById("vsetky_triedy").style.display = "inline";
		$.ajax({
		      method: "POST",
		      url: "vypis_ziakov.php",
		      data: {id_trieda:id_trieda}
		    })
		      .done(function(msg) {
		      	//console.log(msg);
		      	var pom = JSON.parse(msg);
		      	var ziaci = pom.ziaci;
		      	if (pom.je_v_zozname){
		      		document.getElementById("btn_pridaj_odober").innerHTML = "Odober sa z triedy";
	      			document.getElementById("btn_pridaj_odober").onclick = odober_ziaka_triede;
		      	} else{
		      		document.getElementById("btn_pridaj_odober").innerHTML = "Pridaj sa do triedy";
	      			document.getElementById("btn_pridaj_odober").onclick = pridaj_ziaka_triede;
		      	}
		      	if (triedy){
		      		for (var i=0; i<triedy.length; i++){
		      			if (triedy[i].id_trieda == id_trieda){
		      				if (pom.uzivatel == triedy[i].id_majitel){
								document.getElementById("btn_vymaz_triedu").style.display = "inline";
							} else{
								document.getElementById("btn_vymaz_triedu").style.display = "none";
							}
						}
		      		}
			    }
		      	var tab = document.getElementById("tab_ziaci");
		      	tab.innerHTML = "";
		      	for (var z=0; z<ziaci.length; z++){
				console.log(ziaci[z]);
		      		var tr = document.createElement("tr");
		      		var td = document.createElement("td");
		      		td.innerHTML = ziaci[z].meno+" "+ziaci[z].priezvisko;
		      		td.style.paddingTop = "18px";
		      		tr.appendChild(td);
		      		var vyriesene_priklady = ziaci[z].vyriesene;
		      		//console.log(vyriesene_priklady);
		      		for (var i=1; i<5; i++){
		      			for (var j=0; j<8; j++){
		      				td = document.createElement("td");
		      				td.style.paddingTop = "15px";
		      				if (vyriesene_priklady.indexOf(((i).toString()+(j).toString())) != -1){
		      					td.innerHTML = "<img src='img/chceck.png' height='30px'>";
		      				}else{
		      					td.innerHTML = "<img src='img/unchceck.png' height='30px'>";
		      				}
		      				tr.appendChild(td);
		      			}
		      		}
		      		tab.appendChild(tr);
		      	}	
		      })
		      .fail(function(msg){
		      	console.log(msg);
		      })
	} else{
		document.getElementById("neprihlaseny").style.display = "inline";
		document.getElementById("vsetky_triedy").style.display = "none";
		return;
	}
}

function vytvor_triedu(){
	if (document.getElementById("nazov_triedy") == ""){
		return;
	}
	$.ajax({
      method: "POST",
      url: "nova_trieda.php",
      data: {nazov_triedy:document.getElementById("nazov_triedy").value}
    })
      .done(function(msg) {
      	console.log(msg);
      })
      .fail(function(msg){
      	console.log(msg);
      })
     load();
}

setInterval(function(){
	if (pomp){
		document.getElementById("neprihlaseny").style.display = "none";
		document.getElementById("vsetky_triedy").style.display = "inline";
	} else{
		document.getElementById("neprihlaseny").style.display = "inline";
		document.getElementById("vsetky_triedy").style.display = "none";
		return;
	}
	if (id_trieda === null){
		$.ajax({
	      method: "POST",
	      url: "vypis_tried.php"
	    })
	      .done(function(msg) {
	      	//console.log(msg);
	      	var pom = JSON.parse(msg);
		    triedy=pom.triedy;
		    my_id=pom.my_id;
	      	var tab = document.getElementById("tab_triedy");
	      	tab.innerHTML = "";
	      	for (var i=0; i<triedy.length; i++){
	      		var tr = document.createElement("tr");
	      		tr.innerHTML = "<td style='padding-top:17px'>"+triedy[i].nazov+"</td><td><button class='btn btn-default' onclick='vojdi_do_triedy("+i+");'>Vstúp do triedy</button>";
	      		tab.appendChild(tr);
	      	}
	      })
	      .fail(function(msg){
	      	console.log(msg);
	      })
	} else{
		load_ziakov();
	}
},3000);

function vojdi_do_triedy(i){
	if (!triedy){retrurn;}
	id_trieda = triedy[i].id_trieda;
	document.getElementById("triedy").style.display = "none";
	document.getElementById("trieda").style.display = "inline";
	document.getElementById("trieda_btns").style.display = "inline";
	if (triedy[i].id_majitel == my_id){
		document.getElementById("btn_vymaz_triedu").style.display = "inline";
	} else{
		document.getElementById("btn_vymaz_triedu").style.display = "none";
	}
	load_ziakov();
}

function pridaj_ziaka_triede(){
	$.ajax({
      method: "POST",
      url: "pridanie_ziaka_triede.php",
      data: {id_trieda:id_trieda}
    })
      .done(function(msg) {
      	//console.log(msg);
      	document.getElementById("btn_pridaj_odober").innerHTML = "Odober sa z triedy";
      	document.getElementById("btn_pridaj_odober").onclick = odober_ziaka_triede;
      })
      .fail(function(msg){
      	console.log(msg);
      })
    load_ziakov();
}

function odober_ziaka_triede(){
	$.ajax({
      method: "POST",
      url: "zmaz_ziaka_triede.php",
      data: {id_trieda:id_trieda}
    })
      .done(function(msg) {
      	console.log(msg);
      	document.getElementById("btn_pridaj_odober").innerHTML = "Pridaj sa do triedy";
      	document.getElementById("btn_pridaj_odober").onclick = pridaj_ziaka_triede;
      })
      .fail(function(msg){
      	console.log(msg);
      })
    load_ziakov();
}

function vymaz_triedu(){
	$.ajax({
      method: "POST",
      url: "zmaz_triedu.php",
      data: {id_trieda:id_trieda}
    })
      .done(function(msg) {
      	console.log(msg);
      	id_trieda=null;
      	document.getElementById('trieda').style.display='none';
      	document.getElementById('trieda_btns').style.display='none';
      	document.getElementById('triedy').style.display='inline';
      })
      .fail(function(msg){
      	console.log(msg);
      })
    load();
}


