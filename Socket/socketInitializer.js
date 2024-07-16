const socketIo = require("socket.io");
let io;
const initializeSocket = (server) => {
	io = socketIo(server, {
		cors: {
			origin: "*"
		}
	});
	return io;
}

module.exports = {
	initializeSocket
};
