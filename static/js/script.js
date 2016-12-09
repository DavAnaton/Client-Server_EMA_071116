var socket = io.connect('http://localhost:8081');

/////////////////////////////////////////
/////////////////////////////////////////
//////////Choix de nom///////////////////
/////////////////////////////////////////
/////////////////////////////////////////

// Fonction executée quand le visiteur envoie son nom
$('#formulaire_connexion').submit(function(){
	socket.emit('nouveau_joueur', {nom:$('#nom_joueur').val()});
	return false; // Empèche le changement de page
})

/////////////////////////////////////////
/////////////////////////////////////////
///////////WebSockets////////////////////
/////////////////////////////////////////
/////////////////////////////////////////

// Lancé lorsque le serveur dit que l'on attend un autre joueur
socket.on("attente_joueur", function(){
	$('#formulaire_connexion').slideUp();
	$('#wrapper').html("Attente d'un nouveau joueur");
})

// Demande de placement de bateau
socket.on("attente_placement", function(data){
	if(data.error){ // Si les données contiennent un erreur (bateau mal placé précédemment) on l'affiche
		alert(data.error)
	}
	$('#wrapper').html(creerDamierDisplay(data.plateau)); // Actualiser le plateau
	
	bateau = data.bateau;
	bateau.position = {x: 0, y: 0, theta: 0}; // Création d'un objet position
	
	$('#wrapper').html($('#wrapper').html() + creerBateauDisplay(bateau)); // Ajout de ce bateau dans le HTML

	$('body').bind('keyup', function(event){ // Ecoute des évenements clavier
		switch(event.keyCode){
			case 38: // "ArrowUp"
				bateau.position.y--;
				$('#bateau').css('top', bateau.position.y * 22.7 + 'px');
				break;
			case 40: // "ArrowDown"
				bateau.position.y++;
				$('#bateau').css('top', bateau.position.y * 22.7 + 'px');
				break;
			case 37: // "ArrowLeft"
				bateau.position.x--;
				$('#bateau').css('left', bateau.position.x * 22.7 + 'px');
				break;
			case 39: // "ArrowRight"
				bateau.position.x++;
				$('#bateau').css('left', bateau.position.x * 22.7 + 'px');
				break;
			case 32: // " " / Space
				bateau.position.theta = (bateau.position.theta + 1) % 4;
				$('#bateau').css({ '-moz-transform': 'rotate(' + bateau.position.theta * 90 + 'deg)',  'WebkitTransform': 'rotate(' + bateau.position.theta * 90 + 'deg)'});
				break;
			case 13: // Enter
				socket.emit("bateau_en_place", {index: data.index, position: bateau.position});
				$('body').unbind('keyup');
				break;
		}
	})

})

// Fin de placement de tous les bateaux
socket.on("fin_placement", function(data){
	$('#wrapper').html(creerDamierAdverse(data.plateau)); // Ajout de plateau adver
	$('#wrapper').html($('#wrapper').html() + creerDamierDisplay(data.plateau)); // Ajout du plateau personnel
	
	$('#wrapper').html($('#wrapper').html() + "<p id='output'>Attente adversaire</p>"); // Attente de fin de placement adverse
})


socket.on("attente_coup_adv", function(){
	$('#output').html('Attente du coup de l\'adversaire');
});

// Le serveur attend notre coup
socket.on('attente_coup', function(){
	enableClick(); // Le plateau adverse devient cliquable
})

// Le serveur répond pour nous faire savoir si le coup était bon
socket.on('retour_coup', function(data){
	switch(data.etat){
		case "touche":
			enableClick(); // On rejoue
			// pas de break ici, ON EXÉCUTE ÉGALEMENT LE CAS SUIVANT!!
		case "rate": // 
			$('#damier_adv td[data-line="' + data.ligne + '"][data-column="' + data.colonne + '"]').addClass(data.etat)
			break;
		case "coule":
			enableClick(); // On rejoue
			for (var i = 0; i < data.coulees.length; i++) {
				$('#damier_adv td[data-line="' + data.coulees[i].ligne + '"][data-column="' + data.coulees[i].colonne + '"]').addClass(data.etat).html('X');
			}
			break;
		case "gagne":
			alert("Vous avez gagné"); // Fin de partie
			// TODO: coder ici pour rejouer une partie
	}

})

// On recoit le coupe de l'adversaire
socket.on('coup_adv', function(data){
	switch(data.etat){
		case "rate":
			enableClick(); // A notre tour de jouer
		case "touche":
			$('#damier td[data-line="' + data.ligne + '"][data-column="' + data.colonne + '"]').addClass(data.etat)
			break;
		case "coule":
			for (var i = 0; i < data.coulees.length; i++) {
				$('#damier td[data-line="' + data.coulees[i].ligne + '"][data-column="' + data.coulees[i].colonne + '"]').addClass(data.etat).html('X');
			}
			break;
		case "gagne":
			alert("Vous avez perdu"); // fin de la partie
			// TODO: coder ici pour rejouer une partie
	}
})

/////////////////////////////////////////
/////////////////////////////////////////
//////////Génération de code HTML////////
/////////////////////////////////////////
/////////////////////////////////////////

// Prend la forme de bateau envoyée par le serveur et génère le code HTML permettant de l'afficher.
function creerBateauDisplay(bateau){
	var bateauDisplay = "<table id='bateau'>";
	for(var i = 0; i < bateau.length; i++){
		var ligne = bateau[i];
		bateauDisplay += "<tr>";
		for(var j = 0; j < ligne.length; j++){
			bateauDisplay += "<td" + (ligne[j]? " class='fill'" : "") + "></td>";				
		}
		bateauDisplay += "</tr>";
	}
	bateauDisplay += "</table>";
	return bateauDisplay;
}

// Génère le code HTML pour afficher le plateau du joueur, avec ses bateaux
function creerDamierDisplay(plateau){
	var damierDisplay = "<div id='damier'><table>";
	for(var i = 0; i < plateau.damier.length; i++){
		var ligne = plateau.damier[i];
		damierDisplay += "<tr>";
		for(var j = 0; j < ligne.length; j++){
			damierDisplay += "<td data-line=" + i + " data-column=" + j + (ligne[j].refBateau!=null ? " class='bateau" + ligne[j].refBateau + "'" : "") + "></td>";				
		}
		damierDisplay += "</tr>";
	}
	damierDisplay += "</table></div>";
	return damierDisplay;

}

// Génère le code HTML pour afficher le plateau de l'adversaire
function creerDamierAdverse(plateau){
	var damierDisplay = "<div id='damier_adv'><table>";
	for(var i = 0; i < plateau.damier.length; i++){
		var ligne = plateau.damier[i];
		damierDisplay += "<tr>";
		for(var j = 0; j < ligne.length; j++){
			damierDisplay += "<td data-line=" + i + " data-column=" + j + "></td>";				
		}
		damierDisplay += "</tr>";
	}
	damierDisplay += "</table></div>";
	return damierDisplay;

}

// Active le clic sur le plateau adverse
function enableClick(){
	$('#damier_adv').addClass('your_turn'); // Effet de survol des cases
	$('#damier_adv td').bind('click', function(){ // Ecoute des evenements "click"
		$('#damier_adv').removeClass('your_turn')
		console.log($(this).attr('data-line'), $(this).attr('data-column'));
		socket.emit('coup', {ligne: $(this).attr('data-line'), colonne: $(this).attr('data-column')})
		$('#damier_adv td').unbind('click'); // Suppression de l'écoute d'évenement pour éviter un envoi multiple de coups
	})
}
