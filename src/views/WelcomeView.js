/*
 * The Welcome page where you can login/signup
 * */

import React from "react";

import {Actions} from "../data/PetbookActions";
import Navbar from "./Navbar";
import SignUpView from "./SignUpView";

function WelcomeView(props) {
    /* flash messages - from store */
    const messages = props.welcome_store.get("messages");
    let flash_messages = "";
    if (messages.length > 0) {
	/* wrap all messages in divs */
	let id = 0;
	let div_messages = messages.map(
	    message => <div key={id++}>{message}</div>
	);
	flash_messages = (
	    <div className="alert alert-danger error-messages">
	      {div_messages}
	    </div>
	);
    }
    /* values - for now we use jquery */
    /* const values = props.welcome_store.get("values"); */
    /* <SignUpView values={values} /> */
    return (
	<div>
	  <Navbar logo="text" login={true} friend_requests={[]} />
	  <div id="clear-navbar"></div>
	  <div className="container" id="main-container">
	    <div className="row">
	      <div className="col-md-6">
		{flash_messages}
		<SignUpView />
	      </div>
	      <div className="col-md-6">
		<img id="pet-image"
		     src="imgs/pet-friendship.png" />
	      </div>
	    </div>
	  </div>
	</div>
    );
}

export default WelcomeView;
