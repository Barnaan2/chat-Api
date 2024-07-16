exports.SendMessage = async (data, socket) => { /*
    {
    "chat":"id of the chat",
    "sender":"id of the user who is sending the message",
    "message":"hello mr Bernabas . it's me.",
    "type":"text"
    }
    
    */
	const {chat, sender, message, type} = data;
	const newMessage = data;
	// const content = await Content.create({type: type, contentMessage: message});
	// let newMessage = await Message.create({sender: sender, content: content, chat: chat});
	// newMessage = newMessage.find().populate('content')
	console.log(newMessage);
	socket.emit("newMessage", newMessage);
	// res.status(200).json({newMessage});

}
