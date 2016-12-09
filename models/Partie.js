var Partie = function(){
	this.taillePlateau = 8;

	this.joueurs = [];
	this.etat = {partie: "attente_joueur", joueur1: "attente", joueur2: "attente"}; // Définition de l'état de la partie
	this.getEtat = function(){
		return this.etat.partie
	}

	// Ajout des joueurs et modification de l'état en conséquence
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

	// Initialisation des bateaux à placer
	// ******ATTENTION******
	// Utiliser uniquement des masques de bateaux carrés
	this.startPlacement = function(){
		this.bateaux.push([[1, 1, 1],
		 				   [0, 1, 0],
		 				   [0, 1, 0]]);

		this.bateaux.push([[1, 1],
		 				   [1, 1]]);

		this.bateaux.push([[0, 1],
		  				   [1, 1]]);
	}

	// Vérification de l'emplacement bateau
	// enregistrement de la position 
	// et modification de l'état de la partie
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

	// Vérification de la validité du coup (le coup vient du bon joueur)
	// Déterminitation du résultat du coup
	// Enregistrement des modifications
	// Mise à jour de l'état de la partie
	this.jouerCoup = function(joueur, coup){
		var attaquant = this.joueurs.indexOf(joueur);
		var defendant = (attaquant + 1) % 2;

		// Cas ou les deux joueurs viennent de finir de placer les bateaux
		if(this.etat.joueur1 == "attente" && this.etat.joueur2 == "attente"){
			// Celui qui avait fini en premier a reçu un signal lui permettant d'envoyer son coup
			// On déclare qu'il est le premier à jouer ici
			if(attaquant == 0){
				this.etat.joueur1 = "coup";
			}else{
				this.etat.joueur2 = "coup";
			}
		}

		// Si le coup est bien légitime (le coup vient du bon joueur)
		if((this.etat.joueur1 == "coup" && attaquant == 0) || (this.etat.joueur2 == "coup" && attaquant == 1)){

			var resultat = this.joueurs[defendant].verifierCoup(coup);
			this.joueurs[attaquant].noterCoup(resultat); // Prendre en compte le résultat coté client
			if(resultat.etat == "rate"){
				if(attaquant == 0){
					this.etat.joueur1 = "attente";
					this.etat.joueur2 = "coup";
				}else{
					this.etat.joueur1 = "coup";
					this.etat.joueur2 = "attente";
				}
			}

			return resultat;
		}else{
			return false; // Le joueur défendant a voulu tricher et envoyer un coup pas à son tour. On ignore ce coup.
		}

	}

}

module.exports = Partie;