/*
 * small module that manages a connection to a MongoDB
 * credentials should be stored only in this place
 * */
const credentials = {
    host: "localhost",
    port: "27017",
    user: "petbook_root",
    password: "root",
    db: "petbook"
};

let db;
let connection_established = false;
const mongoose = require("mongoose");

function connect_to_db(ee, event, args){
    /*
     * connects to mysql db using global var "credentials"
     * "credentials" and this function should be kept in same file
     *
     * ee: event emitter that listens for event
     * callback params: (ret, args)
     *
     * args: args to be passed to event callback
     *   too generic, I don't need this with v2+
     *
     * event: event to be emitted on ee when done
     *
     * ret {
     *   "success": boolean,
     *   "messages": [string, ...], (array of strings)
     * }
     */
    if (connection_established === true) {
	let ret = {
	    success: true,
	    messages: ["success"]
	};
	ee.emit(event, ret, args);
	return;
    }

    /* let connect_str = "mongodb://" + credentials.user + ":" + */
    /* 	credentials.password + "@" + credentials.host + ":" + */
    /* 	credentials.port + "/" + credentials.db; */

    /* connect */
    mongoose.connect(process.env.MONGODB_URI, {useMongoClient: true});
    /* change to global promises */
    mongoose.Promise = global.Promise;

    db = mongoose.connection;
    db.on("error", function(err){
	let ret = {
	    success: false,
	    messages: ["Cannot connect to db: " + err.message]
	};
	ee.emit(event, ret, args);
    });
    db.once("open", function(){
	let ret = {
	    success: true,
	    messages: ["success"]
	};
	connection_established = true;
	ee.emit(event, ret, args);
    });
}

function disconnect_from_db() {
    if (connection_established === true) {
	db.close();
	connection_established = false;
    }
}

function connection_active() {
    return connection_established;
}

/* exports */
module.exports.connect_to_db = connect_to_db;
module.exports.disconnect_from_db = disconnect_from_db;
module.exports.connection_active = connection_active;
