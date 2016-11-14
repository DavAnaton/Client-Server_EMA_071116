var Bateau = function(forme){
	this.taille = {x: forme[1].length, y: forme.length};
	this.forme = forme;

	this.restant = 0;
	for(i = 0; i < this.taille.y; i++){
		for(j = 0; j < this.taille.x; j++){
			if(this.forme[i][j]){
				this.restant++;
			}
		}
	}

	this.position = {x:1, y: 1, theta: 1};


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