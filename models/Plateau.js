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
	this.placerBateau = function(bateau){
		var casesBateau = [];

		for(var i = 0; i < bateau.taille.y; i++){
			for(var j = 0; j < bateau.taille.x; j++){
				if(bateau.forme[i][j]){
					var x, y;
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
					if(this.damier[y][x].etat != "vide"){
						return false;
					} else {
						casesBateau.push([x, y]);
					}
				}
			}
		}

		var indexOfBateau = this.bateaux.length;
		this.bateaux.push(bateau);
		for(var i = 0; i < casesBateau.length; i++){
			this.damier[casesBateau[i][1]][casesBateau[i][0]].etat = "bateau";
			this.damier[casesBateau[i][1]][casesBateau[i][0]].refBateau = indexOfBateau;
		}
		this.afficherDamier();
		return true;
	}

}

module.exports = Plateau;