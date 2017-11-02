import React from "react";
import ReactDOM from "react-dom";

import WelcomeViewContainer from "./containers/WelcomeViewContainer";
import {Actions} from "./data/PetbookActions";

/*
 * check for flash messages
 *
 * doing this in the view will trigger an endless loop
 * because update_messages will cause the view to re-render
 *
 * since jquery is loaded anyway (TODO maybe remove this)
 * we can use $ without importing the module
 * */
$.get("/api/messages", function(messages, status){
    Actions.update_messages(messages);
});

/*
 * check for typed data - values
 *
 * react is locking values for input elements if specified
 * like "value={val}" (unless val is empty/undefined/null)
 *
 * this will lock the input elements after a post
 * TODO figure out a way to avoid/overcome this
 * for now, I just set them with jquery after page load
 * see update_values() below
 *
 * this function should do for react keeping values
 * $.get("/api/values", function(values, status){
 *   Actions.update_values(values);
 * });
 * */

ReactDOM.render(
    <WelcomeViewContainer />,
    document.getElementById("root")
);

/* update values after document is ready */
$(document).ready(update_values);
function update_values(){
    $.get("/api/values", function(values, status){
	// values = {"first_name_signup": "Jim", ...}
	for (let key in values){
	    /*
	     * this assumes unique name
	     * also, this seems to be escaped automatically (for " and ')
	     *
	     * special case for pet_gender_signup (Male/Female -> on)
	     * and for pet_type_signup (it's a select, not an input)
	     * apparently birthday works the way it is
	     * */
	    if (key == "pet_gender_signup"){
		if (values[key] == "Male")
		    $("#pet_gender_male").prop("checked", true);
		else
		    $("#pet_gender_female").prop("checked", true);
		continue;
	    } else if (key == "pet_type_signup"){
		$("select[name=pet_type_signup]").val(values[key]);
	    }
	    $("input[name=" + key + "]").val(values[key]);
	}
    });
}
