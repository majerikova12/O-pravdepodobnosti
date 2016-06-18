var skupiny = {1:"skupina_1.json",2:"skupina_2.json",3:"skupina_3.json",4:"skupina_4.json"};

//vsetky priklady, ak uzivatel nie je prihlaseny
var pr_btns = {};

var akt_zadanie = "";
var akt_udalosti = [];
var akt_vysledok = {};
var akt_index = null;
var spravny_vysledok = false;

//premenne
var cisla = {};
var udalosti = {};
var kombinatorika = {};
var buttony = [];
var buttony2 = [];

//prihlasenie a odhlasenie
var pomp = false;
function je_prihlaseny(){
    $.ajax({
        method: "POST",
        url: "je_prihlaseny.php"
    })
    .done(function(msg) {
        if (msg){
            var result = JSON.parse(msg);
            pomp = true;
            document.getElementById("google_profil").style.display = "inline";
            document.getElementById("google_profil").innerHTML = "Ste prihlásený ako <br><strong>"+result.meno+" "+result.priezvisko+"</strong>";
            clearInterval(timer);
            timer=setInterval(je_odhlaseny,3000);
        }
    });
}
function je_odhlaseny(){
    $.ajax({
        method: "POST",
        url: "je_odhlaseny.php"
    })
    .done(function(msg) {
        if (msg){
            clearInterval(timer);
            pomp = false;
            document.getElementById("google_profil").style.display = "none";
            timer=setInterval(je_prihlaseny,3000);
        }
    });
}
var timer = setInterval(je_prihlaseny,3000);
function onSignIn(googleUser) {
    if (pomp){ 
        if (akt_index!=null){save_btns();} 
        $.ajax({
            method: "POST",
            url: "odhlasenie.php"
        })
        .done(function() {
            googleUser.disconnect();
            pomp = false;
            document.getElementById("google_profil").style.display = "none";
            clearInterval(timer);
            timer=setInterval(je_prihlaseny,3000);
            if (akt_index!=null){
            	document.getElementById("plocha").innerHTML = '<img id="trash" src="img/trash.png" width="50" height="60" style="float:right; margin:10px;">';
            	load_btns();
            } 
        });  
    } else{
    	if (akt_index!=null){save_btns();} 
        $.ajax({
            method: "POST",
            url: "prihlasenie.php",
            data: {id_token: googleUser.getAuthResponse().id_token}
        })
        .done(function() {
            var profile = googleUser.getBasicProfile();
            pomp = true;
            document.getElementById("google_profil").style.display = "inline";
            document.getElementById("google_profil").innerHTML = "Ste prihlásený ako <br><strong>"+profile.getName()+"</strong>";
            clearInterval(timer);
            timer=setInterval(je_odhlaseny,3000);
            if (akt_index!=null){
            	document.getElementById("plocha").innerHTML = '<img id="trash" src="img/trash.png" width="50" height="60" style="float:right; margin:10px;">';
            	load_btns();
            } 
        });
    }
};

//precitame priklady z json-u a vytvorime na ne odkazy
function load_priklady(index){
	document.getElementById("skupiny").style.display = "none";
	document.getElementById("priklady").style.display = "inline";
	$.getJSON("priklady/"+skupiny[index], function(json) {
		var tr = document.createElement("tr");
    	for (var i=0; i<json.priklady.length; i++){
    		if (i!=0 && i%2==0){tr = document.createElement("tr");}
    		var td = document.createElement("td");
    		var cent = document.createElement("center");
    		var btn = document.createElement("button");
    		btn.className = "draggable_div";
    		btn.innerHTML = "<strong>Príklad "+index.toString()+"."+(i+1).toString()+".</strong><br>"+json.priklady[i].zadanie.substring(0,70)+"...";
    		btn.onclick = function(i){return function(){load_priklad(json.priklady[i],index.toString()+(i).toString());}}(i);
    		btn.style.margin = "10px";
    		btn.style.maxWidth = "500px";
    		cent.appendChild(btn);
    		td.appendChild(cent);
    		tr.appendChild(td);
    		document.getElementById("tab_priklady").appendChild(tr);
    	}
	});
}

//naloadujeme konkretny priklad
function load_priklad(pr,index){
	//zapamatame si hodnoty aktualneho prikladu
	akt_zadanie = pr.zadanie;
	akt_udalosti = pr.udalosti;
	akt_kombinatorika = pr.kombinatorika;
	akt_vysledok = pr.vysledok;
	akt_index = index;
	cisla = {};
	udalosti = {};
	kombinatorika = {};

	//pole batonov
	buttony = [];
	buttony2 = [];
	
	//console.log(akt_zadanie);
	//zapneme zobrazenie na aktualny priklad
	document.getElementById("priklady").style.display = "none";
	document.getElementById("priklad").style.display = "inline";
	document.getElementById("vypis").style.display = "inline";
	document.getElementById("zadanie").innerHTML = pr.zadanie;

	//premenne na drag & drop 
	//text buttonu kt sme vytvorili tahanim
	novy_btn_text = null;
	//aktualne tahany btn
	dragged_btn = null;
	clicked_item = null;
	clicked_nastroj = null;

	var div = document.getElementById("div_udalosti");
	//pridanie udalosti na stranku
	for (var u=0; u<akt_udalosti.length; u++){
		//console.log(akt_udalosti[u].mnozina);
		var btn = document.createElement("button");
		btn.className = "btn btn-default";

		btn.addEventListener("mousedown",function(e){
			novy_btn_text = this.innerHTML;
		});

		var text = udalost_to_text(akt_udalosti[u].nazov,akt_udalosti[u].oznacenie,akt_udalosti[u].mnozina);
		udalosti[text] = {"nazov":akt_udalosti[u].nazov,"oznacenie":akt_udalosti[u].oznacenie, "mnozina":akt_udalosti[u].mnozina};
		btn.innerHTML = text;

		btn.style.margin = "3px";
		btn.style.backgroundColor = "#e6e6ff";
		div.appendChild(btn);
	}
	//console.log(akt_kombinatorika.length);
	for (var k=0; k<akt_kombinatorika.length; k++){
		var btn = document.createElement("button");
		btn.className = "draggable_div";
			
		btn.addEventListener("mousedown",function(e){
			novy_btn_text = this.innerHTML;
		});

		var typk = akt_kombinatorika[k].typ;
		var typ = "";
		if (typk == "kn"){
			typ = "C<sub>"+akt_kombinatorika[k].k[0]+"</sub>("+akt_kombinatorika[k].n+")";
		} else if (typk == "ko"){
			typ = "C'<sub>"+akt_kombinatorika[k].k[0]+"</sub>("+akt_kombinatorika[k].n+")";
		} else if (typk == "vn"){
			typ = "V<sub>"+akt_kombinatorika[k].k[0]+"</sub>("+akt_kombinatorika[k].n+")";
		} else if (typk == "vo"){
			typ = "V'<sub>"+akt_kombinatorika[k].k[0]+"</sub>("+akt_kombinatorika[k].n+")";
		} else if (typk == "pn"){
			typ = "P("+akt_kombinatorika[k].n+")";
		} else if (typk == "po"){
			typ = "P";
			for (var i=0; i<akt_kombinatorika[k].k.length; i++){
				typ += ("<sub>"+akt_kombinatorika[k].k[i]+"</sub>");
			}
			typ += ("("+akt_kombinatorika[k].n+")");
		}
		var text = akt_kombinatorika[k].nazov+"<br><sub>"+typ+"</sub>";
		var cislo = 0;
		var n = parseInt(akt_kombinatorika[k].n);
		var kk = akt_kombinatorika[k].k;

		if (typk == "kn"){
			cislo = math.combinations(n,kk[0]);
		} else if (typk == "ko"){
			cislo = math.combinations(n+kk[0]+1,kk[0]);
		} else if (typk == "vn"){
			cislo = math.factorial(n)/math.factorial(n-kk[0]);
		} else if (typk == "vo"){
			cislo = math.pow(n,kk[0]);
		} else if (typk == "pn"){
			cislo = math.factorial(n);
		} else if (typk == "po"){
			cislo = math.factorial(n);
			for (var i=0; i<kk.length; i++){
				cislo /= math.factorial(parseInt(kk[i]));
			}
		}
		//console.log(text+" "+cislo);

		kombinatorika[text] = {"popis":akt_kombinatorika[k].nazov,"oznacenie":typ,"cislo":cislo};
		//console.log(kombinatorika);
		btn.innerHTML = text;
		btn.style.backgroundColor = "#ffe6e6";

		btn.style.margin = "3px";
		div.appendChild(btn);
	}


	//pusti sa aktualne tahany btn
	document.addEventListener("mouseup",function(e){
		if (!dragged_btn && !novy_btn_text){return;}
		try {
			if ((parseInt(dragged_btn.style.left)+dragged_btn.clientWidth)>=(document.getElementById("plocha").clientWidth-60) && parseInt(dragged_btn.style.top)<=70){
				dragged_btn.remove();
				buttony.splice(buttony.indexOf(dragged_btn),1);
				var pom = false;
				if (spravny_vysledok){
					for (var i=0; i<buttony.length; i++){
						if (buttony[i].style.backgroundColor == rgb(206,244,255)){
							pom = true;
						}
					}
				}
				if (!pom){spravny_vysledok = false;}
			}
		}
		catch(err){
			console.log("nenatiahnuty btn na obrazovku");
		}
		novy_btn_text = null;
		dragged_btn = null;
	});

	//po vojdeni s btn na plochu sa vytvori novy btn
	document.getElementById("plocha").addEventListener("mouseenter",function(e){
		if (!novy_btn_text || dragged_btn){return;}
		var btn = document.createElement("div");
		buttony.push(btn);
		btn.className = "draggable_div";
		//btn.className = "btn btn-default";
		btn.innerHTML = novy_btn_text;
		btn.style.position = "absolute";
		btn.style.left = e.offsetX + "px";
		btn.style.top = e.offsetY + "px";
		btn.style.maxWidth = "300px";

		btn.onclick = function(btn){return function(){click_item(btn);}}(btn);

		btn.addEventListener("mousedown", function(e){
			dragged_btn = this;
		});

		if (udalosti[novy_btn_text] != undefined){
			btn.style.backgroundColor = "#e6e6ff";
		} else if(kombinatorika[novy_btn_text] != undefined){
			btn.style.backgroundColor = "#ffe6e6";
		} else if(cisla[novy_btn_text] != undefined){
			btn.style.backgroundColor = "#e6ffe6";
		}


		document.getElementById("plocha").appendChild(btn);
		dragged_btn = btn;
	});

	//pohyp elementov po ploche
	document.getElementById("plocha").addEventListener("mousemove",function(e){
		if (!dragged_btn){return;}
		if (e.target!=this){
			var new_x = (parseInt(e.target.style.left) + e.offsetX);
			var new_y = (parseInt(e.target.style.top) + e.offsetY);
		} else{
			var new_x = e.offsetX;
			var new_y = e.offsetY;
		}
		new_x -= Math.floor(dragged_btn.clientWidth/2);
		new_y -= Math.floor(dragged_btn.clientHeight/2);
		if ((new_x + dragged_btn.clientWidth)>=document.getElementById("plocha").clientWidth || (new_x)<=0){new_x = parseInt(dragged_btn.style.left);}
		if ((new_y + dragged_btn.clientHeight)>=document.getElementById("plocha").clientHeight || (new_y)<=0){new_y = parseInt(dragged_btn.style.top);}
		dragged_btn.style.left = new_x + "px";
		dragged_btn.style.top = new_y + "px";
	});

	$(window).bind("beforeunload", function(e){
		save_btns();
	});

	create_plocha();
	load_btns();
}
//precita variaciu z jsonu a vytvori z nej string
function variacie_to_text(v){
	if (v.typ == "op"){
		return v.nazov+"<br>"+v.cislo1+" ^ "+v.cislo2;
	}
	var text = v.nazov+"<br>"
	for (var i=0; i<v.cislo2; i++){
		text += ((parseInt(v.cislo1)-i).toString()+" * ");
	}
	return text.substring(0,text.length-2);
}

