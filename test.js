var i = 0;
while(true){
	var message = "Downloading " + Math.round(i/2000*100)/100 + "%";
	process.stdout.write(message);
	var j = 0;
	while(j<message.length){
		process.stdout.write("\b");
		j++;
	}
	i++;
}