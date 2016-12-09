var Bateau = function(forme){
	this.taille = {x: forme[1].length, y: forme.length};
	this.forme = forme;

	this.restant = 0;
	for(i = 0; i < this.taille.y; i++){ // Compte le nombre de 1 dans le masque de forme
		for(j = 0; j < this.taille.x; j++){
			if(this.forme[i][j]){
				this.restant++;
			}
		}
	}

	// ********DEBUG*********
	// Affiche la forme du bateau dans la console du serveur
	this.afficher = function(){
		for(i = 0; i < this.taille.y; i++){
			for(j = 0; j < this.taille.x; j++){
				var output = this.forme[i][j] ? String.fromCharCode(1) : " ";
				process.stdout.write(output + "  ");
			}
			process.stdout.write("\n");
		}
		process.stdout.write("\n");
	}
}

module.exports = Bateau;