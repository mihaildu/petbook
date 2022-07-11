/*
 * module for interacting with posts collection
 */

const EventEmitter = require("events");

const connect = require("./connect.js");
const models = require("./models.js");

function update_post(post_data, ee, event) {
    /*
     * function that will attempt to update a post
     *
     * post_data: {"pid", "uid", "edit_text"}
     * */
    const post_emitter = new EventEmitter();

    /* when connection is done */
    post_emitter.on("connection", function(ret){
	if (ret["success"] === false) {
	    ee.emit(event, ret);
	    return;
	}
	/* check if the post is owned by uid */
	check_permission(post_data.uid, post_data.pid,
			 post_emitter, "permission");
    });

    /* after permission is checked */
    post_emitter.on("permission", function(ret){
	if (ret["success"] === false) {
	    ee.emit(event, ret);
	    return;
	}
	/* update post */
	_update_post(post_data.pid, post_data.edit_text,
		     post_emitter, "update");
    });

    /* after post is deleted */
    post_emitter.on("update", function(ret){
	ee.emit(event, ret);
    });

    /* connect to db */
    connect.connect_to_db(post_emitter, "connection");
}

function delete_post(post_data, ee, event) {
    /*
     * function that will attempt to delete a post
     *
     * post_data: {"pid", "uid"}
     * */
    const post_emitter = new EventEmitter();

    /* when connection is done */
    post_emitter.on("connection", function(ret){
	if (ret["success"] === false) {
	    ee.emit(event, ret);
	    return;
	}
	/* check if the post is owned by uid */
	check_permission(post_data.uid, post_data.pid,
			 post_emitter, "permission");
    });

    /* after permission is checked */
    post_emitter.on("permission", function(ret){
	if (ret["success"] === false) {
	    ee.emit(event, ret);
	    return;
	}
	/* delete post */
	_delete_post(post_data.pid, post_emitter, "deletion");
    });

    /* after post is deleted */
    post_emitter.on("deletion", function(ret){
	ee.emit(event, ret);
    });

    /* connect to db */
    connect.connect_to_db(post_emitter, "connection");
}

function delete_posts(uid, ee, event) {
    /*
     * function that will attempt to delete all posts by uid
     * */
    const post_emitter = new EventEmitter();

    /* when connection is done */
    post_emitter.on("connection", function(ret){
	if (ret["success"] === false) {
	    ee.emit(event, ret);
	    return;
	}
	let filter = {uid: uid};
	models.post_model.remove(filter, function(err, result){
	    if (err){
		let ret = {
		    success: false,
		    messages: ["Error deleting posts: " + err.message]
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
    connect.connect_to_db(post_emitter, "connection");
}

function submit_post(post_data, ee, event) {
    /*
     * function that will attempt to save a post
     * */

    /* first, register callbacks */
    const post_emitter = new EventEmitter();

    /* after connecting to db */
    post_emitter.on("connection", function(ret){
	if (ret["success"] === false) {
	    ee.emit(event, ret);
	    return;
	}
	/* TODO test with Date() only */
	const now = new Date();
	let post = new models.post_model({
	    uid: post_data["uid"],
	    isText: post_data["isText"],
	    text: post_data["post_text"],
	    timestamp: now.toUTCString(),
	    photo: post_data["photo"],
	    comments: []
	});
	/* save new post */
	post.save(function(err, result){
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
    connect.connect_to_db(post_emitter, "connection");
}

function get_posts(uid, ee, event) {
    /*
     * function that will retrive all posts for user
     *
     * TODO uid -> uids (list of uid) for user an all of his
     * friends
     * change filter to match all uids in list
     * */

    /* first, register callbacks */
    const post_emitter = new EventEmitter();

    /* after connecting to db */
    post_emitter.on("connection", function(ret){
	if (ret["success"] === false) {
	    ret["posts"] = [];
	    ee.emit(event, ret);
	    return;
	}
	let filter = {uid};
	models.post_model.find(filter, function(err, result){
	    if (err){
		let ret = {
		    success: false,
		    messages: ["Error retrieving user: " + err.message],
		    posts: []
		};
		ee.emit(event, ret);
		return;
	    }
	    /*
	     * result has more info than we need
	     * also, there seems to be some syntactic sugar
	     * result[index][uid] works while the field is actually
	     * result[index]._doc[uid]
	     * */
	    let posts = [];
	    result.forEach(function(elem){
		posts.push({
		    id: elem._id,
		    uid: elem.uid,
		    isText: elem.isText,
		    text: elem.text,
		    timestamp: elem.timestamp,
		    photo: elem.photo,
		    comments: elem.comments
		});
	    });
	    let ret = {
		success: true,
		messages: ["success"],
		posts: posts
	    };
	    ee.emit(event, ret);
	});
    });

    /* connect to db */
    connect.connect_to_db(post_emitter, "connection");
}

function check_permission(uid, pid, ee, event) {
    /*
     * function that checks permission for uid on pid
     * */
    let filter = {_id: pid};
    models.post_model.find(filter, function(err, result){
	if (err){
	    let ret = {
		success: false,
		messages: ["Error retrieving post: " + err.message]
	    };
	    ee.emit(event, ret);
	    return;
	}
	if (result.length < 1) {
	    let ret = {
		success: false,
		messages: ["Post ID invalid"]
	    };
	    ee.emit(event, ret);
	    return;
	}
	if (uid != result[0].uid) {
	    let ret = {
		success: false,
		messages: ["User is not the owner of the post"]
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

function _delete_post(pid, ee, event) {
    /*
     * function that will delete post with pid
     * no checking is done
     * */
    let filter = {_id: pid};
    models.post_model.remove(filter, function(err, result){
	if (err){
	    let ret = {
		success: false,
		messages: ["Error retrieving post: " + err.message]
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

function _update_post(pid, new_text, ee, event) {
    /*
     * function that will update post with pid
     * no checking is done
     * */
    let filter = {_id: pid};
    let updated_values = {
	text: new_text,
	timestamp: new Date().toUTCString()
    };
    models.post_model.update(filter, updated_values, function(err, result){
	if (err){
	    let ret = {
		success: false,
		messages: ["Error updating post: " + err.message]
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
module.exports.submit_post = submit_post;
module.exports.get_posts = get_posts;
module.exports.delete_post = delete_post;
module.exports.update_post = update_post;
module.exports.delete_posts = delete_posts;
