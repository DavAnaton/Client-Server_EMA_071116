var Partie = function(){
	this.taillePlateau = 8;

	this.joueurs = [];
	this.etat = {partie: "attente_joueur", joueur1: "attente", joueur2: "attente"}
	this.getEtat = function(){
		return this.etat.partie
	}

	this.ajoutJoueur = function(joueur){
		if(this.joueurs.length == 0){
			joueur.equipe = 1;
			this.joueurs.push(joueur);
			this.etat.joueur1 = "pret";
		}else if(this.joueurs.length == 1){
			joueur.equipe = 2;
			this.joueurs.push(joueur);
			this.etat.joueur2 = "pret";
			this.etat.partie = "attente_placement";
		}else{
			return false;
		}
	}

	this.setTaille = function(nouvelleTaille){
		this.taillePlateau = nouvelleTaille;
	}

	this.bateaux = [];

	this.startPlacement = function(){
		this.bateaux = [];
		this.bateaux.push([[1, 1, 1],
		 				   [0, 1, 0],
		 				   [0, 1, 0]]);

		this.bateaux.push([[1, 1],
		 				   [1, 1]]);

		this.bateaux.push([[0, 1],
		  				   [1, 1]]);
	}

	this.placerBateau = function(joueur, bateau, position){
		var emplacement_libre =joueur.placerBateau(bateau, position);

		if(joueur.plateau.bateaux.length == this.bateaux.length){
			if(joueur.equipe == 1){
				this.etat.joueur1 = "attente";
			}else{
				this.etat.joueur2 = "attente";
			}
		}
		if(this.etat.joueur1 == "attente" && this.etat.joueur2 == "attente"){
			this.etat.partie = "jeu";
		}

		return emplacement_libre;

	}

	this.start = function(){

	}

}

module.exports = Partie;