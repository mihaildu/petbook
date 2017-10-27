/*
 * The Welcome page where you can login/signup
 *
 * TODO add a navbar
 * */

import React from "react";

import Navbar from "./Navbar";
import SignUpView from "./SignUpView";

function WelcomeView(props) {
    return (
	<div>
	  <Navbar />
	  <div id="clear-navbar"></div>
	  <div className="container" id="main-container">
	    <div className="row">
	      <div className="col-md-6">
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
