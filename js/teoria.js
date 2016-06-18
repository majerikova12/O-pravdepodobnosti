
var script = document.createElement('script');
script.src = 'js/jquery-2.1.4.js';
script.type = 'text/javascript';

var images = {};
images["img/cube123.png"]=["img/cube513.png","img/cube135.png","img/cube1.png"]; images["img/cube135.png"]=["img/cube415.png","img/cube154.png","img/cube1.png"]; images["img/cube154.png"]=["img/cube214.png","img/cube142.png","img/cube1.png"]; images["img/cube142.png"]=["img/cube312.png","img/cube123.png","img/cube1.png"];
images["img/cube214.png"]=["img/cube624.png","img/cube246.png","img/cube2.png"]; images["img/cube246.png"]=["img/cube326.png","img/cube263.png","img/cube2.png"]; images["img/cube263.png"]=["img/cube123.png","img/cube231.png","img/cube2.png"]; images["img/cube231.png"]=["img/cube421.png","img/cube214.png","img/cube2.png"];
images["img/cube312.png"]=["img/cube632.png","img/cube326.png","img/cube3.png"]; images["img/cube326.png"]=["img/cube536.png","img/cube365.png","img/cube3.png"]; images["img/cube365.png"]=["img/cube135.png","img/cube351.png","img/cube3.png"]; images["img/cube351.png"]=["img/cube231.png","img/cube312.png","img/cube3.png"];
images["img/cube415.png"]=["img/cube645.png","img/cube456.png","img/cube4.png"]; images["img/cube456.png"]=["img/cube246.png","img/cube462.png","img/cube4.png"]; images["img/cube462.png"]=["img/cube142.png","img/cube421.png","img/cube4.png"]; images["img/cube421.png"]=["img/cube541.png","img/cube415.png","img/cube4.png"];
images["img/cube513.png"]=["img/cube653.png","img/cube536.png","img/cube5.png"]; images["img/cube536.png"]=["img/cube456.png","img/cube564.png","img/cube5.png"]; images["img/cube564.png"]=["img/cube154.png","img/cube541.png","img/cube5.png"]; images["img/cube541.png"]=["img/cube351.png","img/cube513.png","img/cube5.png"];
images["img/cube624.png"]=["img/cube564.png","img/cube645.png","img/cube6.png"]; images["img/cube645.png"]=["img/cube365.png","img/cube653.png","img/cube6.png"]; images["img/cube653.png"]=["img/cube263.png","img/cube632.png","img/cube6.png"]; images["img/cube632.png"]=["img/cube462.png","img/cube624.png","img/cube6.png"];

var hody = {"1":0,"2":0,"3":0,"4":0,"5":0,"6":0};
var dely = [];

var hody2 = {"1":0,"2":0,"3":0,"4":0,"5":0,"6":0};
var dely2 = [];

var rolled = ["img/cube1.png","img/cube2.png","img/cube3.png","img/cube4.png","img/cube5.png","img/cube6.png"];
var hodene = ["25"];

function spin(num){
	var cube = document.getElementById("cube").src;
	if (num == 1){document.getElementById("cube").src = images[cube.substring(cube.indexOf("img"),cube.length)][0];}
	if (num == 2){document.getElementById("cube").src = images[cube.substring(cube.indexOf("img"),cube.length)][1];}
}

function spin2(num){
	var cube = document.getElementById("cube2").src;
	if (num == 1){document.getElementById("cube2").src = images[cube.substring(cube.indexOf("img"),cube.length)][0];}
	if (num == 2){document.getElementById("cube2").src = images[cube.substring(cube.indexOf("img"),cube.length)][1];}
}

function add_number(){
	if (document.getElementById("page2_2").style.display == "inline"){return;}
	var row = document.getElementById("tr_numbers");
	var cell = row.insertCell(-1);
	var cube = document.getElementById("cube").src;
	var src = images[cube.substring(cube.indexOf("img"),cube.length)][2];
	cell.innerHTML = '<img style="margin: 0 10px" height="30" width="30" src='+src+'>';
	var row_b = document.getElementById("tr_buttons");
	var cell_b = row_b.insertCell(-1);
	var elem = document.createElement('img');
	elem.onclick = function(){
		del_number(cell,cell_b);
	};
	dely.push(cell_b);
	elem.setAttribute("style","margin: 0 10px");
	elem.setAttribute("width","30");
	elem.setAttribute("src","img/del_button.png");
	cell_b.appendChild(elem);
	hody[src.substring(src.indexOf("img")+8,src.indexOf("img")+9)] += 1;
	if (hody["1"]==1 && hody["2"]==1 && hody["3"]==1 && hody["4"]==1 && hody["5"]==1 && hody["6"]==1){
		document.getElementById("page2_2").style.display = "inline";
		document.getElementById("page2_3").style.display = "inline";
		document.getElementById("page2_1").style.display = "none";
		for (var i=0; i<dely.length; i++){
			dely[i].remove();
		}
	}
	if (hody["1"]>1 || hody["2"]>1 || hody["3"]>1 || hody["4"]>1 || hody["5"]>1 || hody["6"]>1){
		document.getElementById("page2_chyba").style.display = "inline";
	}
}

