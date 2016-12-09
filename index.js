// Imports utiles au projet
var express = require('express'),
	app = express(),
	_PORT_ = 8081, // Choix du port d'écoute du serveur
	server = app.listen(_PORT_);

var Partie = require('./models/Partie.js'),
	Joueur = require('./models/Joueur.js');

// Fichiers CSS et Javascript servis statiquement
app.use(express.static('static'));


var taillePlateau = 8; 

// Envoi de la page HTML affichant le jeu
app.get('/', function(req, res){
	res.render('index.ejs', {taille: taillePlateau}); // taille représente la taille du plateau dans la vue HTML
})


// Début de la partie websocket
var io = require('socket.io').listen(server);

// Création d'une partie
// Seul 2 joueurs peuvent se connecter, actuellemment.
// Pour une version du serveur permettant de jouer plusieurs parties en simultané, il faudrait changer partie en ArrayList[Partie] et matcher les joueurs 2 à 2
var partie = new Partie();

// Client connecté
io.on('connection', function (socket) {
	// Création du joueur associé
	socket.joueur = new Joueur();
	socket.joueur.setPlateau(8);

	// Le joueur a envoyé son nom
	socket.on('nouveau_joueur', function(data){
		socket.joueur.setNom(data.nom);
		partie.ajoutJoueur(socket.joueur); // Ajout à la partie
		if(partie.getEtat()=="attente_placement"){ // 2 joueurs présents, on attend le placement des bateaux.
			partie.startPlacement(); // Initialisation des bateaux à placer
			socket.emit('attente_placement', {index: 0, bateau: partie.bateaux[0], plateau: socket.joueur.plateau}); // Envoi au joueur qui vient de se connecter...
			socket.broadcast.emit('attente_placement', {index: 0, bateau: partie.bateaux[0], plateau: socket.joueur.plateau}); // ...Et aux autres
		}else{
			socket.emit("attente_joueur"); // Sinon, il attend le joueur d'après.
		}
	})

	// Le joueur envoie la position de son bateau
	socket.on('bateau_en_place', function(data){
		// On vérifie que la place soit libre
		var emplacement_libre = partie.placerBateau(socket.joueur, partie.bateaux[data.index], data.position);
		if(!emplacement_libre){ // Si non, on lui dit de choisir une autre place
			socket.emit('attente_placement', {index: data.index, bateau: partie.bateaux[data.index], plateau: socket.joueur.plateau, error: "Emplacement Occupé"});
		}else if(data.index + 1 < partie.bateaux.length){ // S'il n'a pas fini de placer ses bateaux
			socket.emit('attente_placement', {index: data.index + 1, bateau: partie.bateaux[data.index + 1], plateau: socket.joueur.plateau});

		}else{ // S'il a fini de tout placer...
			if(partie.getEtat()=="jeu"){ // ... Et que l'autre joueur aussi
				socket.emit('fin_placement', {plateau: socket.joueur.plateau, plateau_adv: socket.joueur.plateau_adv});
				socket.emit('attente_coup_adv');
				socket.broadcast.emit('attente_coup'); // On dit à l'adversaire de commencer
			}else{ // Sinon, on attend que l'adversaire aie fini
				socket.emit('fin_placement', {plateau: socket.joueur.plateau, plateau_adv: socket.joueur.plateau_adv});
			}
		}
	})

	// Le client envoie la case qu'il souhaite attaquer
	socket.on('coup', function (data) {
		var resultat = partie.jouerCoup(socket.joueur, data); // On vérifie s'il a touché un bateau
		socket.emit('retour_coup', resultat); // on lui dit s'il peut rejouer
		socket.broadcast.emit('coup_adv', resultat); // on dit à l'adversaire ce qu'il se passe
	});
});


// Affiche l'ip locale et le port dans l'invite de commande qui fait tourner le serveur
console.log("\n\nRunning on : ");
var interfaces = require('os').networkInterfaces();
for(var interface in interfaces){
	for(var i = 0; i<interfaces[interface].length; i++){
		if(interfaces[interface][i].family.toLowerCase() == "ipv4"){
			console.log("__________\n" + interface + ":\n" + interfaces[interface][i].address + ":" + _PORT_)
		}
	}
}
console.log("\n\n");
// Fin d'affichage