//vytvorí sa plocha
function create_plocha(){
	var plocha = document.getElementById("plocha");
	plocha.style.width = (1100).toString()+"px";
	plocha.style.height = (400).toString()+"px";
	plocha.style.background = "white";
	plocha.style.position = "relative";
	//var trash = document.getElementById("trash");
	//trash.style.paddingRight = "300px";
}

//click na jeden z nastrojov
function click_nastroj(nastroj){
	if (clicked_item){clicked_item = null;}
	clicked_nastroj = nastroj;
	if (nastroj == "kartez"){
		document.getElementById("vypis").innerHTML = "Teraz klikni na prvu udalost, z kt. chces urobit kartez. sucin.";
	} else if (nastroj == "zjednotenie"){
		document.getElementById("vypis").innerHTML = "Teraz klikni na prvu udalost";
	} else if (nastroj == "prienik"){
		document.getElementById("vypis").innerHTML = "Teraz klikni na prvu udalost.";
	} else if (nastroj == "minus"){
		document.getElementById("vypis").innerHTML = "Teraz klikni na pravdepodobnost, z ktorej chces vypocitat opacnu udalosť.";
	} else if (nastroj == "pravdepodobnost"){
		document.getElementById("vypis").innerHTML = "Teraz klikni na udalost s priaznivymi pripadmi.";
	} else if (nastroj == "vysledok"){
		document.getElementById("vypis").innerHTML = "Teraz klikni na pravdepodobnost, ktora je podla teba vysledkom.";
	}
}

