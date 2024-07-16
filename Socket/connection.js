const {SendMessage} = require("./Controllers/sendMessageController");
exports.connection = (socket) => {
	console.log("Connection is established to the socket.", socket.id);
	socket.emit("activated", "You are live now!");
	// ! Socket Routes
	socket.on("sendMessage", async (data) => {
		SendMessage(data, socket)
	});


}
