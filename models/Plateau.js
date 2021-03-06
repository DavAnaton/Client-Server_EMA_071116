var Case = require('./Case.js'),
	Bateau = require('./Bateau.js');

var Plateau = function(taille){
	this.taille = taille;

	this.damier = [];
	//Remplie le damier de cases
	for(i = 0; i < this.taille; i++){
		var ligne = [];
		for(j = 0; j < this.taille; j++){
			ligne.push(new Case(i, j));
		}
		this.damier.push(ligne);
	}

	// *************DEBUG*************
	// Affichage du damier dans la console du serveur
	this.afficherDamier = function(){
		for(i = 0; i < this.taille; i++){
			for(j = 0; j < this.taille; j++){
				var output = (this.damier[i][j].etat == 'vide' ? String.fromCharCode(1) : this.damier[i][j].refBateau); // Bateau
				process.stdout.write(output +"  "); // Séparation entre les cases
			}
			process.stdout.write("\n"); //Fin de ligne
		}
		process.stdout.write("\n"); // Fin de plateau
	}

	this.bateaux = [];

	// Vérification de l'emplacement bateau
	// enregistrement de la position 
	this.placerBateau = function(bateau){
		var casesBateau = [];

		for(var i = 0; i < bateau.taille.y; i++){
			for(var j = 0; j < bateau.taille.x; j++){
				if(bateau.forme[i][j]){
					var x, y;
					// Selon l'angle envoyé, on parcourt le bateau et le damier avec des indexs différents
					switch(bateau.position.theta){
						case 0:
							x = bateau.position.x + j;
							y = bateau.position.y + i;
							break;
						case 1:
							x = bateau.position.x + bateau.taille.y - i - 1;
							y = bateau.position.y + j;
							break;
						case 2:
							x = bateau.position.x + bateau.taille.x - j - 1;
							y = bateau.position.y + bateau.taille.y - i - 1;
							break;
						case 3:
							x = bateau.position.x + i;
							y = bateau.position.y + bateau.taille.x - j - 1;
							break;

					}
					if(this.damier[y][x].etat != "vide"){ // Le damier n'est pas vide...
						return false; // On arrête tout
					} else {
						casesBateau.push([x, y]); // On ajoute les coordonnées de la case dans le bateau
					}
				}
			}
		}
		// ********Code exécuté si toutes les cases étaient vides jusqu'à maintenant
		var indexOfBateau = this.bateaux.length;
		this.bateaux.push(bateau);
		for(var i = 0; i < casesBateau.length; i++){
			this.damier[casesBateau[i][1]][casesBateau[i][0]].etat = "bateau";
			this.damier[casesBateau[i][1]][casesBateau[i][0]].refBateau = indexOfBateau;
		}
		// // *****Debug****
		// this.afficherDamier();
		// // **************
		return true; // Placement valide
	}

	// Déterminitation du résultat du coup adverse
	// Enregistrement des modifications
	this.verifierCoup = function(coup){
		var retour = {ligne: coup.ligne, colonne: coup.colonne, etat: ""};
		var case_attaquee = this.damier[coup.ligne][coup.colonne];

		if(case_attaquee.etat == "bateau"){
			case_attaquee.etat = "touche";
			this.bateaux[case_attaquee.refBateau].restant --; // Nombre de cases restantes dans le bateau
			retour.etat = "touche";
			if(this.bateaux[case_attaquee.refBateau].restant == 0){ // Coulé
				retour.etat = "coule";
				var cases_coulees = []; // On rappelle les cases du bateau coulé
				for (var i = 0; i < this.damier.length; i++) {
					for (var j = 0; j < this.damier[i].length; j++) {
						if(this.damier[i][j].refBateau == this.damier[coup.ligne][coup.colonne].refBateau){
							this.damier[i][j].etat = "coule";
							cases_coulees.push({ligne: i, colonne: j});
						}
					}
				}
				retour.coulees = cases_coulees;

				var gagne = true;
				for (var i = 0; i < this.bateaux.length; i++) {
					if(this.bateaux[i].restant > 0){ // S'il reste des cases dans un bateau
						gagne = false; // On n'a pas gagné
					}
				}
				if(gagne){
					retour.etat = "gagne"
				}
			}
		}else if(case_attaquee.etat == "vide"){
			retour.etat = "rate";
		}
		return retour;
	}

}

module.exports = Plateau;