//klik na item na ploche
function click_item(i){
	//neklikol na nastroj
	if (!clicked_nastroj){
		document.getElementById("vypis").innerHTML = "Neklikol si na nástroj.";
		return;
	}

	if (clicked_item == i){
		document.getElementById("vypis").innerHTML = "Zle si klikol.";
		return;
	}
	
	//klikol na nastroj a prvy item
	if (!clicked_item){
		if (udalosti[i.innerHTML] != undefined && (clicked_nastroj == "kartez" || clicked_nastroj == "zjednotenie" || clicked_nastroj == "prienik" || clicked_nastroj == "pravdepodobnost")){
			clicked_item=i;
			if (clicked_nastroj == "kartez"){
				document.getElementById("vypis").innerHTML = "Teraz klikni na druhu udalost, z kt. chces urobit kartez. sucin.";
			} else if (clicked_nastroj == "zjednotenie"){
				document.getElementById("vypis").innerHTML = "Teraz klikni na druhu udalost.";
			} else if (clicked_nastroj == "prienik"){
				document.getElementById("vypis").innerHTML = "Teraz klikni na druhu udalost.";
			} else if (clicked_nastroj == "pravdepodobnost"){
				document.getElementById("vypis").innerHTML = "Teraz klikni na udalost so vsetkymi pripadmi.";
			}
		}
		else if (cisla[i.innerHTML] != undefined && (clicked_nastroj == "zjednotenie" || clicked_nastroj == "prienik")){
			clicked_item=i;
			if (clicked_nastroj == "zjednotenie"){
				document.getElementById("vypis").innerHTML = "Teraz klikni na druhu udalost.";
			} else if (clicked_nastroj == "prienik"){
				document.getElementById("vypis").innerHTML = "Teraz klikni na druhu udalost.";
			}
		}
		else if (kombinatorika[i.innerHTML] != undefined && (clicked_nastroj == "zjednotenie" || clicked_nastroj == "prienik" || clicked_nastroj == "pravdepodobnost")){
			clicked_item=i;
			if (clicked_nastroj == "zjednotenie"){
				document.getElementById("vypis").innerHTML = "Teraz klikni na druhu udalost.";
			} else if (clicked_nastroj == "prienik"){
				document.getElementById("vypis").innerHTML = "Teraz klikni na druhu udalost.";
			} else if (clicked_nastroj == "pravdepodobnost"){
				document.getElementById("vypis").innerHTML = "Teraz klikni na udalost so vsetkymi pripadmi.";
			}
		}
		//kontroluje vysledok
		else if (cisla[i.innerHTML] != undefined && clicked_nastroj == "vysledok"){
			if (cisla[i.innerHTML].citatel == akt_vysledok.citatel && cisla[i.innerHTML].menovatel == akt_vysledok.menovatel){
				document.getElementById("vypis").innerHTML = "Dobry vysledok";
				i.style.backgroundColor = "#cef4ff";
				//i.style.backgroundColor = "#66ff33";
				spravny_vysledok = true;
				save_btns();
			}
			else{
				document.getElementById("vypis").innerHTML = "Zly vysledok";
			}
			clicked_nastroj = null;
		}
		else if (cisla[i.innerHTML] != undefined && clicked_nastroj == "minus"){
			var novy_zlomok = rozdiel_zlomkov(1,1,cisla[i.innerHTML].citatel,cisla[i.innerHTML].menovatel);
			var cit = novy_zlomok[0];
			var men = novy_zlomok[1];
			//console.log(cit/men <= 1);
			if (cit/men <= 1){
				var ozn = "( 1 - "+cisla[i.innerHTML].oznacenie+" )";
				var text = "( doplnok ku "+cisla[i.innerHTML].nazov+" )<br><sub>"+ozn+"</sub>";
				cisla[text] = {"nazov":"( doplnok ku "+cisla[i.innerHTML].nazov+" )", "citatel": cit, "menovatel": men, "oznacenie":ozn};
				i.innerHTML = text;
				document.getElementById("vypis").innerHTML = "Dobre si klikol.";

				//console.log(i.style.backgroundColor);
				if (i.style.backgroundColor == "rgb(206, 244, 255)"){
					i.style.backgroundColor = "#ffffff";
					if (udalosti[i.innerHTML] != undefined){
						i.style.backgroundColor = "#e6e6ff";
					}else if(kombinatorika[i.innerHTML] != undefined){
						i.style.backgroundColor = "#ffe6e6";
					} else if(cisla[i.innerHTML] != undefined){
						i.style.backgroundColor = "#e6ffe6";
					}
					var pom = false;
					for (var b=0; b<buttony.length; b++){
						if (buttony[b].style.backgroundColor == "rgb(206, 244, 255)"){
							pom = true;
						}
					}
					if (!pom){spravny_vysledok = false;}
				}
			}
			if (document.getElementById("vypis").innerHTML != "Dobre si klikol."){
				document.getElementById("vypis").innerHTML = "Zle si klikol.";
			}
			clicked_nastroj = null;
		}
		else{
			clicked_nastroj = null;
			document.getElementById("vypis").innerHTML = "Zle si klikol.";
		}
		return;
	}

	//klikol na nastroj a druhy item
	//nastroje pre udalosti
	if (udalosti[i.innerHTML] != undefined && udalosti[clicked_item.innerHTML] != undefined && (clicked_nastroj == "kartez" || clicked_nastroj == "zjednotenie" || clicked_nastroj == "prienik" || clicked_nastroj == "pravdepodobnost")){
		if (clicked_nastroj == "zjednotenie"){
			var set = zjednotenie(udalosti[clicked_item.innerHTML].mnozina,udalosti[i.innerHTML].mnozina);
			var text = udalost_to_text("( "+udalosti[clicked_item.innerHTML].nazov+" <strong>alebo</strong> "+udalosti[i.innerHTML].nazov+" )","( "+udalosti[clicked_item.innerHTML].oznacenie+" ∪ "+udalosti[i.innerHTML].oznacenie+" )",set);
	  		udalosti[text] = {"nazov":"( "+udalosti[clicked_item.innerHTML].nazov+" <strong>alebo</strong> "+udalosti[i.innerHTML].nazov+" )","oznacenie":"( "+udalosti[clicked_item.innerHTML].oznacenie+" ∪ "+udalosti[i.innerHTML].oznacenie+" )", "mnozina":set};
	  		clicked_item.innerHTML = text;
	  		buttony.splice(buttony.indexOf(i),1);
	  		i.remove();
	  		if (clicked_item.style.backgroundColor == "rgb(206, 244, 255)"){
				clicked_item.style.backgroundColor = "#ffffff";
				var pom = false;
				for (var b=0; b<buttony.length; b++){
					if (buttony[b].style.backgroundColor == "rgb(206, 244, 255)"){
						pom = true;
					}
				}
				if (!pom){spravny_vysledok = false;}
			}
			if (udalosti[clicked_item.innerHTML] != undefined){
				clicked_item.style.backgroundColor = "#e6e6ff";
			}else if(kombinatorika[clicked_item.innerHTML] != undefined){
				clicked_item.style.backgroundColor = "#ffe6e6";
			} else if(cisla[clicked_item.innerHTML] != undefined){
				clicked_item.style.backgroundColor = "#e6ffe6";
			}
	  		clicked_item = null;
	  		clicked_nastroj = null;
		}
		else if (clicked_nastroj == "prienik"){
			var set = prienik(udalosti[clicked_item.innerHTML].mnozina,udalosti[i.innerHTML].mnozina);
			var text = udalost_to_text("( "+udalosti[clicked_item.innerHTML].nazov+" <strong>a zároveň</strong> "+udalosti[i.innerHTML].nazov+" )","( "+udalosti[clicked_item.innerHTML].oznacenie+" ∩ "+udalosti[i.innerHTML].oznacenie+" )",set);
	  		udalosti[text] = {"nazov":"( "+udalosti[clicked_item.innerHTML].nazov+" <strong>a zároveň</strong> "+udalosti[i.innerHTML].nazov+" )","oznacenie":"( "+udalosti[clicked_item.innerHTML].oznacenie+" ∩ "+udalosti[i.innerHTML].oznacenie+" )", "mnozina":set};
	  		clicked_item.innerHTML = text;
	  		buttony.splice(buttony.indexOf(i),1);
	  		i.remove();
	  		if (clicked_item.style.backgroundColor == "rgb(206, 244, 255)"){
				clicked_item.style.backgroundColor = "#ffffff";
				var pom = false;
				for (var b=0; b<buttony.length; b++){
					if (buttony[b].style.backgroundColor == "rgb(206, 244, 255)"){
						pom = true;
					}
				}
				if (!pom){spravny_vysledok = false;}
			}
			if (udalosti[clicked_item.innerHTML] != undefined){
				clicked_item.style.backgroundColor = "#e6e6ff";
			}else if(kombinatorika[clicked_item.innerHTML] != undefined){
				clicked_item.style.backgroundColor = "#ffe6e6";
			} else if(cisla[clicked_item.innerHTML] != undefined){
				clicked_item.style.backgroundColor = "#e6ffe6";
			}
	  		clicked_item = null;
	  		clicked_nastroj = null;
		}
		else if (clicked_nastroj == "pravdepodobnost"){
			if (je_podmnozina(udalosti[clicked_item.innerHTML].mnozina,udalosti[i.innerHTML].mnozina)){
				var pravdep = najme_menovatel(udalosti[clicked_item.innerHTML].mnozina.length,udalosti[i.innerHTML].mnozina.length);
				var citatel = pravdep[0];
				var menovatel = pravdep[1];
				var ozn = "P ( "+udalosti[clicked_item.innerHTML].oznacenie+" z "+udalosti[i.innerHTML].oznacenie+" )";
				var text = "<strong>P (</strong> { "+udalosti[clicked_item.innerHTML].nazov+" } z { "+udalosti[i.innerHTML].nazov+" } <strong>)</strong><br><sub>"+ozn+"</sub>";
			  	cisla[text] = {"nazov":"<strong>P (</strong> { "+udalosti[clicked_item.innerHTML].nazov+" } z { "+udalosti[i.innerHTML].nazov+" } <strong>)</strong>","citatel": citatel, "menovatel": menovatel, "oznacenie":ozn};
			  	clicked_item.innerHTML = text;
			  	buttony.splice(buttony.indexOf(i),1);
			  	i.remove();
			  	if (clicked_item.style.backgroundColor == "rgb(206, 244, 255)"){
					clicked_item.style.backgroundColor = "#ffffff";
					var pom = false;
					for (var b=0; b<buttony.length; b++){
						if (buttony[b].style.backgroundColor == "rgb(206, 244, 255)"){
							pom = true;
						}
					}
					if (!pom){spravny_vysledok = false;}
				}
				if (udalosti[clicked_item.innerHTML] != undefined){
					clicked_item.style.backgroundColor = "#e6e6ff";
				}else if(kombinatorika[clicked_item.innerHTML] != undefined){
					clicked_item.style.backgroundColor = "#ffe6e6";
				} else if(cisla[clicked_item.innerHTML] != undefined){
					clicked_item.style.backgroundColor = "#e6ffe6";
				}
			  	clicked_item = null;
			  	clicked_nastroj = null;
			}	
		}
		else if (clicked_nastroj == "kartez"){
			var set = karteziansky_sucin(udalosti[clicked_item.innerHTML].mnozina,udalosti[i.innerHTML].mnozina);
			var text = udalost_to_text("( "+udalosti[clicked_item.innerHTML].nazov+" X "+udalosti[i.innerHTML].nazov+" )","( "+udalosti[clicked_item.innerHTML].oznacenie+" X "+udalosti[i.innerHTML].oznacenie+" )",set);
			udalosti[text] = {"nazov":"( "+udalosti[clicked_item.innerHTML].nazov+" X "+udalosti[i.innerHTML].nazov+" )","oznacenie":"( "+udalosti[clicked_item.innerHTML].oznacenie+" X "+udalosti[i.innerHTML].oznacenie+" )", "mnozina":set};
	  		clicked_item.innerHTML = text;
	  		buttony.splice(buttony.indexOf(i),1);
	  		i.remove();
	  		if (clicked_item.style.backgroundColor == "rgb(206, 244, 255)"){
				clicked_item.style.backgroundColor = "#ffffff";
				var pom = false;
				for (var b=0; b<buttony.length; b++){
					if (buttony[b].style.backgroundColor == "rgb(206, 244, 255)"){
						pom = true;
					}
				}
				if (!pom){spravny_vysledok = false;}
			}
			if (udalosti[clicked_item.innerHTML] != undefined){
				clicked_item.style.backgroundColor = "#e6e6ff";
			}else if(kombinatorika[clicked_item.innerHTML] != undefined){
				clicked_item.style.backgroundColor = "#ffe6e6";
			} else if(cisla[clicked_item.innerHTML] != undefined){
				clicked_item.style.backgroundColor = "#e6ffe6";
			}
	  		clicked_item = null;
	  		clicked_nastroj = null;
		} else{
			document.getElementById("vypis").innerHTML = "Zle si klikol.";
		}
	}

	//nastroje pre cisla
	else if (cisla[i.innerHTML] != undefined && cisla[clicked_item.innerHTML] != undefined && (clicked_nastroj == "zjednotenie" || clicked_nastroj == "prienik")){
		if (clicked_nastroj == "zjednotenie"){
			var novy_zlomok = sucet_zlomkov(cisla[clicked_item.innerHTML].citatel,cisla[clicked_item.innerHTML].menovatel,cisla[i.innerHTML].citatel,cisla[i.innerHTML].menovatel);
			var cit = novy_zlomok[0];
			var men = novy_zlomok[1];
			var ozn = "( "+cisla[clicked_item.innerHTML].oznacenie+" ∪ "+cisla[i.innerHTML].oznacenie+" )";
			var text = "( "+cisla[clicked_item.innerHTML].nazov+" <strong>alebo</strong> "+cisla[i.innerHTML].nazov+" )<br><sub>"+ozn+"</sub>";
			cisla[text] = {"nazov":"( "+cisla[clicked_item.innerHTML].nazov+" <strong>alebo</strong> "+cisla[i.innerHTML].nazov+" )", "citatel": cit, "menovatel": men, "oznacenie":ozn};
			clicked_item.innerHTML = text;
			buttony.splice(buttony.indexOf(i),1);
			i.remove();
			if (clicked_item.style.backgroundColor == "rgb(206, 244, 255)"){
				clicked_item.style.backgroundColor = "#ffffff";
				var pom = false;
				for (var b=0; b<buttony.length; b++){
					if (buttony[b].style.backgroundColor == "rgb(206, 244, 255)"){
						pom = true;
					}
				}
				if (!pom){spravny_vysledok = false;}
			}
			if (udalosti[clicked_item.innerHTML] != undefined){
				clicked_item.style.backgroundColor = "#e6e6ff";
			}else if(kombinatorika[clicked_item.innerHTML] != undefined){
				clicked_item.style.backgroundColor = "#ffe6e6";
			} else if(cisla[clicked_item.innerHTML] != undefined){
				clicked_item.style.backgroundColor = "#e6ffe6";
			}
			clicked_item = null;
	  		clicked_nastroj = null;
		}
		else if (clicked_nastroj == "prienik"){
			var novy_zlomok = najme_menovatel(cisla[clicked_item.innerHTML].citatel*cisla[i.innerHTML].citatel,cisla[clicked_item.innerHTML].menovatel*cisla[i.innerHTML].menovatel);
			var cit = novy_zlomok[0];
			var men = novy_zlomok[1];
			var ozn = "( "+cisla[clicked_item.innerHTML].oznacenie+" ∩ "+cisla[i.innerHTML].oznacenie+" )";
			var text = "( "+cisla[clicked_item.innerHTML].nazov+" <strong>a zároveň</strong> "+cisla[i.innerHTML].nazov+" )<br><sub>"+ozn+"</sub>";
			cisla[text] = {"nazov":"( "+cisla[clicked_item.innerHTML].nazov+" <strong>a zároveň</strong> "+cisla[i.innerHTML].nazov+" )", "citatel": cit, "menovatel": men, "oznacenie":ozn};
			clicked_item.innerHTML = text;
			buttony.splice(buttony.indexOf(i),1);
			i.remove();
			if (clicked_item.style.backgroundColor == "rgb(206, 244, 255)"){
				clicked_item.style.backgroundColor = "#ffffff";
				var pom = false;
				for (var b=0; b<buttony.length; b++){
					if (buttony[b].style.backgroundColor == "rgb(206, 244, 255)"){
						pom = true;
					}
				}
				if (!pom){spravny_vysledok = false;}
			}
			if (udalosti[clicked_item.innerHTML] != undefined){
				clicked_item.style.backgroundColor = "#e6e6ff";
			}else if(kombinatorika[clicked_item.innerHTML] != undefined){
				clicked_item.style.backgroundColor = "#ffe6e6";
			} else if(cisla[clicked_item.innerHTML] != undefined){
				clicked_item.style.backgroundColor = "#e6ffe6";
			}
			clicked_item = null;
	  		clicked_nastroj = null;
		} else{
			document.getElementById("vypis").innerHTML = "Zle si klikol.";
		}
	}

	//nastroje pre kombinatoriku
	else if (kombinatorika[i.innerHTML] != undefined && kombinatorika[clicked_item.innerHTML] != undefined && (clicked_nastroj == "zjednotenie" || clicked_nastroj == "prienik" || clicked_nastroj == "pravdepodobnost")){
		if (clicked_nastroj == "zjednotenie"){
			var nova_kombinatorika = kombinatorika[clicked_item.innerHTML].cislo + kombinatorika[i.innerHTML].cislo;
			var text = "( "+kombinatorika[clicked_item.innerHTML].popis+" <strong>alebo</strong> "+kombinatorika[i.innerHTML].popis+" )<br><sub>( "+kombinatorika[clicked_item.innerHTML].oznacenie+" + "+kombinatorika[i.innerHTML].oznacenie+" )</sub>";
			kombinatorika[text] = {"popis":"( "+kombinatorika[clicked_item.innerHTML].popis+" <strong>alebo</strong> "+kombinatorika[i.innerHTML].popis+" )","oznacenie":"( "+kombinatorika[clicked_item.innerHTML].oznacenie+" + "+kombinatorika[i.innerHTML].oznacenie+" )", "cislo":nova_kombinatorika};
			clicked_item.innerHTML = text;
			buttony.splice(buttony.indexOf(i),1);
			i.remove();
			if (clicked_item.style.backgroundColor == "rgb(206, 244, 255)"){
				clicked_item.style.backgroundColor = "#ffffff";
				var pom = false;
				for (var b=0; b<buttony.length; b++){
					if (buttony[b].style.backgroundColor == "rgb(206, 244, 255)"){
						pom = true;
					}
				}
				if (!pom){spravny_vysledok = false;}
			}
			if (udalosti[clicked_item.innerHTML] != undefined){
				clicked_item.style.backgroundColor = "#e6e6ff";
			}else if(kombinatorika[clicked_item.innerHTML] != undefined){
				clicked_item.style.backgroundColor = "#ffe6e6";
			} else if(cisla[clicked_item.innerHTML] != undefined){
				clicked_item.style.backgroundColor = "#e6ffe6";
			}
			clicked_item = null;
	  		clicked_nastroj = null;
		}
		else if (clicked_nastroj == "prienik"){
			var nova_kombinatorika = kombinatorika[clicked_item.innerHTML].cislo * kombinatorika[i.innerHTML].cislo;
			var text = "( "+kombinatorika[clicked_item.innerHTML].popis+" <strong>a zároveň</strong> "+kombinatorika[i.innerHTML].popis+" )<br><sub>( "+kombinatorika[clicked_item.innerHTML].oznacenie+" * "+kombinatorika[i.innerHTML].oznacenie+" )</sub>";
			kombinatorika[text] = {"popis":"( "+kombinatorika[clicked_item.innerHTML].popis+" <strong>a zároveň</strong> "+kombinatorika[i.innerHTML].popis+" )","oznacenie":"( "+kombinatorika[clicked_item.innerHTML].oznacenie+" * "+kombinatorika[i.innerHTML].oznacenie+" )", "cislo":nova_kombinatorika};
			clicked_item.innerHTML = text;
			buttony.splice(buttony.indexOf(i),1);
			i.remove();
			if (clicked_item.style.backgroundColor == "rgb(206, 244, 255)"){
				clicked_item.style.backgroundColor = "#ffffff";
				var pom = false;
				for (var b=0; b<buttony.length; b++){
					if (buttony[b].style.backgroundColor == "rgb(206, 244, 255)"){
						pom = true;
					}
				}
				if (!pom){spravny_vysledok = false;}
			}
			if (udalosti[clicked_item.innerHTML] != undefined){
				clicked_item.style.backgroundColor = "#e6e6ff";
			}else if(kombinatorika[clicked_item.innerHTML] != undefined){
				clicked_item.style.backgroundColor = "#ffe6e6";
			} else if(cisla[clicked_item.innerHTML] != undefined){
				clicked_item.style.backgroundColor = "#e6ffe6";
			}
			clicked_item = null;
	  		clicked_nastroj = null;
	  	}
	  	else if (clicked_nastroj == "pravdepodobnost"){
			if (parseInt(kombinatorika[clicked_item.innerHTML].cislo) <= parseInt(kombinatorika[i.innerHTML].cislo)){
				var novy_zlomok = najme_menovatel(parseInt(kombinatorika[clicked_item.innerHTML].cislo),parseInt(kombinatorika[i.innerHTML].cislo));
				var cit = novy_zlomok[0];
				var men = novy_zlomok[1];
				var ozn = "P ( { "+kombinatorika[clicked_item.innerHTML].oznacenie+" } z { "+kombinatorika[i.innerHTML].oznacenie+" } )";
				var text = "<strong>P (</strong> { "+kombinatorika[clicked_item.innerHTML].popis+" } z { "+kombinatorika[i.innerHTML].popis+" } <strong>)</strong><br><sub>"+ozn+"</sub>";
			  	cisla[text] = {"nazov":"<strong>P (</strong> { "+kombinatorika[clicked_item.innerHTML].popis+" } z { "+kombinatorika[i.innerHTML].popis+" } <strong>)</strong>", "citatel":cit, "menovatel":men, oznacenie:ozn};
			  	clicked_item.innerHTML = text;
			  	buttony.splice(buttony.indexOf(i),1);
			  	i.remove();
			  	if (clicked_item.style.backgroundColor == "rgb(206, 244, 255)"){
					clicked_item.style.backgroundColor = "#ffffff";
					var pom = false;
					for (var b=0; b<buttony.length; b++){
						if (buttony[b].style.backgroundColor == "rgb(206, 244, 255)"){
							pom = true;
						}
					}
					if (!pom){spravny_vysledok = false;}
				}
				if (udalosti[clicked_item.innerHTML] != undefined){
					clicked_item.style.backgroundColor = "#e6e6ff";
				}else if(kombinatorika[clicked_item.innerHTML] != undefined){
					clicked_item.style.backgroundColor = "#ffe6e6";
				} else if(cisla[clicked_item.innerHTML] != undefined){
					clicked_item.style.backgroundColor = "#e6ffe6";
				}
			  	clicked_item = null;
			  	clicked_nastroj = null;
			}	
		} else{
			document.getElementById("vypis").innerHTML = "Zle si klikol.";
		}
	}
	//nastroje pre 1. kombinatoriku a 2. cislo
	else if (kombinatorika[i.innerHTML] != undefined && cisla[clicked_item.innerHTML] != undefined && (clicked_nastroj == "zjednotenie" || clicked_nastroj == "prienik" || clicked_nastroj == "pravdepodobnost")){
		if (clicked_nastroj == "zjednotenie"){
			var novy_zlomok = sucet_zlomkov(cisla[clicked_item.innerHTML].citatel,cisla[clicked_item.innerHTML].menovatel,kombinatorika[i.innerHTML].cislo,1);
			var cit = novy_zlomok[0];
			var men = novy_zlomok[1];
			var text = "( "+cisla[clicked_item.innerHTML].nazov+" <strong>alebo</strong> "+kombinatorika[i.innerHTML].popis+" )<br><sub>( "+cisla[clicked_item.innerHTML].oznacenie+" + "+kombinatorika[i.innerHTML].oznacenie+" )</sub>";
			cisla[text] = {"nazov":"( "+cisla[clicked_item.innerHTML].nazov+" <strong>alebo</strong> "+kombinatorika[i.innerHTML].popis+" )","oznacenie":"( "+cisla[clicked_item.innerHTML].oznacenie+" + "+kombinatorika[i.innerHTML].oznacenie+" )","citatel":cit,"menovatel":men};
			clicked_item.innerHTML = text;
			buttony.splice(buttony.indexOf(i),1);
			i.remove();
			if (clicked_item.style.backgroundColor == "rgb(206, 244, 255)"){
				clicked_item.style.backgroundColor = "#ffffff";
				var pom = false;
				for (var b=0; b<buttony.length; b++){
					if (buttony[b].style.backgroundColor == "rgb(206, 244, 255)"){
						pom = true;
					}
				}
				if (!pom){spravny_vysledok = false;}
			}
			if (udalosti[clicked_item.innerHTML] != undefined){
				clicked_item.style.backgroundColor = "#e6e6ff";
			}else if(kombinatorika[clicked_item.innerHTML] != undefined){
				clicked_item.style.backgroundColor = "#ffe6e6";
			} else if(cisla[clicked_item.innerHTML] != undefined){
				clicked_item.style.backgroundColor = "#e6ffe6";
			}
			clicked_item = null;
	  		clicked_nastroj = null;
		}
		else if (clicked_nastroj == "prienik"){
			var novy_zlomok = najme_menovatel(cisla[clicked_item.innerHTML].citatel*kombinatorika[i.innerHTML].cislo,cisla[clicked_item.innerHTML].menovatel);
			var cit = novy_zlomok[0];
			var men = novy_zlomok[1];
			var text = "( "+cisla[clicked_item.innerHTML].nazov+" <strong>a zároveň</strong> "+kombinatorika[i.innerHTML].popis+" )<br><sub>( "+cisla[clicked_item.innerHTML].oznacenie+" * "+kombinatorika[i.innerHTML].oznacenie+" )</sub>";
			cisla[text] = {"nazov":"( "+cisla[clicked_item.innerHTML].nazov+" <strong>a zároveň</strong> "+kombinatorika[i.innerHTML].popis+" )","oznacenie":"( "+cisla[clicked_item.innerHTML].oznacenie+" * "+kombinatorika[i.innerHTML].oznacenie+" )","citatel":cit,"menovatel":men};
			clicked_item.innerHTML = text;
			buttony.splice(buttony.indexOf(i),1);
			i.remove();
			if (clicked_item.style.backgroundColor == "rgb(206, 244, 255)"){
				clicked_item.style.backgroundColor = "#ffffff";
				var pom = false;
				for (var b=0; b<buttony.length; b++){
					if (buttony[b].style.backgroundColor == "rgb(206, 244, 255)"){
						pom = true;
					}
				}
				if (!pom){spravny_vysledok = false;}
			}
			if (udalosti[clicked_item.innerHTML] != undefined){
				clicked_item.style.backgroundColor = "#e6e6ff";
			}else if(kombinatorika[clicked_item.innerHTML] != undefined){
				clicked_item.style.backgroundColor = "#ffe6e6";
			} else if(cisla[clicked_item.innerHTML] != undefined){
				clicked_item.style.backgroundColor = "#e6ffe6";
			}
			clicked_item = null;
	  		clicked_nastroj = null;
		} else{
			document.getElementById("vypis").innerHTML = "Zle si klikol.";
		}
	}
	//nastroje pre 1. cislo a 2. kombinatorika
	else if (cisla[i.innerHTML] != undefined && kombinatorika[clicked_item.innerHTML] != undefined && (clicked_nastroj == "zjednotenie" || clicked_nastroj == "prienik" || clicked_nastroj == "pravdepodobnost")){
		if (clicked_nastroj == "zjednotenie"){
			var novy_zlomok = sucet_zlomkov(kombinatorika[clicked_item.innerHTML].cislo,1,cisla[i.innerHTML].citatel,cisla[i.innerHTML].menovatel);
			var cit = novy_zlomok[0];
			var men = novy_zlomok[1];
			var text = "( "+kombinatorika[clicked_item.innerHTML].popis+" <strong>alebo</strong> "+cisla[i.innerHTML].nazov+" )<br><sub>( "+kombinatorika[clicked_item.innerHTML].oznacenie+" + "+cisla[i.innerHTML].oznacenie+" )</sub>";
			cisla[text] = {"nazov":"( "+kombinatorika[clicked_item.innerHTML].popis+" <strong>alebo</strong> "+cisla[i.innerHTML].nazov+" )","oznacenie":"( "+kombinatorika[clicked_item.innerHTML].oznacenie+" + "+cisla[i.innerHTML].oznacenie+" )","citatel":cit,"menovatel":men};
			clicked_item.innerHTML = text;
			buttony.splice(buttony.indexOf(i),1);
			i.remove();
			if (clicked_item.style.backgroundColor == "rgb(206, 244, 255)"){
				clicked_item.style.backgroundColor = "#ffffff";
				var pom = false;
				for (var b=0; b<buttony.length; b++){
					if (buttony[b].style.backgroundColor == "rgb(206, 244, 255)"){
						pom = true;
					}
				}
				if (!pom){spravny_vysledok = false;}
			}
			if (udalosti[clicked_item.innerHTML] != undefined){
				clicked_item.style.backgroundColor = "#e6e6ff";
			}else if(kombinatorika[clicked_item.innerHTML] != undefined){
				clicked_item.style.backgroundColor = "#ffe6e6";
			} else if(cisla[clicked_item.innerHTML] != undefined){
				clicked_item.style.backgroundColor = "#e6ffe6";
			}
			clicked_item = null;
	  		clicked_nastroj = null;
		}
		else if (clicked_nastroj == "prienik"){
			var novy_zlomok = najme_menovatel(kombinatorika[clicked_item.innerHTML].cislo*cisla[i.innerHTML].citatel,cisla[i.innerHTML].menovatel);
			var cit = novy_zlomok[0];
			var men = novy_zlomok[1];
			var text = "( "+kombinatorika[clicked_item.innerHTML].popis+" <strong>a zároveň</strong> "+cisla[i.innerHTML].nazov+" )<br><sub>( "+kombinatorika[clicked_item.innerHTML].oznacenie+" * "+cisla[i.innerHTML].oznacenie+" )</sub>";
			cisla[text] = {"nazov":"( "+kombinatorika[clicked_item.innerHTML].popis+" <strong>a zároveň</strong> "+cisla[i.innerHTML].nazov+" )","oznacenie":"( "+kombinatorika[clicked_item.innerHTML].oznacenie+" * "+cisla[i.innerHTML].oznacenie+" )","citatel":cit,"menovatel":men};
			clicked_item.innerHTML = text;
			buttony.splice(buttony.indexOf(i),1);
			i.remove();
			if (clicked_item.style.backgroundColor == "rgb(206, 244, 255)"){
				clicked_item.style.backgroundColor = "#ffffff";
				var pom = false;
				for (var b=0; b<buttony.length; b++){
					if (buttony[b].style.backgroundColor == "rgb(206, 244, 255)"){
						pom = true;
					}
				}
				if (!pom){spravny_vysledok = false;}
			}
			if (udalosti[clicked_item.innerHTML] != undefined){
				clicked_item.style.backgroundColor = "#e6e6ff";
			}else if(kombinatorika[clicked_item.innerHTML] != undefined){
				clicked_item.style.backgroundColor = "#ffe6e6";
			} else if(cisla[clicked_item.innerHTML] != undefined){
				clicked_item.style.backgroundColor = "#e6ffe6";
			}
			clicked_item = null;
	  		clicked_nastroj = null;
		} else{
			document.getElementById("vypis").innerHTML = "Zle si klikol.";
		}
	}
	if (document.getElementById("vypis").innerHTML != "Zle si klikol."){
		document.getElementById("vypis").innerHTML = "Dobre si klikol.";
	}
	clicked_nastroj = null;
	clicked_item = null;
}

