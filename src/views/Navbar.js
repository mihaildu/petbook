/*
 * The navbar that shows up on every page.
 *
 * TODO
 *   make sure navbar collapses at the right width
 * */
import React from "react";

function Navbar(props) {
    let logo;
    if (props.logo == "text") {
	logo = (
	    <div id="logo">
	      petbook
	    </div>
	);
    } else if (props.logo == "img") {
	logo = (
	    <div id="logo">
	      <img src="imgs/petbook-logo-inverted.png" />
	    </div>
	);
    }
    /* extra is the stuff on the right */
    let extra;
    if (props.login == true) {
	/* the login form */
	extra = (
	    <form className="navbar-form navbar-right" method="post">
	      <div className="form-group">
		<input type="email" className="form-control"
		       name="email_login" placeholder="Email" />
	      </div>
	      <div className="form-group">
		<input type="password" className="form-control"
		       name="password_login" placeholder="Password" />
	      </div>
	      <button name="submit_login" type="submit"
		      className="form-group btn btn-default">
		Log in
	      </button>
	    </form>
	);
    } else {
	/*
	 * separator icon taken from
	 * http://separator.mayastudios.com/index.php
	 *
	 * pet-friend-req.png taken from
	 * https://www.pinterest.com/pin/157344580709319706/
	 *
	 * chat.svg/png taken from
	 * https://goo.gl/9HdzTR
	 * */
	extra = (
	    <div className="navbar-right" id="extra-navbar">
	      <a title="Explore" className="navbar-link" href="/">
		Explore
	      </a>
	      <img className="navbar-separator" src="icos/vert-favicon.ico"/>
	      <a title="Profile" className="navbar-link" href="/">
		<img src={props.auth.avatarUrl} id="navbar-profile-image" />
		{props.auth.firstName}
	      </a>
	      <img className="navbar-separator" src="icos/vert-favicon.ico"/>
	      <a title="Home" className="navbar-link" href="/">
		Home
	      </a>
	      <img className="navbar-separator" src="icos/vert-favicon.ico"/>
	      <a title="Friend Requests" className="navbar-link" href="/">
		<img id="friend-request" src="imgs/pet-friend-req.png"/>
	      </a>
	      <img className="navbar-separator" src="icos/vert-favicon.ico"/>
	      <a title="Chat" className="navbar-link" href="/">
		<img id="navbar-chat" src="imgs/chat.png"/>
	      </a>
	      <form className="navbar-form" method="post">
		<button name="submit_logout" type="submit"
			className="form-group btn btn-default">
		  Log out
		</button>
	      </form>
	    </div>
	);
    }

    /* when page width goes under a certain value */
    let collapsed_btn = (
	<button type="button" className="navbar-toggle collapsed"
		data-toggle="collapse"
		data-target="#navmenu"
		aria-expanded="false">
	  <span className="icon-bar"></span>
	  <span className="icon-bar"></span>
	  <span className="icon-bar"></span>
	</button>
    );

    return (
	<nav className="navbar navbar-default navbar-fixed-top">
	  <div className="container">
	    <div className="navbar-header">
	      <a className="navbar-brand" href="/">
		{logo}
	      </a>
	      {collapsed_btn}
	    </div>
	    <div className="my-class collapse navbar-collapse" id="navmenu">
	      {extra}
	    </div>
	  </div>
	</nav>
    );
}

export default Navbar;
