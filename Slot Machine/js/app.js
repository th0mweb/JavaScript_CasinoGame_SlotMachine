//**********************************************************************************************
//                                        SLOT MACHINE
//
// Author(s): Florian GUIZELIN, Thomas WEBER
// Version 1.0
// Copyright © - Omega Team - 2018
// Creation date: 16 February 2018
// Contact: weberthomas34@gmail.com, florian.guizelin@gmail.com
// Last modification date: March 19, 2018
// Subject: Game of Casino with JavaScript
//**********************************************************************************************

/* Gain
- 4 Identiques: 500
- 4 Pair: 300
- 3 Identiques: 200
*/

//Tableau contenant l'url des images.
tab_v = [];
pseudo = "";
score = 0;
nb_co = 15;
rolling = 0;
tab_i = ["images/Cartes/0.png","images/Cartes/1.png","images/Cartes/2.png","images/Cartes/3.png"];

/*
Vérifie si les 4 images sont les mêmes et 
Retourne Echec ou Gagnant
*/
function check() {
	if(allValuesSame()) {
		return true;
	} else if(pair()) {
		return true;
	} else if(threeSameValues()) {
		return true;
	} else {
		if(a_miser == 2){
			score -= 200;
		}
		else if(a_miser == 3){
			score -= 400;
		} 
		return false;
	}
}

/*
Fonctions de tests sur les tableaux
*/
//Test si les 4 cartes sont identiques
function allValuesSame() {
	for(var i=1; i<tab_v.length;i++) {
		if(tab_v[i]!==tab_v[0]) {
			return false;
		}
	}
	score+=500*a_miser;
	return true;
}

// Test si les cartes ont 2 pairs (le tableau est trié)
function pair() {
	var tab = tab_v.sort();
	if (tab[0] == tab[1] && tab[2] == tab[3]) {
		score+=300*a_miser;
		return true;
	}
}

// Test si trois cartes identiques (le tableau est trié)
function threeSameValues() {
	var tab = tab_v.sort();
	if (tab[0] == tab[1] && tab[0] == tab[2]) {
		score+=200*a_miser;
		return true;
	} 
	if (tab[1] == tab[2] && tab[1] == tab[3]) {
		score+=200*a_miser;
		return true;
	}
}

/*
Récupère la mise fixé qui est de base à x1
Démarre le defilement des images
*/
function start() {
	nb_co--;
	rolling = 1;
	document.getElementById('SpinWheel').play();
	document.getElementById('buttonstart').hidden = true;
	document.getElementById('buttonstop').hidden = false;
	mise();
	defilement();
	
}

function playagain() {
	score = 0;
	rolling = 0;
	nb_co = 15;
	document.getElementById('SpinWheel').pause();
	affInformation("Aucun");
	document.getElementById('buttonstart').hidden = false;
	document.getElementById('buttonagain').hidden = true;
}

/*
Stop le défilement et
Fais appel a match()
*/
function stop() {
	rolling = 0;
	if (nb_co == 0) {
		affichage();
		document.getElementById('SpinWheel').pause();
		document.getElementById('Jackpot').play();

		document.getElementById('aff').innerHTML += "********** " + "<em>Fin de la partie</em>" + " **********";
		document.getElementById('buttonstop').hidden = true;
		document.getElementById('buttonagain').hidden = false;
		classementsInsert(pseudo, score);
		
		var msgFin ="Fin de la partie !\n";
		msgFin += "Vous terminé avec " + score + " points.";
		setTimeout(function(){ alert(msgFin); },2000);

	} else {
		setTimeout( afficheCards, 300);
		setTimeout( affichage, 350);
		document.getElementById('SpinWheel').pause();
		document.getElementById('buttonstart').hidden = false;
		document.getElementById('buttonstop').hidden = true;
	}
	
}

/*
Fonction d'attribution de la mise en fonction du bouton radio coché
*/
function mise() {
	if (document.getElementById('option1').checked) {
 		a_miser = parseInt(document.getElementById('option1').value);
	}
	else if (document.getElementById('option2').checked) {
 		a_miser = parseInt(document.getElementById('option2').value);
	}
	else{
		a_miser = parseInt(document.getElementById('option3').value);
	}
	return a_miser;
}

/*
Fonction permettant d'attribuer une valeur a "Gagné" 
ou "Perdu" en focntion du tirage qui a eu lieu
*/
function affichage() {	
	var a = "";
	if (check()) {
		var a="Gagné";
		document.getElementById('CoinWin').play();
	} else {
		var a="Perdu";
	}
	affInformation(a);
}

/*
Fonction qui affiche les informations de la partie en cours
centralisé dans une seule variable, récupère l'attribution de la fonction au dessus
*/
function affInformation(a) {
	document.getElementById('aff').innerHTML = "";
	var aff = "<p><b>Score : </b>"+score+"</p>";
	aff += "<p><b>Nombre de coups restants : </b>"+nb_co+"</p>";
	aff += "<p><b>Pseudo : </b>"+pseudo+"</p>";
	aff += "<p><b>Dernier coup joué : </b>"+a+"</p>";
	document.getElementById('aff').innerHTML = aff;
}

/*
Fonction d'affichge aléatoirement des images
*/
function afficheCards() {
	for(var i=0; i<4;i++) {
		tab_v[i]=getRandom();
	}
	document.getElementById('slot1').src = tab_i[tab_v[0]];
	document.getElementById('slot2').src = tab_i[tab_v[1]];
	document.getElementById('slot3').src = tab_i[tab_v[2]];
	document.getElementById('slot4').src = tab_i[tab_v[3]];
}

/*
Fonction de défilement, qui affiche aléatoirement des images très rapidement
*/
function defilement() {
	var tab = [];
	for(var i=0; i<4;i++) {
		tab[i]=getRandom();
	}
	document.getElementById('slot1').src = tab_i[tab[0]];
	document.getElementById('slot2').src = tab_i[tab[1]];
	document.getElementById('slot3').src = tab_i[tab[2]];
	document.getElementById('slot4').src = tab_i[tab[3]];
	// En appyant sur Start => rooling true sur Stop => rolling false
	if(rolling == true){
        setTimeout(defilement, 100);
    }
}

/*
Première fonction éxécuté qui masque l'affichage graphique concernant la machine à sous
*/
function load() {
	document.getElementById('game_cards').hidden = true;
	document.getElementById('game_content').hidden = true;
	document.getElementById('game_info').hidden = true;
	mise();
}

/*
Première fonction éxécuté qui masque l'affichage graphique concernant la machine à sous
*/
function choosePseudo() {
	// Empeche qu'un pseudo soit vide
	pseudo = document.getElementById('pseudo').value;
	if (pseudo == "" || pseudo == " ") {
		alert("Le pseudo ne peut pas être vide !");
	} else {
		document.getElementById('pseudo_input').hidden = true;
		afficheCards();
		affInformation("Aucun");
		document.getElementById('game_cards').hidden = false;
		document.getElementById('game_content').hidden = false;
		document.getElementById('game_info').hidden = false;
	}
}

function getRandom() {
	return Math.floor(Math.random() * 4);
}