//zjednotenie 2 mnozin (poli)
function zjednotenie(s1,s2){
	var s = [];
	for (var i=0; i<s1.length; i++){
		if (s.indexOf(s1[i]) == -1){s.push(s1[i]);}
	}
	for (var i=0; i<s2.length; i++){
		if (s.indexOf(s2[i]) == -1){s.push(s2[i]);}
	}
	return s;
}

//prienik 2 mnozin (poli)
function prienik(s1,s2){
	var s = [];
	for (var i=0; i<s1.length; i++){
		if (s2.indexOf(s1[i]) != -1){s.push(s1[i]);}
	}
	return s;
}

//zisti ci je s1 podmnozinou s2 (polia)
function je_podmnozina(s1,s2){
	if (typeof s1[0] === "number" && typeof s2[0] === "number"){
		for (var i=0; i<s1.length; i++){
			if (s2.indexOf(s1[i]) == -1){
				return false;
			}
		}
		return true;
	}
	if (!(typeof s1[0] === "number") && !(typeof s2[0] === "number")){
		var pom = false;
		for (var i=0; i<s1.length; i++){
			for (var j=0; j<s2.length; j++){
				if (compare_arrays(s1[i],s2[j])){
					pom = true;
				}
			}
		}
		if (!pom){return false;}
		return true;
	}
	return false;
}

