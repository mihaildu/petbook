/*
 * module for interacting with FriendRequests collection
 */

const EventEmitter = require("events");

const connect = require("./connect.js");
const models = require("./models.js");

function reject_request(post_data, ee, event) {
    /*
     * implementation for friend request rejection
     * for noe just update the friendrequest doc from db
     * to have status: "rejected"
     * */
    const friend_emitter = new EventEmitter();

    /* after connecting to db */
    friend_emitter.on("connection", function(ret){
	if (ret.success === false) {
	    ee.emit(event, ret);
	    return;
	}

	let updated_values = {status: "rejected"};
	let filter = {from: post_data.from, to: post_data.to};
	models.friend_req_model.update(filter,updated_values,(err, result) => {
	    if (err){
		let ret = {
		    success: false,
		    messages: ["Error updating friend req: " + err.message]
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
    connect.connect_to_db(friend_emitter, "connection");
}

function accept_request(post_data, ee, event) {
    /*
     * implementation of friend request acceptance
     * for now, just delete the request from db
     * users will be added to each other's friends
     * list in app.js
     * */
    const friend_emitter = new EventEmitter();

    /* after connecting to db */
    friend_emitter.on("connection", function(ret){
	if (ret.success === false) {
	    ee.emit(event, ret);
	    return;
	}
	/*
	 * no need to check for permissions, this is done is app.js
	 * the check here is that only the user that receives the
	 * request ("to" field) can accept it
	 * */
	let filter = {from: post_data.from, to: post_data.to};
	models.friend_req_model.remove(filter, function(err, result){
	    if (err){
		let ret = {
		    success: false,
		    messages: ["Error deleting friend req: " + err.message]
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
    connect.connect_to_db(friend_emitter, "connection");
}

function add_request(post_data, ee, event) {
    /*
     * function that will add new friend request
     *
     * this assumes post_data has {from, to}
     * this check is done by default in app.js
     * */

    /* check if from and to are different */
    if (post_data.from == post_data.to) {
	let ret = {
	    success: false,
	    messages: ["to and from are identical"]
	};
	ee.emit(event, ret);
	return;
    }

    const friend_emitter = new EventEmitter();

    /* after connecting to db */
    friend_emitter.on("connection", function(ret){
	if (ret.success === false) {
	    ee.emit(event, ret);
	    return;
	}
	/* check if users are valid */
	check_users(post_data, friend_emitter, "users");
    });
    friend_emitter.on("users", function(ret) {
	if (ret.success === false) {
	    ee.emit(event, ret);
	    return;
	}
	/* check if there is already a request between users */
	check_requests(post_data, friend_emitter, "requests");
    });
    friend_emitter.on("requests", function(ret) {
	if (ret.success === false) {
	    ee.emit(event, ret);
	    return;
	}
	/* new request */
	let request = new models.friend_req_model({
	    from: post_data.from,
	    to: post_data.to,
	    seen: false,
	    status: "progress"
	});
	/* save new request */
	request.save(function(err, result){
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
    connect.connect_to_db(friend_emitter, "connection");
}

function get_requests(uid, ee, event) {
    /*
     * function that will retrive all friend requests for uid
     * these can be either sent or received friend requests
     *
     * ret.requests = list of friend requests
     * this returns the data with a slight modification than
     * how it is stored in the db (from = {id: id}, to = {id: id})
     * */

    /* first, register callbacks */
    const friend_emitter = new EventEmitter();

    /* after connecting to db */
    friend_emitter.on("connection", function(ret){
	if (ret["success"] === false) {
	    ret["requests"] = [];
	    ee.emit(event, ret);
	    return;
	}
	/* or select TODO test */
	let filter = {$or: [{from: uid}, {to: uid}]};
	models.friend_req_model.find(filter, function(err, result){
	    if (err){
		let ret = {
		    success: false,
		    messages: ["Error retrieving requests: " + err.message],
		    requests: []
		};
		ee.emit(event, ret);
		return;
	    }
	    let requests = [];
	    result.forEach(function(elem){
		/*
		 * for some reason when I use or query, I can't
		 * access the fields directly from elem (e.g. elem.from)
		 * so I need to use _doc this time
		 * */
		requests.push({
		    id: elem._id,
		    from: {
			id: elem._doc.from
		    },
		    to: {
			id: elem._doc.to
		    },
		    seen: elem._doc.seen,
		    status: elem._doc.status
		});
	    });
	    let ret = {
		success: true,
		messages: ["success"],
		requests: requests
	    };
	    ee.emit(event, ret);
	});
    });

    /* connect to db */
    connect.connect_to_db(friend_emitter, "connection");
}

function delete_requests(uid, ee, event) {
    /*
     * delete all requests by/for uid
     * */
    const friend_emitter = new EventEmitter();

    /* after connecting to db */
    friend_emitter.on("connection", function(ret){
	if (ret.success === false) {
	    ee.emit(event, ret);
	    return;
	}
	let filter = {$or: [{from: uid}, {to: uid}]};
	models.friend_req_model.remove(filter, function(err, result){
	    if (err){
		let ret = {
		    success: false,
		    messages: ["Error deleting friend reqs: " + err.message]
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
    connect.connect_to_db(friend_emitter, "connection");
}

function check_requests(post_data, ee, event){
    /*
     * checks if there is already a request for the users in post_data
     * post_data {to, from}
     * */

    /* TODO do some testing on this */
    let filter = {
	$or: [
	    {$and: [{from: post_data.from}, {to: post_data.to}]},
	    {$and: [{from: post_data.to}, {to: post_data.from}]}
	]
    };
    models.friend_req_model.find(filter, function(err, result){
	if (err){
	    let ret = {
		success: false,
		messages: ["Error retrieving friend requests: " + err.message]
	    };
	    ee.emit(event, ret);
	    return;
	}
	if (result.length > 0) {
	    let ret = {
		success: false,
		messages: ["Request between users already exists"]
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
}

function check_users(post_data, ee, event){
    /*
     * checks if users are valid
     * users in post_data {to, from}
     *
     * for now just check for "to" user
     * "from" user is the same auth.uid so that should
     * be valid
     * */
    let filter = {_id: post_data.to};
    models.user_model.find(filter, function(err, result){
	if (err){
	    let ret = {
		success: false,
		messages: ["Error retrieving users: " + err.message]
	    };
	    ee.emit(event, ret);
	    return;
	}
	if (result.length < 1) {
	    let ret = {
		success: false,
		messages: ["Destination user (to) invalid"]
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
}

/* exports */
module.exports.get_requests = get_requests;
module.exports.add_request = add_request;
module.exports.accept_request = accept_request;
module.exports.reject_request = reject_request;
module.exports.delete_requests = delete_requests;
