/*
 * module for interacting with users collection
 */

const EventEmitter = require("events");

const connect = require("./connect.js");
const models = require("./models.js");

function delete_user(uid, ee, event) {
    /*
     * function that will remove uid
     * */
    const users_emitter = new EventEmitter();

    /* after connecting to db */
    users_emitter.on("connection", function(ret){
	if (ret["success"] === false) {
	    ee.emit(event, ret);
	    return;
	}
	let filter = {_id: uid};
	models.user_model.remove(filter, function(err, result){
	    if (err){
		let ret = {
		    success: false,
		    messages: ["Error removing user: " + err.message]
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
    connect.connect_to_db(users_emitter, "connection");
}

function unfriend(uid, friend_id, ee, event) {
    /*
     * function that will remove friend_id from uid's friends list
     * */
    if (uid == friend_id) {
	let ret = {
	    success: false,
	    messages: ["Can't unfriend self"]
	};
	ee.emit(event, ret);
	return;
    }

    /* retrive list of friends for uid, remove friend_id, update */
    const users_emitter = new EventEmitter();

    /* after connecting to db */
    users_emitter.on("connection", function(ret){
	if (ret.success === false) {
	    ee.emit(event, ret);
	    return;
	}
	models.user_model.find({_id: uid}, function(err, result){
	    if (err){
		let ret = {
		    success: false,
		    messages: ["Error retrieving user: " + err.message]
		};
		ee.emit(event, ret);
		return;
	    }
	    if (result.length < 1) {
		let ret = {
		    success: false,
		    messages: ["User not found"]
		};
		ee.emit(event, ret);
		return;
	    }
	    /* if friend_id is not in friends do nothing */
	    let friend_index = result[0].friends.indexOf(friend_id);
	    if (friend_index < 0) {
		let ret = {
		    success: true,
		    messages: ["success"]
		};
		ee.emit(event, ret);
		return;
	    }
	    let ret = {
		friends: result[0].friends,
		friend_index: friend_index
	    };
	    users_emitter.emit("old_list", ret);
	});
    });
    /* TODO maybe move this to a common function */
    users_emitter.on("old_list", function(ret){
	ret.friends.splice(ret.friend_index, 1);
	let filter = {_id: uid};
	let updated_values = {friends: ret.friends};
	models.user_model.update(filter, updated_values, function(err, result){
	    if (err){
		let ret = {
		    success: false,
		    messages: ["Error updating friends: " + err.message]
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
    connect.connect_to_db(users_emitter, "connection");
}

function add_friend(uid, friend_id, ee, event) {
    /*
     * function that will add friend_id to uid's friends list
     * */
    if (uid == friend_id) {
	let ret = {
	    success: false,
	    messages: ["Can't add self to friend list"]
	};
	ee.emit(event, ret);
	return;
    }

    /* retrive list of friends for uid, append friend_id, update */
    const users_emitter = new EventEmitter();

    /* after connecting to db */
    users_emitter.on("connection", function(ret){
	if (ret.success === false) {
	    ee.emit(event, ret);
	    return;
	}
	/*
	 * we need to get old list of friends here anyway
	 * the lists of friends we have (in aboutview.js from
	 * user_data and auth_data) can be outdated
	 *
	 * TODO maybe there's a function to find and update?
	 * */
	models.user_model.find({_id: uid}, function(err, result){
	    if (err){
		let ret = {
		    success: false,
		    messages: ["Error retrieving user: " + err.message]
		};
		ee.emit(event, ret);
		return;
	    }
	    if (result.length < 1) {
		let ret = {
		    success: false,
		    messages: ["User not found"]
		};
		ee.emit(event, ret);
		return;
	    }
	    /* if friend_id is already in friends do nothing */
	    if (result[0].friends.indexOf(friend_id) >= 0) {
		let ret = {
		    success: true,
		    messages: ["success"]
		};
		ee.emit(event, ret);
		return;
	    }
	    let ret = {
		friends: result[0].friends
	    };
	    users_emitter.emit("old_list", ret);
	});
    });
    users_emitter.on("old_list", function(ret){
	ret.friends.push(friend_id);
	let filter = {_id: uid};
	let updated_values = {friends: ret.friends};
	models.user_model.update(filter, updated_values, function(err, result){
	    if (err){
		let ret = {
		    success: false,
		    messages: ["Error updating friends: " + err.message]
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
    connect.connect_to_db(users_emitter, "connection");
}


function get_users(ee, event) {
    /*
     * function that will retrive all info for all users
     * */

    /* first, register callbacks */
    const users_emitter = new EventEmitter();

    /* after connecting to db */
    users_emitter.on("connection", function(ret){
	if (ret["success"] === false) {
	    ee.emit(event, ret);
	    return;
	}
	/* TODO do we need empty filter here? */
	models.user_model.find({}, function(err, result){
	    if (err){
		let ret = {
		    success: false,
		    messages: ["Error retrieving users: " + err.message],
		    users: []
		};
		ee.emit(event, ret);
		return;
	    }
	    /*
	     * I guess there will always be users
	     * since you need to be logged in to use this
	     * */
	    let users = [];
	    result.forEach(function(elem){
		users.push({
		    id: elem._id,
		    firstName: elem.firstName,
		    lastName: elem.lastName,
		    email: elem.email,
		    password: elem.password,
		    type: elem.type,
		    gender: elem.gender,
		    birthday: elem.birthday,
		    isGuest: elem.isGuest,
		    friends: elem.friends.map(elem => {
			return {id: elem};
		    }),
		    avatar: elem.avatar
		});
	    });
	    let ret = {
		success: true,
		messages: ["success"],
		users: users
	    };
	    ee.emit(event, ret);
	});
    });

    /* connect to db */
    connect.connect_to_db(users_emitter, "connection");
}

function update_avatar(data, ee, event) {
    /*
     * function that will update avatar for user
     *
     * data: {uid, photo_id}
     * */
    const user_emitter = new EventEmitter();

    /* when connection is done */
    user_emitter.on("connection", function(ret){
	if (ret["success"] === false) {
	    ee.emit(event, ret);
	    return;
	}
	let filter = {_id: data.uid};
	let updated_values = {
	    avatar: data.photo_id
	};
	models.user_model.update(filter, updated_values, function(err, result){
	    if (err){
		let ret = {
		    success: false,
		    messages: ["Error updating avatar: " + err.message]
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
    connect.connect_to_db(user_emitter, "connection");
}

function get_user_info(uid, ee, event, args) {
    /*
     * function that will retrive all info for user afer id
     *
     * on failure all fields/props will be undefined
     * */

    /* first, register callbacks */
    const user_emitter = new EventEmitter();

    /* after connecting to db */
    user_emitter.on("connection", function(ret){
	if (ret["success"] === false) {
	    ee.emit(event, ret);
	    return;
	}
	let filter = {_id: uid};
	models.user_model.find(filter, function(err, result){
	    if (err){
		let ret = {
		    success: false,
		    messages: ["Error retrieving user: " + err.message]
		};
		ee.emit(event, ret);
		return;
	    }
	    if (result.length < 1) {
		let ret = {
		    success: false,
		    messages: ["User not found"]
		};
		ee.emit(event, ret);
		return;
	    }
	    /*
	     * there should be some privacy concerns here
	     * for now, return everything, but whoever calls this
	     * should show/hide info based on privacy
	     * */
	    let ret = {
		success: true,
		messages: ["success"],
		uid: result[0]["_id"],
		firstName: result[0]["firstName"],
		lastName: result[0]["lastName"],
		email: result[0]["email"],
		password: result[0]["password"],
		type: result[0]["type"],
		gender: result[0]["gender"],
		birthday: result[0]["birthday"],
		isGuest: result[0]["isGuest"],
		friends: result[0]["friends"].map(elem => {
		    return {id: elem};
		}),
		avatar: result[0]["avatar"],
		args: args
	    };
	    ee.emit(event, ret);
	});
    });

    /* connect to db */
    connect.connect_to_db(user_emitter, "connection");
}

/* exports */
module.exports.get_user_info = get_user_info;
module.exports.update_avatar = update_avatar;
module.exports.get_users = get_users;
module.exports.add_friend = add_friend;
module.exports.unfriend = unfriend;
module.exports.delete_user = delete_user;