//backtracking ci su viacrozmerne polia rovnake
function compare_arrays(a1,a2){
	if (a1.length != a2.length){return false;}
	var pom = true;
	for (var i=0; i<a1.length; i++){
		if ((typeof a1[i] === "number" && typeof a2[i] === "number") || (typeof a1[i] === "string" && typeof a2[i] === "string")){
			if (a1[i] != a2[i]){
				pom = false;
			}
		}
		else if ((!(typeof a1[i] === "number") && !(typeof a2[i] === "number")) || (!(typeof a1[i] === "string") && !(typeof a2[i] === "string"))){
			pom = compare_arrays(a1[i], a2[i]);
		}
		else{
			pom = false;
		}
	}
	return pom;
}

//precita udalost z jsonu a vytvori z nej string
function udalost_to_text(naz,oz,u){
	var text = naz+"<br><sub>"+oz+" = { ";
	for (var i=0; i<u.length; i++){
		if (typeof u[i] === "number" || typeof u[i] === "string"){
			text += (u[i].toString() + ", "); 
		} else{
			text += array_to_string(u[i]) + ", "
		}
	}
	if (u.length != 0){
		text = text.substring(0,text.length-2)+" ";
	} 
	text += "}</sub>";
	return text;
}

//backtracking pre danie kazdeho pola a jeho podpola do stringu
function array_to_string(a){
	var text = "( ";
	for (var i=0; i<a.length; i++){
		if (typeof a[i] === "number" || typeof a[i] === "string"){
			text += (a[i].toString() + ", "); 
		} else{
			text += array_to_string(a[i]) + ", "
		}
	}
	return text.substring(0,text.length-2)+" )";
}

