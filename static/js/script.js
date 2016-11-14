var socket = io.connect('http://localhost:8081');

$('#formulaire_connexion').submit(function(){
	socket.emit('nouveau_joueur', {nom:$('#nom_joueur').val()});
	return false; // Empèche le changement de page
})

socket.on("attente_joueur", function(){
	$('#formulaire_connexion').slideUp();
	$('#wrapper').html("Attente d'un nouveau joueur");
})

socket.on("attente_placement", function(data){
	if(data.error){
		alert(data.error)
	}
	$('#wrapper').html(creerDamierDisplay(data.plateau));
	
	bateau = data.bateau;
	bateau.position = {x: 0, y: 0, theta: 0};
	
	$('#wrapper').html($('#wrapper').html() + creerBateauDisplay(bateau));

	$('body').bind('keyup', function(event){
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
			case 32: // " "
				bateau.position.theta = (bateau.position.theta + 1) % 4;
				$('#bateau').css({ '-moz-transform': 'rotate(' + bateau.position.theta * 90 + 'deg)',  'WebkitTransform': 'rotate(' + bateau.position.theta * 90 + 'deg)'});
				break;
			case 13:
				socket.emit("bateau_en_place", {index: data.index, position: bateau.position});
				$('body').unbind('keyup');
				break;
		}
	})

})

socket.on("attente_placement_adv", function(data){
	$('#wrapper').html(creerDamierAdverse(data.plateau));
	$('#wrapper').html($('#wrapper').html() + creerDamierDisplay(data.plateau));
	
	$('#wrapper').html($('#wrapper').html() + "<p>Attente adversaire</p>");
})



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