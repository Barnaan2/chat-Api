const express = require("express");
const app = express();
const cors = require("cors");
const connectDB = require("./Config/DB");
const mongoose = require("mongoose");
const mongoSanitize = require("express-mongo-sanitize");
const rateLimit = require("express-rate-limit");
const globalErrorHandler = require("./ErrorHandler/errorController");
const AppError = require("./ErrorHandler/appError");

// !  ADDING THE SOCKET SERVER .
const server = require("http").createServer(app);
const {initializeSocket} = require("./Socket/socketInitializer");


const PORT = process.env.PORT || 3000;
require("dotenv").config();
app.use(cors());
connectDB();

// mongoose.set("strictQuery", true);

app.use(express.json());
app.use(express.json({extended: false}));
app.use(express.json({limit: "50kb"}));
app.use(mongoSanitize());

/*
General error handling for syncronus code.

! REMEMBER: it should be set in the beginning.

*/
process.on("uncaughtException", (err) => {
	console.log(err);
	console.log("Uncaught Exception");
	console.log("SHUTTING DOWN");
	process.exit(1);
});

const {swaggerUi, specs} = require('./swagger');
// ? DOCUMENTATIONS FOR THE WHOLE API.
app.use('/api/v1/docs', swaggerUi.serve, swaggerUi.setup(specs));

// ?  GENERAL ROUTE ENDPOINTS.
app.use("/api/v1/user", require("./General/Routers/userRoute"));
app.use("/api/v1/admin", require("./General/Routers/adminRoute"));
app.use("/api/v1/setting", require("./General/Routers/settingRoute"));


// ? CHAT MODULE ENDPOINTS
app.use("/api/v1/chat", require("./Chat/Routers/chatRoute"));


// For showing the client 404 not found when searched for invalid  url.
// app.all("/", (req, res, next) => {
// res.status(200).json({"message": "please check the documentation", "data": "api/1/docs/"})
// });
app.all("*", (req, res, next) => {
	next(new AppError(`can't find ${
		req.originalUrl
	} on our server`, 404));
});

// Global error handler for handling errors globally.
app.use(globalErrorHandler);
app.listen(PORT, () => {
	console.log("app is listenning");
});

// STARTING THE SOCKET SERVER.
// THIS IS SOCKET SERVER AND HAS NOTHING TO DO WITH THE HTTP SERVER .
const SocketIo = initializeSocket(server);
server.listen(5000, () => {
	console.log("the socket is up on port 5000 :)");
	// here i can send this socket Io to the
});
// SOCKET ROUTES.
const {connection} = require('./Socket/connection');
SocketIo.on("connection", connection);


// The error handler for all asynchronous codes.
process.on("unhandledRejection", (err) => {
	console.log(err.name, err.message),
	console.log("Unhandled error happened and shutting down ....");
	process.exit(1);
});
