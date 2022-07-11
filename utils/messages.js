/*
 * module for interacting with messages collection
 */

const EventEmitter = require("events");

const connect = require("./connect.js");
const models = require("./models.js");

function save_message(message_data, ee, event) {
    /*
     * function that will attempt to save a message
     * */

    /* first, register callbacks */
    const message_emitter = new EventEmitter();

    /* after connecting to db */
    message_emitter.on("connection", function(ret){
	if (ret["success"] === false) {
	    ee.emit(event, ret);
	    return;
	}
	const now = new Date();
	let message = new models.message_model({
	    from: message_data.from,
	    to: message_data.to,
	    seen: message_data.seen,
	    timestamp: now.toUTCString(),
	    message: message_data.message
	});
	/* save new message */
	message.save(function(err, result){
	    if (err){
		let ret = {
		    success: false,
		    messages: ["MongoDB error: " + err.message]
		};
		ee.emit(event, ret);
		return;
	    }
	    /* just return success */
	    let ret = {
		"success": true,
		"messages": ["success"]
	    };
	    ee.emit(event, ret);
	});
    });

    /* connect to db */
    connect.connect_to_db(message_emitter, "connection");
}

function get_messages_users(users, ee, event) {
    /*
     * function that will attempt to retrive all messages between
     * two users: users.user1, users.user2
     * order doesn't matter
     * */

    /* first, register callbacks */
    const message_emitter = new EventEmitter();

    /* after connecting to db */
    message_emitter.on("connection", function(ret){
	if (ret.success === false) {
	    ret.chat_messages = [];
	    ee.emit(event, ret);
	    return;
	}
	let filter = {
	    $or: [
		{$and: [{from: users.user1}, {to: users.user2}]},
		{$and: [{from: users.user2}, {to: users.user1}]}
	    ]
	};
	models.message_model.find(filter, function(err, result){
	    if (err){
		let ret = {
		    success: false,
		    messages: ["Error retrieving messages: " + err.message],
		    chat_messages: []
		};
		ee.emit(event, ret);
		return;
	    }
	    let chat_messages = [];
	    result.forEach(function(elem){
		chat_messages.push({
		    id: elem._id,
		    from: elem._doc.from,
		    to: elem._doc.to,
		    seen: elem._doc.seen,
		    timestamp: elem._doc.timestamp,
		    message: elem._doc.message
		});
	    });
	    let ret = {
		success: true,
		messages: ["success"],
		chat_messages: chat_messages
	    };
	    ee.emit(event, ret);
	});
    });

    /* connect to db */
    connect.connect_to_db(message_emitter, "connection");
}

function get_messages(uid, ee, event) {
    /*
     * function that will attempt to retrive all messages for uid
     * TODO the only difference between this function and get_messages_users
     * is the filter - move this to a common function that gets called by both
     * */

    /* first, register callbacks */
    const message_emitter = new EventEmitter();

    /* after connecting to db */
    message_emitter.on("connection", function(ret){
	if (ret.success === false) {
	    ret.chat_messages = [];
	    ee.emit(event, ret);
	    return;
	}
	let filter = {$or: [{from: uid}, {to: uid}]};
	models.message_model.find(filter, function(err, result){
	    if (err){
		let ret = {
		    success: false,
		    messages: ["Error retrieving messages: " + err.message],
		    chat_messages: []
		};
		ee.emit(event, ret);
		return;
	    }
	    let chat_messages = [];
	    result.forEach(function(elem){
		chat_messages.push({
		    id: elem._id,
		    from: elem._doc.from,
		    to: elem._doc.to,
		    seen: elem._doc.seen,
		    timestamp: elem._doc.timestamp,
		    message: elem._doc.message
		});
	    });
	    let ret = {
		success: true,
		messages: ["success"],
		chat_messages: chat_messages
	    };
	    ee.emit(event, ret);
	});
    });

    /* connect to db */
    connect.connect_to_db(message_emitter, "connection");
}

function mark_read(users_data, ee, event) {
    /*
     * function that will attempt to mark all messages from
     * users_data.from to users_data.to as seen/read
     * order matters
     * only returns success + messages
     * */
    const message_emitter = new EventEmitter();
    message_emitter.on("connection", function(ret){
	if (ret.success === false) {
	    ee.emit(event, ret);
	    return;
	}
	/*
	 * TODO
	 * move this to mongoose refs
	 *
	 * so apparently mongoose only updates first doc by default
	 * to update multiple docs with update() use multi: true in
	 * options
	 * */
	let filter = {from: users_data.from, to: users_data.to};
	let updated_values = {seen: true};
	let options = {multi: true};
	models.message_model.update(filter, updated_values,
				    options, (err, result) => {
	    if (err){
		let ret = {
		    success: false,
		    messages: ["Error updating messages: " + err.message]
		};
		ee.emit(event, ret);
		return;
	    }
	    let ret = {
		success: true,
		messages: ["success"]
	    };
	    ee.emit(event, ret);
	});
    });

    /* connect to db */
    connect.connect_to_db(message_emitter, "connection");
}

function remove_messages(uid, ee, event) {
    /*
     * function that will attempt to delete all messages by uid
     * */
    const message_emitter = new EventEmitter();
    message_emitter.on("connection", function(ret){
	if (ret.success === false) {
	    ee.emit(event, ret);
	    return;
	}
	let filter = {$or: [{from: uid}, {to: uid}]};
	models.message_model.remove(filter, function(err, result){
	    if (err){
		let ret = {
		    success: false,
		    messages: ["Error removing messages: " + err.message]
		};
		ee.emit(event, ret);
		return;
	    }
	    let ret = {
		success: true,
		messages: ["success"]
	    };
	    ee.emit(event, ret);
	});
    });

    /* connect to db */
    connect.connect_to_db(message_emitter, "connection");
}

module.exports.save_message = save_message;
module.exports.get_messages_users = get_messages_users;
module.exports.get_messages = get_messages;
module.exports.mark_read = mark_read;
module.exports.remove_messages = remove_messages;
