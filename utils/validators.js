/*
 * simple module for validating stuff
 */

function test_validate_email(){
    /*
     * simple tests for email validation
     */
    emails = ["jim@yahoo.com", "dasda", "kdljad@lkjda", "dsad.com",
	      "dsadal@lkdja.com", "@", "@kjdas.com"];
    emails.forEach(function(email){
	if (validate_email(email) === true){
	    console.log("email " + email + " is valid");
	} else {
	    console.log("email " + email + " is invalid");
	}
    });
}

function validate_email(email_string){
    /*
     * function that validates an e-mail address
     * RFC 5322 might be relevant when validating email addresses
     * this function uses something simpler
     *
     * email_string: string containing the email address to be validated
     *
     * returns:
     *   true: email address is valid
     *   false: email address is not valid
     *
     * RE taken from http://www.regular-expressions.info/email.html
     *   \A = beginning of string
     *   \z = end of string
     */
    let re = new RegExp(/^[a-z0-9!#$%&'*+\/=?^_`{|}~-]+/.source +
			/(?:\.[a-z0-9!#$%&'*+\/=?^_`{|}~-]+)*/.source +
			/@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+/.source +
			/[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/.source);

    return re.test(email_string);
}

function test_validate_type(){
    /*
     * simple tests for pet type validation
     */
    const pets = ["Cat", "Dog", "Penguin", "Potato",
		  "ldksajda", "x", "&(*&!@jlkj"];
    pets.forEach(function(pet){
	if (validate_type(pet) === true){
	    console.log("Pet " + pet + " is valid");
	} else {
	    console.log("Pet " + pet + " is invalid");
	}
    });
}

function validate_type(pet_string){
    /*
     * function that validates a pet type
     *
     * the pet type from post request must be one from the
     * list we offer; the list must be in one place only and
     * use by both frontend (react signupview) and backend
     *
     * pet_string: string containing the pet type to be validated
     *
     * returns:
     *   true: pet type is valid
     *   false: pet type is not valid
     */

    /*
     * this will read the file every time a validation occurs
     * e.g. on each signup
     * TODO maybe read it once and keep it in memory?
     * */
    const fs = require("fs");
    /* TODO - move file path somewhere else? */
    const pets_path = "pet_list";
    const file_data = fs.readFileSync(pets_path, "utf8");

    /*
     * assuming one pet type on each row - split after \n
     * and get rid of empty rows/elements ("")
     * */
    const allowed_pets = file_data.split(/\n/).filter(function(elem){
	/* some type coercion here - "" will be converted to false */
	return elem;
    });
    return allowed_pets.includes(pet_string);
}

/* exports */
module.exports.validate_email = validate_email;
module.exports.validate_type = validate_type;
