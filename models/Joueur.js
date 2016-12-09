var Plateau = require('./Plateau.js');
var Bateau = require('./Bateau.js');

var Joueur = function(){
	this.nom = "Unknown";
	this.plateau = null; // Plateau contenant les bateaux du joueur
	this.plateau_adv = null; // Plateau contenant l'historique des coups

	this.setNom = function(nom){
		this.nom = nom;
	}

	this.setPlateau = function(taille){
		this.plateau = new Plateau(taille);
		this.plateau_adv = new Plateau(taille);
	}

	// Vérification de l'emplacement bateau
	// enregistrement de la position 
	this.placerBateau = function(forme, position){
		var bateau = new Bateau(forme);
		bateau.position = position;
		return this.plateau.placerBateau(bateau);
	}

	// Déterminitation du résultat du coup adverse
	// Enregistrement des modifications
	this.verifierCoup = function(coup){
		return this.plateau.verifierCoup(coup);
	}

	// Enregistrement du résultat du coup envoyé 
	this.noterCoup = function(resultat){
		this.plateau_adv.damier[resultat.ligne][resultat.colonne].etat = resultat.etat;
		if(resultat.etat == "coule"){ // Si on a coulé un bateau...
			for (var i = 0; i < resultat.coulees.length; i++) { // ...On parcourt l'ensemble des positions du bateau coulé (envoyées par l'adversaire)
				this.plateau_adv.damier[resultat.coulees[i].ligne][resultat.coulees[i].colonne].etat = resultat.etat;
			}
		}
	}
}

module.exports = Joueur;