function add_number2(){
	if (document.getElementById("page2_2").style.display != "inline"){return;}
	var row = document.getElementById("tr_numbers2");
	var cell = row.insertCell(-1);
	var cube = document.getElementById("cube2").src;
	var src = images[cube.substring(cube.indexOf("img"),cube.length)][2];
	cell.innerHTML = '<img style="margin: 0 10px" height="30" width="30" src='+src+'>';
	var row_b = document.getElementById("tr_buttons2");
	var cell_b = row_b.insertCell(-1);
	var elem = document.createElement('img');
	elem.onclick = function(){
		del_number2(cell,cell_b);
	};
	dely2.push(cell_b);
	elem.setAttribute("style","margin: 0 10px");
	elem.setAttribute("width","30");
	elem.setAttribute("src","img/del_button.png");
	cell_b.appendChild(elem);
	hody2[src.substring(src.indexOf("img")+8,src.indexOf("img")+9)] += 1;
	if (hody2["1"]==0 && hody2["2"]==1 && hody2["3"]==0 && hody2["4"]==1 && hody2["5"]==0 && hody2["6"]==1){
		document.getElementById("page2_4").style.display = "inline";
		document.getElementById("page2_2").style.display = "none";
		for (var i=0; i<dely2.length; i++){
			dely2[i].remove();
		}
	}
	if (hody2["1"]>0 || hody2["2"]>1 || hody2["3"]>0 || hody2["4"]>1 || hody2["5"]>0 || hody2["6"]>1){
		document.getElementById("page2_chyba2").style.display = "inline";
	}
}

function del_number(cell,cell_b){
	if (document.getElementById("page2_2").style.display == "inline"){return;}
	var src = cell.innerHTML.substring(cell.innerHTML.indexOf("src=")+4,cell.innerHTML.indexOf("src=")+18);
	hody[src.substring(src.indexOf("img")+8,src.indexOf("img")+9)] -= 1;
	cell.remove();
	cell_b.remove();
	var index = dely.indexOf(cell_b);
	dely.splice(index,1);
	if (hody["1"]<=1 && hody["2"]<=1 && hody["3"]<=1 && hody["4"]<=1 && hody["5"]<=1 && hody["6"]<=1){
		document.getElementById("page2_chyba").style.display = "none";
	}
	if (hody["1"]==1 && hody["2"]==1 && hody["3"]==1 && hody["4"]==1 && hody["5"]==1 && hody["6"]==1){
		document.getElementById("page2_2").style.display = "inline";
		document.getElementById("page2_3").style.display = "inline";
		document.getElementById("page2_1").style.display = "none";
		for (var i=0; i<dely.length; i++){
			dely[i].remove();
		}
	}
}

function del_number2(cell,cell_b){
	if (document.getElementById("page2_2").style.display != "inline"){return;}
	var src = cell.innerHTML.substring(cell.innerHTML.indexOf("src=")+4,cell.innerHTML.indexOf("src=")+18);
	hody2[src.substring(src.indexOf("img")+8,src.indexOf("img")+9)] -= 1;
	cell.remove();
	cell_b.remove();
	var index = dely2.indexOf(cell_b);
	dely2.splice(index,1);
	if (hody2["1"]<=1 && hody2["2"]<=1 && hody2["3"]<=1 && hody2["4"]<=1 && hody2["5"]<=1 && hody2["6"]<=1){
		document.getElementById("page2_chyba2").style.display = "none";
	}
	if (hody2["1"]==1 && hody2["2"]==1 && hody2["3"]==1 && hody2["4"]==1 && hody2["5"]==1 && hody2["6"]==1){
		document.getElementById("page2_4").style.display = "inline";
		document.getElementById("page2_2").style.display = "none";
		for (var i=0; i<dely2.length; i++){
			dely2[i].remove();
		}
	}
}

