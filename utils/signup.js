/*
 * simple signup system
 */

/* events */
const EventEmitter = require("events");

const connect = require("./connect.js");
const password = require("./password.js");
const validators = require("./validators.js");
const models = require("./models.js");
const photos = require("./photos.js");

function attempt_signup(signup_data, ee, args){
    /*
     * function that will attempt to sign up a user to a local db
     * (specified in connect.js) using login credentials from signup_data
     * when the function is done, an event "signup" will be emitted for ee
     *
     * the callback will be called like this: (ret, args)
     * where ret is an object with success/failure and some messages
     * and args are arguments passed to this function
     *
     * signup_data: {
     *   "firstName": ...,
     *   "lastName": ...,
     *   "email": ...,
     *   "password": ...,
     *   "type": ...,
     *   "gender": ...,
     *   "birthday": ...
     * }
     *
     * ee: event emitter that listens for "signup"
     * callback prototype: (ret, args)
     *
     * args: optional args that will be passed to ee.on("signup")
     *
     * ret: {
     *   "success": ..., (true/false)
     *   "messages": [..., ...] (optional array of messages)
     *   "session": { (optional, in case of success)
     *     "uid": ...,
     *     "firstName": ..., (string)
     *     "lastName": ..., (string)
     *     "email": ..., (string)
     *     "password": ..., (string)
     *     "type": ..., (string)
     *     "gender": ..., (string)
     *     "birthday": ..., (string)
     *     "friends": ... (list)
     *   }
     * }
     *
     * for now don't disconnect from db at the end
     * avoiding reconnection in other modules (e.g. photos)
     */

    /* check input */
    let ret = check_errors(signup_data);
    if (ret["success"] === false){
	ee.emit("signup", ret, args);
	return;
    }

    /* first, register callbacks */
    const signup_emitter = new EventEmitter();

    /* when connection is done */
    signup_emitter.on("connection", function(ret){
	if (ret["success"] === false) {
	    ee.emit("signup", ret, args);
	    return;
	}
	/* check if email already exists in db */
	check_email(signup_data, signup_emitter, "email");
    });

    /* after username check */
    signup_emitter.on("email", function(ret){
	if (ret["success"] === false) {
	    //connect.disconnect_from_db();
	    ee.emit("signup", ret, args);
	    return;
	}
	/* add user to db */
	signup(signup_data, signup_emitter, "signup");
    });

    /* when signup is done */
    signup_emitter.on("signup", function(ret){
	//connect.disconnect_from_db();
	ee.emit("signup", ret, args);
    });

    /* connect to db - start the chain of async functions */
    connect.connect_to_db(signup_emitter, "connection");
}

function check_errors(signup_data){
    /*
     * check if firstName, lastName, email, password, type,
     * gender and birthday are not empty
     *
     * also, it checks if animal type is valid
     * and if password is valid
     *
     * TODO allow for empty bdays and genders
     * TODO check for bdays in the future
     * */
    let success = true;
    let messages = [];
    if (!signup_data["firstName"]){
	messages.push("Please enter a first name");
	success = false;
    }
    if (!signup_data["lastName"]){
	messages.push("Please enter a last name");
	success = false;
    }
    if (!signup_data["password"]){
	messages.push("Please enter a password");
	success = false;
    }
    if (!signup_data["email"]){
	messages.push("Please enter an email");
	success = false;
    } else if (validators.validate_email(signup_data["email"]) === false){
	messages.push("Please enter a valid email address");
	success = false;
    }
    if (!signup_data["type"]){
	messages.push("Please select your pet's type");
	success = false;
    } else if (validators.validate_type(signup_data["type"]) === false){
	messages.push("Please select a valid pet type");
	success = false;
    }
    if (!signup_data["gender"]){
	messages.push("Please select a gender for your pet");
	success = false;
    }
    if (!signup_data["birthday"]){
	messages.push("Please select a birthday for your pet");
	success = false;
    }
    return {success: success, messages: messages};
}

function check_email(signup_data, ee, event){
    /*
     * checks if email is already in the db
     *
     * TODO maybe make this function more generic
     * e.g. check_unique(field, ...) after some field like email
     */
    let filter = {email: signup_data["email"]};
    models.user_model.find(filter, function(err, result){
	if (err){
	    let ret = {
		success: false,
		messages: ["Error retrieving users: " + err.message]
	    };
	    ee.emit(event, ret);
	    return;
	}
	if (result.length > 0){
	    let ret = {
		success: false,
		messages: ["Email already in use. Try a different one."]
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

function signup(signup_data, ee, event, args){
    /*
     * inserts new user to db
     *
     * note
     * for the moment, user_data in hash_password() has the same
     * prototype as signup_data; this might change in the future
     * in which case this function needs to be updated
     */
    let hashed_password = password.hash_password(signup_data);
    let user = new models.user_model({
	firstName: signup_data["firstName"],
	lastName: signup_data["lastName"],
	email: signup_data["email"],
	password: hashed_password,
	type: signup_data["type"],
	gender: signup_data["gender"],
	birthday: signup_data["birthday"],
	isGuest: signup_data["isGuest"],
	friends: [],
	avatar: photos.default_avatar_id
    });
    user.save(function(err, user){
	if (err){
	    let ret = {
		success: false,
		messages: ["MongoDB error: " + err.message]
	    };
	    ee.emit(event, ret);
	    return;
	}
	/* log the user in and return success */
	let ret = {
	    success: true,
	    messages: ["success"],
	    session: {
		uid: user._id,
		firstName: signup_data["firstName"],
		lastName: signup_data["lastName"],
		email: signup_data["email"],
		password: hashed_password,
		type: signup_data["type"],
		gender: signup_data["gender"],
		birthday: signup_data["birthday"],
		isGuest: signup_data["isGuest"],
		friends: [],
		avatar: photos.default_avatar_id,
		avatarUrl: photos.default_avatar_path
	    }
	};
	ee.emit(event, ret);
    });
}

/* exports */
module.exports.attempt_signup = attempt_signup;
