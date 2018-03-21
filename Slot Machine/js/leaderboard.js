/*Fonction Classments*/

// Affiche le classement en respectant l'ordre des scores
function afficheClassements(tab) {
	videClassements();
	for(var i=0; i < tab.length ;i++) {
		var c = '<tr>';
        c += '<td><img id="logoListe" src="images/Leaderboard/Top'+(i+1)+'.png"></td>';
        c += '<td class="mdl-data-table__cell--non-numeric">'+tab[i][1]+'</td>';
        c += '<td>'+tab[i][2]+'</td>'
        c += '<td>'+tab[i][3]+'</td>';
        c += '</tr>';
		document.getElementById('leaderboard_display').innerHTML += c;
	}
}

function videClassements(){
	document.getElementById('leaderboard_display').innerHTML = "";
}

// Fonction qui permet de push dans le tableau 
function basicClassementsResponse3(req) {
	var tab = JSON.parse(req.responseText);
	var tabClassements = [];
	for (var i=0; i<tab.length; i++) {
		tabClassements.push([tab[i].id, tab[i].Pseudo, tab[i].Score, tab[i].Nbplayed]);
	}
	return tabClassements;
}

function classementsResponse(req) {
	afficheClassements(basicClassementsResponse3(req));
}

function classementsRequest() {
	myajax("classements.php",classementsResponse);
}

function classementsResponseInsert(req) {
	console.log("Vous avez été ajouter/update !")
}

function classementsInsert(pseudo, score) {
	myajax("classements.php?pseudo="+pseudo+"&score="+score, classementsResponseInsert);
}

function myajax(url, callBack) {
	var requete = new XMLHttpRequest();
	requete.open("GET", url, true);
	requete.addEventListener("load", function () {
		callBack(requete);
	});
	requete.send(null);
}

setInterval(function() {
    classementsRequest();
}, 1000);
