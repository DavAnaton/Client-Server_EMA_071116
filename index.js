var express = require('express'),
	app = express(),
	server = app.listen(8081);

app.use(express.static('static'));

app.get('/', function(req, res){
	res.render('index.ejs', {taille: 8});
})


var io = require('socket.io').listen(server);

var Partie = require('./models/Partie.js'),
	Joueur = require('./models/Joueur.js');

var partie = new Partie();

io.on('connection', function (socket) {
	socket.joueur = new Joueur();
	socket.joueur.setPlateau(8);
		// partie.ajoutJoueur(socket.joueur)
		// partie.startPlacement();
		// socket.emit('attente_placement', {index: 0, bateau: partie.bateaux[0], plateau: socket.joueur.plateau});

	socket.on('nouveau_joueur', function(data){
		socket.joueur.setNom(data.nom);
		partie.ajoutJoueur(socket.joueur);
		if(partie.getEtat()=="attente_placement"){
			partie.startPlacement();
			socket.emit('attente_placement', {index: 0, bateau: partie.bateaux[0], plateau: socket.joueur.plateau});
			socket.broadcast.emit('attente_placement', {index: 0, bateau: partie.bateaux[0], plateau: socket.joueur.plateau});
		}else{
			socket.emit("attente_joueur");
		}
	})

	socket.on('bateau_en_place', function(data){
		var emplacement_libre = partie.placerBateau(socket.joueur, partie.bateaux[data.index], data.position);
		if(!emplacement_libre){
			socket.emit('attente_placement', {index: data.index, bateau: partie.bateaux[data.index], plateau: socket.joueur.plateau, error: "Emplacement Occupé"});
		}else if(data.index + 1 < partie.bateaux.length){
			socket.emit('attente_placement', {index: data.index + 1, bateau: partie.bateaux[data.index + 1], plateau: socket.joueur.plateau});
		}else{
			if(partie.getEtat()=="jeu"){
				socket.emit('fin_placement', {plateau: socket.joueur.plateau, plateau_adv: socket.joueur.plateau_adv});
				socket.emit('attente_coup_adv');
				socket.broadcast.emit('attente_coup');
			}else{
				socket.emit('fin_placement', {plateau: socket.joueur.plateau, plateau_adv: socket.joueur.plateau_adv});
			}
		}
	})

	socket.on('coup', function (data) {
		var resultat = partie.jouerCoup(socket.joueur, data);
		socket.emit('retour_coup', resultat);
		socket.emit('attente_coup');
		socket.broadcast.emit('coup_adv', resultat);
	});
});
