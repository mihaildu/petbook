/*
 * simple login system
 */

/* events */
const EventEmitter = require("events");

/* require won't include twice the same module */
const connect = require("./connect.js");
const password = require("./password.js");
const validators = require("./validators.js");
const models = require("./models.js");

function attempt_login(login_data, ee, args){
    /*
     * function that will attempt to log in a user from a local db
     * (specified in connect.js) using login credentials from login_data
     * when the function is done, an event "login" will be emitted for ee
     *
     * the callback will be called like this: (ret, args)
     * where ret is an object with success/failure and some messages
     * and args are arguments passed to this function
     *
     * login_data: {
     *   "email": ...,
     *   "password": ...
     * }
     *
     * ee: event emitter that listens for "login"
     * callback prototype: (ret, args)
     *
     * args: optional args that will be passed to ee.on("login")
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
     */

    /*
     * check input - no need to continue if this is bad
     * also, this function is not that time consuming so it's prob
     * better to run it now and not later, in the event loop
     * */
    let ret = check_errors(login_data);
    if (ret["success"] === false){
	ee.emit("login", ret, args);
	return;
    }

    /* first, register callbacks */
    const login_emitter = new EventEmitter();

    /* after connecting to db */
    login_emitter.on("connection", function(ret){
	if (ret["success"] === false) {
	    ee.emit("login", ret, args);
	    return;
	}
	/* check credentials and log in */
	login(login_data, login_emitter, "login");
    });

    /* after login check - just notify up */
    login_emitter.on("login", function(ret){
	/*
	 * for now don't disconnect from db
	 * doing so might add big overhead for future operations
	 * TODO check what really happens if you don't close connection
	 * at all
	 *
	 * connect.disconnect_from_db();
	 * */
	ee.emit("login", ret, args);
    });

    /* connect to db - start the chain of async functions */
    connect.connect_to_db(login_emitter, "connection");
}

function check_errors(login_data){
    /*
     * check if email/password is empty
     * might be a good idea to check if !str works all the time
     * for empty strings with all the javascript type coercion
     *
     * also checks for valid e-mail address
     * */
    let success = true;
    let messages = [];
    if (!login_data["email"]){
	messages.push("Please enter an email");
	success = false;
    } else if (validators.validate_email(login_data["email"]) === false){
	messages.push("Please enter a valid email address");
	success = false;
    }
    if (!login_data["password"]){
	messages.push("Please enter a password");
	success = false;
    }
    return {success: success, messages: messages};
}

function login(login_data, ee, event){
    /*
     * login_data: {
     *   "email": ...,
     *   "password": ...
     * }
     *
     * ee: event emitter that listens for event with params (ret, args)
     *
     * ret: {
     *   "success": ..., (true/false)
     *   "messages": [..., ...] (optional array of messages)
     *   "session": { (optional, in case of success)
     *     "uid": ..., (number, user id)
     *     "username": ..., (string)
     *     "email": ..., (string)
     *     "password": ..., (string)
     *   }
     * }
     */
    let filter = {email: login_data["email"]};
    models.user_model.find(filter, function(err, result){
	if (err){
	    let ret = {
		success: false,
		messages: ["Error retrieving user: " + err.message]
	    };
	    ee.emit(event, ret);
	    return;
	}
	if (result.length < 1){
	    let ret = {
		success: false,
		messages: ["Bad login details"]
	    };
	    ee.emit(event, ret);
	    return;
	}
	/* check password */
	let user_data = {
	    firstName: result[0]["firstName"],
	    lastName: result[0]["lastName"],
	    email: login_data["email"],
	    password: login_data["password"]
	};
	if (result[0]["password"] != password.hash_password(user_data)){
	    let ret = {
		success: false,
		messages: ["Bad login details"]
	    };
	    ee.emit(event, ret);
	    return;
	}
	/* save info in session variables */
	let ret = {
	    "success": true,
	    "messages": ["success"],
	    "session": {
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
		avatar: result[0]["avatar"]
	    }
	};
	ee.emit(event, ret);
    });
}

/* exports */
module.exports.attempt_login = attempt_login;