//vypocita pravdepodobnost s najmensim menovatelom
function najme_menovatel(c,m){
	var cit = c;
	var men = m;
	for (var i=c; i>=2; i--){
		while (cit%i==0 && men%i==0){
			cit /= i;
			men /= i;
		}
	}
	return [cit,men];
}

//vytvori kartez. sucin dvoch poli
function karteziansky_sucin(s1,s2){
	var set = [];
	for (var i=0; i<s1.length; i++){
		for (var j=0; j<s2.length; j++){
			set.push([s1[i],s2[j]]);
		}
	}
	return set;
}

//vypocita sucet dvoch zlomkov
function sucet_zlomkov(c1,m1,c2,m2){
	var fraction1Numerator = c1;
	var fraction1Denominator = m1;
	var fraction2Numerator = c2;
	var fraction2Denominator = m2;
  	var novy_menovatel = leastCommonMultiple(fraction1Denominator, fraction2Denominator); 
  	fraction1Numerator *= (novy_menovatel / fraction1Denominator);
	fraction2Numerator *= (novy_menovatel / fraction2Denominator);
	var novy_citatel = fraction1Numerator + fraction2Numerator;
	return [novy_citatel,novy_menovatel];
}

//vypocita rozdiel dvoch zlomkov
function rozdiel_zlomkov(c1,m1,c2,m2){
	var fraction1Numerator = c1;
	var fraction1Denominator = m1;
	var fraction2Numerator = c2;
	var fraction2Denominator = m2;
  	var novy_menovatel = leastCommonMultiple(fraction1Denominator, fraction2Denominator); 
  	fraction1Numerator *= (novy_menovatel / fraction1Denominator);
	fraction2Numerator *= (novy_menovatel / fraction2Denominator);
	var novy_citatel = fraction1Numerator - fraction2Numerator;
	return [novy_citatel,novy_menovatel];
}

//vypocita vyjvyssi spolocny delitel
function highestCommonFactor(a, b) {
    if (b == 0) {
        return a;
    }
    return highestCommonFactor(b, a%b);
}

//vypocita najmensi spolocny delitel
function leastCommonMultiple(a,b) {
    return a*b/(highestCommonFactor(a,b));
}

//ulozenie objektov na ploche do databazy
function save_btns(){
	if (akt_index === null){return;}
	var dic = {
		cisla:cisla,
		udalosti:udalosti,
		kombinatorika:kombinatorika,
		buttony:[],
		buttony2:[]
	};
	for (var i=0; i<buttony.length; i++){
		var pom = {};
		pom.left = buttony[i].style.left;
		pom.top = buttony[i].style.top;
		pom.color = buttony[i].style.backgroundColor;
		pom.innerHTML = buttony[i].innerHTML;
		dic.buttony.push(pom);
	}
	for (var i=0; i<buttony2.length; i++){
		var pom = {};
		pom.left = buttony2[i].style.left;
		pom.top = buttony2[i].style.top;
		pom.color = buttony2[i].style.backgroundColor;
		pom.innerHTML = buttony2[i].innerHTML;
		dic.buttony2.push(pom);
	}
	$.ajax({
      method: "POST",
      url: "save_btns.php",
      data: {id_priklad:akt_index, vsetky_data:JSON.stringify(dic), spravny_vysledok:spravny_vysledok},
      async:false
    })
      .done(function(msg) {
      	console.log('done');
      	console.log(msg);
      	if (msg){
      		//console.log(msg);
      		if (msg == "nie si prihlaseny"){
      			if (pr_btns[akt_index] == undefined){
      				pr_btns[akt_index] = {"cisla":{},"udalosti":{},"kombinatorika":{},"buttony":[],"buttony2":[]};
      			}
      			pr_btns[akt_index].cisla = cisla;
	      		pr_btns[akt_index].udalosti = udalosti;
	      		pr_btns[akt_index].kombinatorika = kombinatorika;
	      		pr_btns[akt_index].buttony = [];
	      		pr_btns[akt_index].buttony2 = [];
	      		for (var i=0; i<buttony.length; i++){
					var pom = {};
					pom.left = buttony[i].style.left;
					pom.top = buttony[i].style.top;
					pom.color = buttony[i].style.backgroundColor;
					pom.innerHTML = buttony[i].innerHTML;
					pr_btns[akt_index].buttony.push(pom);
				}
				for (var i=0; i<buttony2.length; i++){
					var pom = {};
					pom.left = buttony2[i].style.left;
					pom.top = buttony2[i].style.top;
					pom.color = buttony2[i].style.backgroundColor;
					pom.innerHTML = buttony2[i].innerHTML;
					pr_btns[akt_index].buttony2.push(pom);
				}
				localStorage.setItem("priklady",JSON.stringify(pr_btns));
      		}
      	}
      })
      .fail(function() {
      	console.log("fail");
      });
}

