/*
 * module for interacting with photos collection
 */

const EventEmitter = require("events");

const default_avatar_id = process.env.DEFAULT_AVATAR_ID;
const default_avatar_path = "/photos/default_avatar.png";

const connect = require("./connect.js");
const models = require("./models.js");

function delete_photo(post_data, ee, event) {
    /*
     * function that will attempt to delete a photo
     *
     * post_data: {"photo_id", "uid", "photo_url"}
     * */
    const photo_emitter = new EventEmitter();

    /* when connection is done */
    photo_emitter.on("connection", function(ret){
	if (ret["success"] === false) {
	    ee.emit(event, ret);
	    return;
	}
	/* check if the post is owned by uid */
	check_permission(post_data.uid, post_data.photo_id,
			 photo_emitter, "permission");
    });

    /* after permission is checked */
    photo_emitter.on("permission", function(ret){
	if (ret["success"] === false) {
	    ee.emit(event, ret);
	    return;
	}
	/* delete post */
	_delete_photo(post_data.photo_id, photo_emitter, "deletion");
    });

    /* after post is deleted */
    photo_emitter.on("deletion", function(ret){
	/* unlink file from disk */
	let fs = require("fs");
	fs.unlink("public" + post_data.photo_url, (err) => {
	    if (err) {
		ret.success = false;
	    }
	    ee.emit(event, ret);
	});
    });

    /* connect to db */
    connect.connect_to_db(photo_emitter, "connection");
}

function delete_photos(uid, ee, event) {
    /*
     * function that will attempt to delete all photos by uid
     * */
    const photo_emitter = new EventEmitter();

    /* when connection is done */
    photo_emitter.on("connection", function(ret){
	if (ret["success"] === false) {
	    ee.emit(event, ret);
	    return;
	}
	/* TODO delete photos from disk */
	let filter = {owner: uid};
	models.photo_model.remove(filter, function(err, result){
	    if (err){
		let ret = {
		    success: false,
		    messages: ["Error deleting photos: " + err.message]
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
    connect.connect_to_db(photo_emitter, "connection");
}

function update_photo(post_data, ee, event) {
    /*
     * function that will attempt to update
     * an image with new description
     *
     * post_data: {"photo_id", "uid", "edit_text"}
     * */
    const photo_emitter = new EventEmitter();

    /* when connection is done */
    photo_emitter.on("connection", function(ret){
	if (ret["success"] === false) {
	    ee.emit(event, ret);
	    return;
	}
	/* check if the post is owned by uid */
	check_permission(post_data.uid, post_data.photo_id,
			 photo_emitter, "permission");
    });

    /* after permission is checked */
    photo_emitter.on("permission", function(ret){
	if (ret["success"] === false) {
	    ee.emit(event, ret);
	    return;
	}
	/* update post */
	_update_photo(post_data.photo_id, post_data.edit_text,
		     photo_emitter, "update");
    });

    /* after post is deleted */
    photo_emitter.on("update", function(ret){
	ee.emit(event, ret);
    });

    /* connect to db */
    connect.connect_to_db(photo_emitter, "connection");
}

function submit_photo(photo_data, ee, event) {
    /*
     * function that will attempt to save a photo
     * */

    /* first, register callbacks */
    const photo_emitter = new EventEmitter();

    /* after connecting to db */
    photo_emitter.on("connection", function(ret){
	if (ret["success"] === false) {
	    ee.emit(event, ret);
	    return;
	}
	let photo = new models.photo_model({
	    path: photo_data["path"],
	    owner: photo_data["owner"],
	    mimetype: photo_data["mimetype"],
	    description: photo_data["description"],
	    size: photo_data["size"]
	});
	/* save new post */
	photo.save(function(err, photo){
	    if (err){
		let ret = {
		    success: false,
		    messages: ["MongoDB error: " + err.message]
		};
		ee.emit(event, ret);
		return;
	    }
	    let ret = {
		success: true,
		messages: ["success"],
		photo_id: photo._id
	    };
	    ee.emit(event, ret);
	});
    });

    /* connect to db */
    connect.connect_to_db(photo_emitter, "connection");
}

function get_photo_info(photo_id, ee, event, args) {
    /*
     * returns all info for photo id
     *
     * TODO properly implement args
     * */
    const photo_emitter = new EventEmitter();
    photo_emitter.on("connection", function(ret) {
	if (ret["success"] === false) {
	    ee.emit(event, ret);
	    return;
	}
	let filter = {_id: photo_id};
	models.photo_model.find(filter, function(err, result){
	    if (err){
		let ret = {
		    success: false,
		    messages: ["Error retrieving photos: " + err.message]
		};
		ee.emit(event, ret);
		return;
	    }
	    if (result.length < 1){
		let ret = {
		    success: false,
		    messages: ["Could not find photo id"]
		};
		ee.emit(event, ret);
		return;
	    }
	    let ret = {
		success: true,
		messages: ["success"],
		path: result[0]["path"],
		owner: result[0]["owner"],
		mimetype: result[0]["mimetype"],
		description: result[0]["description"],
		size: result[0]["size"],
		args: args
	    };
	    ee.emit(event, ret);
	});
    });
    /* wait for connection if not opened */
    if (!connect.connection_active())
	connect.connect_to_db(photo_emitter, "connection");
    else
	photo_emitter.emit("connection", {success: true});
}

function check_permission(uid, pid, ee, event) {
    /*
     * function that checks permission for uid on photo id
     * uid should be the owner of photo
     * */
    let filter = {_id: pid};
    models.photo_model.find(filter, function(err, result){
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
		messages: ["Photo ID invalid"]
	    };
	    ee.emit(event, ret);
	    return;
	}
	if (uid != result[0].owner) {
	    let ret = {
		success: false,
		messages: ["User is not the owner of the photo"]
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

function _update_photo(pid, new_text, ee, event){
    /*
     * function that will update photo with pid
     * just description text is updated
     * no checking is done
     * */
    let filter = {_id: pid};
    let updated_values = {
	description: new_text
    };
    models.photo_model.update(filter, updated_values, function(err, result){
	if (err){
	    let ret = {
		success: false,
		messages: ["Error updating photo: " + err.message]
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

function _delete_photo(pid, ee, event){
    /*
     * function that will delete photo with pid
     * no checking is done
     * */
    let filter = {_id: pid};
    models.photo_model.remove(filter, function(err, result){
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

/* exports */
module.exports.default_avatar_id = default_avatar_id;
module.exports.default_avatar_path = default_avatar_path;
module.exports.get_photo_info = get_photo_info;
module.exports.submit_photo = submit_photo;
module.exports.update_photo = update_photo;
module.exports.delete_photo = delete_photo;
module.exports.delete_photos = delete_photos;
