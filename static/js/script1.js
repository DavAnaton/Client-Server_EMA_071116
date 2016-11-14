var socket = io.connect('http://localhost:8081');

$('.case.adversaire').click(function(){
	console.log($(this).attr("data-value"));
	socket.emit('attaque', {case: $(this).attr("data-value")});
})

$('#change_nom').keyup(function(){
	socket.emit('change_nom', {nom: this.value});
})