//nacitanie objektov na ploche z databazy
function load_btns(){
	if (akt_index === null){return;}
	$.ajax({
      method: "POST",
      url: "load_btns.php",
      data: {id_priklad:akt_index}
    })
      .done(function(msg) {
      	if(msg=="nie si prihlaseny"){
      		var pom = JSON.parse(localStorage.getItem("priklady"));
      		if (pom === null){
      			pr_btns = {};
      			return;
      		}
      		pr_btns = pom;
      		if (pr_btns[akt_index] == undefined){
      			pr_btns[akt_index] = {"cisla":{},"udalosti":{},"kombinatorika":{},"buttony":[],"buttony2":[]};
      			return;
      		}
      		udalosti = pr_btns[akt_index].udalosti;
      		cisla = pr_btns[akt_index].cisla;
      		kombinatorika = pr_btns[akt_index].kombinatorika;
      		//console.log(pr_btns);
      		for (var i=0; i<buttony.length; i++){
      			buttony[i].remove();
      			buttony.splice(buttony.indexOf(buttony[i]),1);
      		}
      		for (var i=0; i<buttony2.length; i++){
      			buttony2[i].remove();
      			buttony2.splice(buttony2.indexOf(buttony2[i]),1);
      		}
      		buttony = [];
      		buttony2 = [];
      		for (var i=0; i<pr_btns[akt_index].buttony.length; i++){
	      		var btn = document.createElement("div");
				buttony.push(btn);
				btn.className = "draggable_div";
				btn.innerHTML = pr_btns[akt_index].buttony[i].innerHTML;
				btn.style.position = "absolute";
				btn.style.left = pr_btns[akt_index].buttony[i].left;
				btn.style.top = pr_btns[akt_index].buttony[i].top;
				btn.style.backgroundColor = pr_btns[akt_index].buttony[i].color;
				btn.style.maxWidth = "300px";
				btn.onclick = function(btn){return function(){click_item(btn);}}(btn);

				btn.addEventListener("mousedown", function(e){
					dragged_btn = this;
				});

				document.getElementById("plocha").appendChild(btn);
	      	}
	      	for (var i=0; i<pr_btns[akt_index].buttony2.length; i++){
	      		var div = document.getElementById("div_udalosti");
				var btn = document.createElement("button");
				btn.className = "draggable_div";
						
				btn.addEventListener("mousedown",function(e){
					novy_btn_text = this.innerHTML;
				});
				btn.addEventListener("dblclick",function(e){
					this.remove();
					buttony2.splice(buttony2.indexOf(this),1);
				});

				btn.innerHTML = pr_btns[akt_index].buttony2[i].innerHTML;

				btn.style.margin = "3px";
				div.appendChild(btn);

				buttony2.push(btn);
	      	}
      		return;
      	}
      	if (!msg){return;}
      	var jsn = JSON.parse(msg);
      	if (jsn.spravny_vysledok == "1"){spravny_vysledok = true;}
      	else{spravny_vysledok = false;}
      	var dic = JSON.parse(jsn.data);
      	cisla = dic.cisla;
      	udalosti = dic.udalosti;
      	kombinatorika = dic.kombinatorika;
      	for (var i=0; i<buttony.length; i++){
      		buttony[i].remove();
      		buttony.splice(buttony.indexOf(buttony[i]),1);
      	}
      	for (var i=0; i<buttony2.length; i++){
      		buttony2[i].remove();
      		buttony2.splice(buttony2.indexOf(buttony2[i]),1);
      	}
      	buttony = [];
      	buttony2 = [];
      	for (var i=0; i<dic.buttony.length; i++){
      		var btn = document.createElement("div");
			buttony.push(btn);
			btn.className = "draggable_div";
			btn.innerHTML = dic.buttony[i].innerHTML;
			btn.style.position = "absolute";
			btn.style.left = dic.buttony[i].left;
			btn.style.top = dic.buttony[i].top;
			btn.style.backgroundColor = dic.buttony[i].color;
			btn.style.maxWidth = "300px";
			btn.onclick = function(btn){return function(){click_item(btn);}}(btn);

			btn.addEventListener("mousedown", function(e){
				dragged_btn = this;
			});

			document.getElementById("plocha").appendChild(btn);
      	}
      	for (var i=0; i<dic.buttony2.length; i++){
      		var div = document.getElementById("div_udalosti");
			var btn = document.createElement("button");
			btn.className = "draggable_div";
						
			btn.addEventListener("mousedown",function(e){
				novy_btn_text = this.innerHTML;
			});
			btn.addEventListener("dblclick",function(e){
				this.remove();
				buttony2.splice(buttony2.indexOf(this),1);
			});

			btn.innerHTML = dic.buttony2[i].innerHTML;

			btn.style.margin = "3px";
			div.appendChild(btn);

			buttony2.push(btn);
      	}
      })
      .fail(function() {
      	console.log("fail");
      });
}

var polek = [];

function pridaj_kom() {
	var my_polek = polek;
	polek = [];

	var select = document.getElementById("typ_kombinatoriky");
	var select2 = document.getElementById("opakovanie_kombinatoriky");
	var typ = select.options[select.selectedIndex].value;
	var op = select2.options[select2.selectedIndex].value;
	var n = document.getElementById("pocet_prvkov").value;
	var k = document.getElementById("trieda_prvkov").value;

	var oznacenie = document.getElementById("oz_kom").innerHTML;
	var cislo = 0;

	if (typ == "kombinacie" && op == "neopakovanie"){
		cislo = math.combinations(n,k);
	} else if (typ == "kombinacie" && op == "opakovanie"){
		cislo = math.combinations(n+k+1,k);
	} else if (typ == "variacie" && op == "neopakovanie"){
		cislo = math.factorial(n)/math.factorial(n-k);
	} else if (typ == "variacie" && op == "opakovanie"){
		cislo = math.pow(n,k);
	} else if (typ == "permutacie" && op == "neopakovanie"){
		cislo = math.factorial(n);
	} else if (typ == "permutacie" && op == "opakovanie"){
		cislo = math.factorial(n);
		for (var i=0; i<my_polek.length; i++){
			cislo /= math.factorial(parseInt(my_polek[i]));
		}
	}

	var text = document.getElementById("popis_kombinatoriky").value+"<br><sub>"+oznacenie+"</sub>";
	kombinatorika[text] = {"popis":document.getElementById("popis_kombinatoriky").value,"oznacenie":oznacenie,"cislo":cislo};

	var btn = document.createElement("div");
	buttony.push(btn);
	btn.className = "draggable_div";
	btn.innerHTML = text;
	btn.style.position = "absolute";
	btn.style.left = 0 + "px";
	btn.style.top = 0 + "px";
	btn.style.maxWidth = "300px";
	btn.style.backgroundColor = "#ffe6e6";

	btn.onclick = function(btn){return function(){click_item(btn);}}(btn);

	btn.addEventListener("mousedown", function(e){
		dragged_btn = this;
	});

	document.getElementById("plocha").appendChild(btn);

	var div = document.getElementById("div_udalosti");
	var btn = document.createElement("button");
	btn.className = "draggable_div";
			
	btn.addEventListener("mousedown",function(e){
		novy_btn_text = this.innerHTML;
	});
	btn.addEventListener("dblclick",function(e){
		this.remove();
		buttony2.splice(buttony2.indexOf(this),1);
	});

	btn.innerHTML = text;
	btn.style.backgroundColor = "#ffe6e6";

	btn.style.margin = "3px";
	div.appendChild(btn);

	buttony2.push(btn);
}

function pridaj_cislo(){
	var popis = document.getElementById("popis_cisla").value;
	var ozn = document.getElementById("oznacenie_cisla").value;
	var cislo = document.getElementById("cislo_num").value;
	var text = popis+"<br>"+ozn+" = "+cislo;
	cisla[text] = {"nazov":popis, "citatel":parseInt(cislo), "menovatel":1, "oznacenie":ozn};

	var btn = document.createElement("div");
	buttony.push(btn);
	btn.className = "draggable_div";
	btn.innerHTML = text;
	btn.style.position = "absolute";
	btn.style.left = 0 + "px";
	btn.style.top = 0 + "px";
	btn.style.maxWidth = "300px";
	btn.style.backgroundColor = "#e6ffe6";

	btn.onclick = function(btn){return function(){click_item(btn);}}(btn);

	btn.addEventListener("mousedown", function(e){
		dragged_btn = this;
	});

	document.getElementById("plocha").appendChild(btn);

	var div = document.getElementById("div_udalosti");
	var btn = document.createElement("button");
	btn.className = "draggable_div";
			
	btn.addEventListener("mousedown",function(e){
		novy_btn_text = this.innerHTML;
	});
	btn.addEventListener("dblclick",function(e){
		this.remove();
		buttony2.splice(buttony2.indexOf(this),1);
	});

	btn.innerHTML = text;
	btn.style.backgroundColor = "#e6ffe6";

	btn.style.margin = "3px";
	div.appendChild(btn);

	buttony2.push(btn);
}

var prvky_udal = []
function pridaj_prvok_udalosti() {
	var val = document.getElementById("udalost").value;
	 if (val != ""){
	 	if (prvky_udal.indexOf(val) == -1){
	 		if (parseInt(val) >=0 && parseInt(val) <=100){
	 			document.getElementById("vypis_ud").innerHTML = "";
		 		if (document.getElementById("udalosti").value != ""){
		 			document.getElementById("udalosti").value += ", ";
		 		}
		 		document.getElementById("udalosti").value += val;
		 		prvky_udal.push(val);
		 	} else {
				document.getElementById("vypis_ud").innerHTML = "Prvky, ktoré pridávaš do udalosti musia byť v intervale <0,100>";
		 	}
	 	} else{
	 		document.getElementById("vypis_ud").innerHTML = "V udalosti nemôžeš mať dva rovnaké prvky.";
	 	}
	 }
}

function pridaj_udalost(){
	var pom = document.getElementById("udalosti").value.split(", ");
	var udal = [];

	for (var i=0; i<pom.length; i++){
		udal.push(parseInt(pom[i]));
	}

	var text = document.getElementById("popis_udalosti").value+"<br><sub>"+document.getElementById("oznacenie_udalosti").value+" = { "+document.getElementById("udalosti").value+" } </sub>";
	udalosti[text] = {"nazov":document.getElementById("popis_udalosti").value,"oznacenie":document.getElementById("oznacenie_udalosti").value,"mnozina":udal};

	var btn = document.createElement("div");
	buttony.push(btn);
	btn.className = "draggable_div";
	btn.innerHTML = text;
	btn.style.position = "absolute";
	btn.style.left = 0 + "px";
	btn.style.top = 0 + "px";
	btn.style.maxWidth = "300px";
	btn.style.backgroundColor = "#e6e6ff";

	btn.onclick = function(btn){return function(){click_item(btn);}}(btn);

	btn.addEventListener("mousedown", function(e){
		dragged_btn = this;
	});

	document.getElementById("plocha").appendChild(btn);

	prvky_udal = [];

	var div = document.getElementById("div_udalosti");
	var btn = document.createElement("button");
	btn.className = "draggable_div";
			
	btn.addEventListener("mousedown",function(e){
		novy_btn_text = this.innerHTML;
	});
	btn.addEventListener("dblclick",function(e){
		this.remove();
		buttony2.splice(buttony2.indexOf(this),1);
	});

	btn.innerHTML = text;
	btn.style.backgroundColor = "#e6e6ff";

	btn.style.margin = "3px";
	div.appendChild(btn);

	buttony2.push(btn);
}

