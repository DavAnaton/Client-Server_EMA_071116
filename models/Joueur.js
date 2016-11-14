var Plateau = require('./Plateau.js');
var Bateau = require('./Bateau.js');

var Joueur = function(){
	this.nom = "Unknown";
	this.plateau = null;
	this.plateau_adv = null;
	this.equipe = null; // Joueur 1 ou 2

	this.setNom = function(nom){
		this.nom = nom;
	}

	this.setPlateau = function(taille){
		this.plateau = new Plateau(taille);
		this.plateau_adv = new Plateau(taille);
	}

	this.placerBateau = function(forme, position){
		var bateau = new Bateau(forme);
		bateau.position = position;
		return this.plateau.placerBateau(bateau);
	}
}

module.exports = Joueur;