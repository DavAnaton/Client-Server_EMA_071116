var Case = function(i, j){
	this.ligne = i;
	this.colonne = j;
	this.etat = "vide"
	this.refBateau = null;

	this.toString = function(){
		return String.fromCharCode(65 + i)+(j+1); // Formate (1, 1) en "B2"
	}
}

module.exports = Case;