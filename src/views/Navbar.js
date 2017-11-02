/*
 * The navbar that shows up on every page.
 *
 * TODO
 *   2 versions, one for welcome page and one for everything else
 *     with logged in data
 *   make sure navbar collapses at the right width
 * */
import React from "react";

function Navbar(props) {
    return (
	<nav className="navbar navbar-default navbar-fixed-top">
	  <div className="container">
	    <div className="navbar-header">
	      <a className="navbar-brand" href="/">
		<div id="logo">
		  petbook
		</div>
	      </a>
	      <button type="button" className="navbar-toggle collapsed"
		      data-toggle="collapse"
		      data-target="#navmenu"
		      aria-expanded="false">
		<span className="icon-bar"></span>
		<span className="icon-bar"></span>
		<span className="icon-bar"></span>
	      </button>
	    </div>
	    <div className="collapse navbar-collapse" id="navmenu">
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
	    </div>
	  </div>
	</nav>
    );
}

export default Navbar;
