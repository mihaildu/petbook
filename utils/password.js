/*
 * small module for password hashing
 * */

const salt_string = "p3tzdlkaj*&^@1l";

function hash_password(user_data){
    /*
     * user_data: {
     *   "firstName": ..., (string)
     *   "lastName": ..., (string)
     *   "email": ..., (string)
     *   "password": ..., (string)
     *
     * returns string of 64 chars (sha256 hash based on user_data)
     */
    let salt = salt_string + user_data["firstName"] + user_data["lastName"] +
	    user_data["email"];
    let hash = require("crypto").createHash("sha256");
    hash.update(salt + user_data["password"]);
    return hash.digest("hex");
}

/* exports */
module.exports.hash_password = hash_password;