function zmen_oznacenie(){
	document.getElementById("oz_udalosti").value = document.getElementById("oznacenie_udalosti").value+" = ";
}

function zmen_popis(){
	document.getElementById("pop_udalosti").value = document.getElementById("popis_udalosti").value;
}

var modal_type = "1";
function modal_to_kom(){
	if (document.getElementById("modal_kombinatorika").style.display == "none"){
		document.getElementById("modal_kombinatorika").style.display = "inline";
		document.getElementById("modal_udalosti").style.display = "none";
		document.getElementById("modal_cislo").style.display = "none";
		document.getElementById("modal_b1").className = "btn btn-default";
		document.getElementById("modal_b3").className = "btn btn-default";
		document.getElementById("modal_b2").className = "btn btn-default active";
		modal_type = "2";
		zmen_kom();
	}
}

function modal_to_ud(){
	if (document.getElementById("modal_udalosti").style.display == "none"){
		document.getElementById("modal_udalosti").style.display = "inline";
		document.getElementById("modal_kombinatorika").style.display = "none";
		document.getElementById("modal_cislo").style.display = "none";
		document.getElementById("modal_b2").className = "btn btn-default";
		document.getElementById("modal_b3").className = "btn btn-default";
		document.getElementById("modal_b1").className = "btn btn-default active";
		modal_type = "1";
	}
}

function modal_to_num(){
	if (document.getElementById("modal_cislo").style.display == "none"){
		document.getElementById("modal_udalosti").style.display = "none";
		document.getElementById("modal_kombinatorika").style.display = "none";
		document.getElementById("modal_cislo").style.display = "inline";
		document.getElementById("modal_b2").className = "btn btn-default";
		document.getElementById("modal_b3").className = "btn btn-default active";
		document.getElementById("modal_b1").className = "btn btn-default";
		modal_type = "3";
	}
}

function pridaj_nieco(){
	if (modal_type == "1"){
		if (document.getElementById("popis_udalosti").value == ""){
			document.getElementById("vypis_ud").innerHTML = "Udalosť musí mať popis.";
			return;
		}
		if (document.getElementById("oznacenie_udalosti").value == ""){
			document.getElementById("vypis_ud").innerHTML = "Udalosť musí mať označenie.";
			return;
		}
		pridaj_udalost();
		document.getElementById("vypis_ud").innerHTML = "";
		$('#myModal').modal('hide');
	} else if (modal_type == "2"){
		var select = document.getElementById("typ_kombinatoriky");
		var select2 = document.getElementById("opakovanie_kombinatoriky");
		var typ = select.options[select.selectedIndex].value;
		var op = select2.options[select2.selectedIndex].value;
		var n = document.getElementById("pocet_prvkov").value;
		var k = document.getElementById("trieda_prvkov").value;
		if (document.getElementById("popis_kombinatoriky").value == ""){
			document.getElementById("vypis_kom").innerHTML = "Udalosť musí mať popis.";
			return;
		}
		if (n.toString() == ""){
			document.getElementById("vypis_kom").innerHTML = "Musíš uviesť aj počet prvkov.";
			return;
		}
		if ((typ == "kombinacie" || typ == "variacie") && k.toString() == ""){
			document.getElementById("vypis_kom").innerHTML = "Musíš uviesť aj triedu.";
			return;
		}
		if (parseInt(n) < 0 || parseInt(n) > 100){
			document.getElementById("vypis_kom").innerHTML = "Počet prvkov musí byť z intervalu <0,100>.";
			return;
		}
		if (parseInt(k) > parseInt(n)){
			if (!(typ == "variacie" && op == "opakovanie")){
				document.getElementById("vypis_kom").innerHTML = "Trieda musí byť menšia alebo rovná ako je počet prvkov.";
				return;
			}
		}
		var pom = 0;
		for (var i=0; i<polek.length; i++){
			console.log(polek[i]);
			pom += parseInt(polek[i]);
		}
		//console.log("pom = "+pom);
		if (pom > parseInt(n)){
			document.getElementById("vypis_kom").innerHTML = "Súčet opakujúcich sa prvkov musí byť menší alebo rovný ako je celkový počet prvkov.";
			return;
		}
		pridaj_kom();
		document.getElementById("vypis_kom").innerHTML = "";
		$('#myModal').modal('hide');
	} else{
		if (document.getElementById("popis_cisla").value == ""){
			document.getElementById("vypis_num").innerHTML = "Číslo musí mať popis.";
			return;
		}
		if (document.getElementById("oznacenie_cisla").value == ""){
			document.getElementById("vypis_num").innerHTML = "Číslo musí mať označenie.";
			return;
		}
		var cislo = document.getElementById("cislo_num").value;
		if (cislo == null || cislo == ""){
			document.getElementById("vypis_num").innerHTML = "Musíš zadať aj číslo z intervalu <1,100>.";
			return;
		}
		if (parseInt(cislo) < 0 || parseInt(cislo) > 100){
			document.getElementById("vypis_num").innerHTML = "Číslo musí byť z intervalu <0,100>.";
			return;
		}
		pridaj_cislo();
		document.getElementById("vypis_num").innerHTML = "";
		$('#myModal').modal('hide');
	}
}

function zmen_popis_kom(){
	document.getElementById("pop_kom").innerHTML = document.getElementById("popis_kombinatoriky").value;
}

function pridaj_k(){
	polek.push(document.getElementById("prvok_kom").value);
	zmen_kom();
}

function zmen_kom(){
	document.getElementById("prvok_kom").disabled = false;
	document.getElementById("pridaj_k_btn").disabled = false;
	document.getElementById("trieda_prvkov").disabled = false;

	var select = document.getElementById("typ_kombinatoriky");
	var select2 = document.getElementById("opakovanie_kombinatoriky");

	var typ = select.options[select.selectedIndex].value;
	var op = select2.options[select2.selectedIndex].value;
	var n = document.getElementById("pocet_prvkov").value.toString();
	var k = document.getElementById("trieda_prvkov").value.toString();
	
	if (typ == "kombinacie"){
		document.getElementById("prvok_kom").disabled = true;
		document.getElementById("pridaj_k_btn").disabled = true;
		if (n == ""){n = "n";}
		if (k == ""){k = "k";}
		if (op == "neopakovanie"){
			document.getElementById("oz_kom").innerHTML = "C<sub>"+k+"</sub>("+n+")";
		}else {
			document.getElementById("oz_kom").innerHTML = "C'<sub>"+k+"</sub>("+n+")";
		}
	}
	if (typ == "variacie"){
		document.getElementById("prvok_kom").disabled = true;
		document.getElementById("pridaj_k_btn").disabled = true;
		if (n == ""){n = "n";}
		if (k == ""){k = "k";}
		if (op == "neopakovanie"){
			document.getElementById("oz_kom").innerHTML = "V<sub>"+k+"</sub>("+n+")";
		}else {
			document.getElementById("oz_kom").innerHTML = "V'<sub>"+k+"</sub>("+n+")";
		}
	}
	if (typ == "permutacie"){
		document.getElementById("trieda_prvkov").disabled = true;
		if (n == ""){n = "n";}
		if (op == "neopakovanie"){
			document.getElementById("prvok_kom").disabled = true;
			document.getElementById("pridaj_k_btn").disabled = true;	
			document.getElementById("oz_kom").innerHTML = "P("+n+")";
		} else {
			var pom = "P<sub>";
			for (var i=0; i<polek.length; i++){
				if (pom == "P<sub>"){
					pom += polek[i].toString();
				} else{
					pom += (","+polek[i].toString());
				}
			}
			pom += ("</sub>("+n+")");
			document.getElementById("oz_kom").innerHTML = pom;
		}
	}
}

function vymaz_tvorenu_udalost() {
	document.getElementById("udalosti").value = "";
	prvky_udal = [];
}

function vymaz_k() {
	document.getElementById("udalosti").value = "";
	polek = [];
	zmen_kom();
}

function zmen_popis_num(){
	document.getElementById("pop_cislo").innerHTML = document.getElementById("popis_cisla").value;
}

function zmen_oznacenie_num(){
	document.getElementById("oz_cislo").innerHTML = document.getElementById("oznacenie_cisla").value+" = ";
}

function zmen_cislo(){
	var cislo = document.getElementById("cislo_num").value;
	if (parseInt(cislo)<0 || parseInt(cislo)>100){
		document.getElementById("vypis_num").innerHTML = "Číslo musí byť z intervalu <0,100>."
		return;
	}
	document.getElementById("vypis_cisla").value = cislo;
}

$(document).ready(function(){
    $('[data-toggle="tooltip"]').tooltip();   
});