function tosite2(){
	document.getElementById("site1").style.display = "none";
	document.getElementById("site2").style.display = "inline";
}

function site2_btn(num){
	if (num == 1){
		document.getElementById("site2_jeden").style.disabled = "disabled";
		document.getElementById("site2_jeden").style.border = "2px solid #7F0000";
	}
	if (num == 2){
		document.getElementById("site2_dva").style.disabled = "disabled";
		document.getElementById("site2_dva").style.border="2px solid #7F0000";
	}
	if (num == 3){
		document.getElementById("site2_tri").style.disabled = "disabled";
		document.getElementById("site2_tri").style.border="2px solid #4CAF50";
		document.getElementById("site2_vyrolovat").style.display = "inline";
	}
}

function tosite3(){
	document.getElementById("site2").style.display = "none";
	document.getElementById("site3").style.display = "inline";
}

function contains(pole,prvok) {
    for (var i=0; i<pole.length;i++) {
       if (pole[i] == prvok) {
           return true;
       }
    }
    return false;
}

function rollDice(){
	casovac = setInterval(function(){
		document.getElementById("side3_dice1").src = rolled[Math.floor(Math.random()*rolled.length)];
		document.getElementById("side3_dice2").src = rolled[Math.floor(Math.random()*rolled.length)];
	},80);
	casovac2 = setTimeout(function(){
		clearInterval(casovac);
		var num1 = rolled[Math.floor(Math.random()*rolled.length)];
		var num2 = rolled[Math.floor(Math.random()*rolled.length)];
		document.getElementById("side3_dice1").src = num1;
		document.getElementById("side3_dice2").src = num2;
		var sucet = parseInt(num1.charAt(8))+parseInt(num2.charAt(8));
		document.getElementById("rolled_num").innerHTML = " ( "+num1.charAt(8)+" , "+num2.charAt(8)+" ) = "+(sucet).toString();
		var hod = num1.charAt(8)+num2.charAt(8);
		if (!contains(hodene,hod)){
			if (hodene.length%6 == 0){
				document.getElementById("vsetky_pripady").innerHTML += "<br>";
			}
			hodene.push(hod);
			document.getElementById("vsetky_pripady").innerHTML += " ( "+num1.charAt(8)+" , "+num2.charAt(8)+" )";
			if (sucet == 9){
				document.getElementById("priaznive_pripady").innerHTML += "( "+num1.charAt(8)+" , "+num2.charAt(8)+" ) ";
			}
			if (hodene.length == 36 && contains(hodene,"45") && contains(hodene,"54") && contains(hodene,"36") && contains(hodene,"63")){
				document.getElementById("page6_1").style.display = "inline";
			}
		}
	},2000);
}

function rollEndDice(){
	casovac = setInterval(function(){
		document.getElementById("side3_dice1").src = rolled[Math.floor(Math.random()*rolled.length)];
		document.getElementById("side3_dice2").src = rolled[Math.floor(Math.random()*rolled.length)];
	},80);
	casovac2 = setTimeout(function(){
		clearInterval(casovac);
		var num1 = rolled[Math.floor(Math.random()*rolled.length)];
		var num2 = rolled[Math.floor(Math.random()*rolled.length)];
		document.getElementById("side3_dice1").src = num1;
		document.getElementById("side3_dice2").src = num2;
		var sucet = parseInt(num1.charAt(8))+parseInt(num2.charAt(8));
		document.getElementById("rolled_num").innerHTML = " ( "+num1.charAt(8)+" , "+num2.charAt(8)+" ) = "+(sucet).toString();
		for (var i=1;i<=6;i++){
			for (var j=1;j<=6;j++){
				var hod = i.toString()+j.toString();
				if (!contains(hodene,hod)){
					if (hodene.length%6 == 0 && hodene.length != 0){
						document.getElementById("vsetky_pripady").innerHTML += "<br>";
					}
					hodene.push(hod);
					document.getElementById("vsetky_pripady").innerHTML += " ( "+i.toString()+" , "+j.toString()+" )";
					if ((i+j) == 9){
						document.getElementById("priaznive_pripady").innerHTML += "( "+i.toString()+" , "+j.toString()+" ) ";
					}
				}
			}
		}
		document.getElementById("page6_1").style.display = "inline";
	},2000);
	
}

function tosite4(){
	document.getElementById("site3").style.display = "none";
	document.getElementById("site4").style.display = "inline";
	trezor();
}

function trezor(){
    var comboArray = [0, 0, 0, 0];
	
	var gridIncrement = $( ".lock-dial ul" ).css('line-height').replace('px', '')/2;
	var numNums = $( ".lock-dial:eq(0) ul li" ).length;
	var halfHeight = gridIncrement*numNums;
	var initTop = -(halfHeight-gridIncrement);
	
	$( ".lock-dial ul" ).css('top', initTop);
	
	$( ".lock-dial ul" ).draggable({
		grid: [ 0, gridIncrement ],
		axis: 'y',
		drag: function(){
			var dragDir = $(this).css('top').replace('px', '') < initTop ? "up" : "down";
			
			if(dragDir == "up"){
				var curNum = parseInt($(this).find('li:last-child').text()) + 1;
				if(curNum < 10){
					$(this).append('<li>'+curNum+'</li>');
				}else{
					$(this).append('<li>0</li>');
				};
			}else{
				var curNum = parseInt($(this).find('li:first-child').text()) - 1;
				var thisTop = parseInt($(this).css('margin-top').replace('px', ''));
				
				$(this).css({
					marginTop: thisTop-(gridIncrement*2)
				});
				
				if(curNum > -1){
					$(this).prepend('<li>'+curNum+'</li>');
				}else{
					$(this).prepend('<li>9</li>');
				};
			};
		},
		stop: function(){
		
			//MATHS		
			var negOrPos = $(this).css('margin-top').replace('px', '') > 0 ? 1 : -1;
			var thisTopTotal = parseInt($(this).css('top').replace('px', '')) + Math.abs(initTop);
			var marginMinified = parseInt(Math.abs($(this).css('margin-top').replace('px', ''))) - thisTopTotal;
			var numIncs = Math.floor(marginMinified/(halfHeight*2));
			var totalDif = numIncs*(halfHeight*2);
			var topTen = (marginMinified - totalDif)*negOrPos;
			var activeIndex = Math.abs(topTen/(gridIncrement*2)) + (halfHeight/(gridIncrement*2));
			
			$(this).attr("data-combo-num", $(this).find('li').eq(activeIndex).text()).css({
				top: -315,
				marginTop: topTen
			}).find('li').slice(20).remove();
			
			for(var i=0; i<$( ".lock-dial ul" ).length; i++){
				comboArray[i] = $( ".lock-dial ul:eq("+i+")" ).attr("data-combo-num");
			}
			
			
			if(comboArray[0]!=comboArray[1] && comboArray[0]!=comboArray[2] && comboArray[0]!=comboArray[3] && comboArray[1]!=comboArray[2] && comboArray[1]!=comboArray[3] && comboArray[2]!=comboArray[3]){
				document.getElementById("lock-plate").style.background = "green";
			} else {
				document.getElementById("lock-plate").style.background = "#ccc";
				document.getElementById("lock-plate").style.background = "-webkit-linear-gradient(top, #eee 0%,#949ba0 100%)";
				document.getElementById("lock-plate").style.background = "linear-gradient(to bottom, #eee 0%,#949ba0 100%)";
			}
		}
	});
}

function change_page(i){
	document.getElementById("page"+(i).toString()).style.display = "none";
	document.getElementById("page"+(i+1).toString()).style.display = "inline";
}
function change_page_back(i){
	document.getElementById("page"+(i).toString()).style.display = "none";
	document.getElementById("page"+(i-1).toString()).style.display = "inline";
}
function change_subpage(p1,p2){
 	document.getElementById(p1).style.display = "none";
	document.getElementById(p2).style.display = "inline";
}

function page3_vyber(num){
 	if (num == 2){
 		document.getElementById("odpoved2").style.border = "2px solid red";
 	}
 	else if (num == 3){
 		document.getElementById("odpoved3").style.border = "2px solid red";
 	}
 	else if (num == 1){
 		document.getElementById("page3_2").style.display = "none";
		document.getElementById("page3_3").style.display = "inline";
 	}
}

function page5_vyber(num){
 	if (num == 1){
 		document.getElementById("odpoved11").style.border = "2px solid red";
 	}
 	else if (num == 3){
 		document.getElementById("odpoved33").style.border = "2px solid red";
 	}
 	else if (num == 2){
 		document.getElementById("page5_1").style.display = "none";
		document.getElementById("page5_2").style.display = "inline";
 	}
}

var dragged_udalost = null;
function drag_udalost(u){
	dragged_udalost = u;
}
function pridaj_udalost(div){
	if (!dragged_udalost){return;}
	document.getElementById(div).innerHTML = document.getElementById(dragged_udalost).innerHTML;
	dragged_udalost = null;
	if (document.getElementById("podudalost1").innerHTML=="A<sub>0</sub>: padne práve jedna šesťka" && document.getElementById("podudalost2").innerHTML=="A<sub>2</sub>: nepadne žiadna šesťka"){
		document.getElementById("page12_1").style.display = "none";
		document.getElementById("page12_2").style.display = "inline";
		document.getElementById("page12_vysledok_div").style.display = "inline";
		document.getElementById("page12_vysledok_font").style.display = "inline";
		document.getElementById("page12_text").innerHTML = "Presne tak, čiže: &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<font size='5'>A = A<sub>0</sub> &cup; A<sub>2</sub> a A<sub>0</sub> &cap; A<sub>2</sub> = 0</font><br><p><strong>P(A) = P(A<sub>0</sub>) + P(A<sub>2</sub>)</strong>";
		document.getElementById("page12_vysledok").innerHTML = "P(A) = P(A<sub>0</sub>) + P(A<sub>2</sub>) = <sup>5<sup>3</sup></sup>&frasl;<sub>6<sub>3</sub></sub> + <sup>3 * 5<sup>2</sup></sup>&frasl;<sub>6<sub>3</sub></sub>";
	} else if(document.getElementById("podudalost1").innerHTML=="A<sub>2</sub>: nepadne žiadna šesťka" && document.getElementById("podudalost2").innerHTML=="A<sub>0</sub>: padne práve jedna šesťka"){
		document.getElementById("page12_1").style.display = "none";
		document.getElementById("page12_2").style.display = "inline";
		document.getElementById("page12_vysledok_div").style.display = "inline";
		document.getElementById("page12_vysledok_font").style.display = "inline";
		document.getElementById("page12_text").innerHTML = "Presne tak, čiže: &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<font size='5'>A = A<sub>2</sub> &cup; A<sub>0</sub> a A<sub>2</sub> &cap; A<sub>0</sub> = 0</font><br><p><strong>P(A) = P(A<sub>2</sub>) + P(A<sub>0</sub>)</strong>";
		document.getElementById("page12_vysledok").innerHTML = "P(A) = P(A<sub>2</sub>) + P(A<sub>0</sub>) =  <sup>3 * 5<sup>2</sup></sup>&frasl;<sub>6<sub>3</sub></sub> + <sup>5<sup>3</sup></sup>&frasl;<sub>6<sub>3</sub></sub>";
	}
}

function vyber1_change(){
	var e = document.getElementById("page4_vyber1");
	var num = e.options[e.selectedIndex].value;
	if (num == "12"){
		document.getElementById("cestujuci1").value = num;
		document.getElementById("page4_1").style.display = "none";
		document.getElementById("page4_2").style.display = "inline";
	}
}
function vyber2_change(){
	var e = document.getElementById("page4_vyber2");
	var num = e.options[e.selectedIndex].value;
	if (num == "11"){
		document.getElementById("cestujuci2").value = num;
		document.getElementById("page4_2").style.display = "none";
		document.getElementById("page4_3").style.display = "inline";
	}
}
function vyber3_change(){
	var e = document.getElementById("page4_vyber3");
	var num = e.options[e.selectedIndex].value;
	if (num == "10"){
		document.getElementById("cestujuci3").value = num;
		document.getElementById("page4_3").style.display = "none";
		document.getElementById("page4_4").style.display = "inline";
	}
}
function page4_skontroluj(){
	if (document.getElementById("cestujuci4").value == "9" && document.getElementById("cestujuci5").value == "8" && document.getElementById("cestujuci6").value == "7" && document.getElementById("cestujuci7").value == "6"){
		document.getElementById("page4_4").style.display = "none";
		document.getElementById("page4_5").style.display = "inline";
		document.getElementById("cestujuci4").readOnly = "readonly";
		document.getElementById("cestujuci5").readOnly = "readonly";
		document.getElementById("cestujuci6").readOnly = "readonly";
		document.getElementById("cestujuci7").readOnly = "readonly";
	}
}

function dragStart(event){
	event.dataTransfer.setData("Text", event.target.id);
}