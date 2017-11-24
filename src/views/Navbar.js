/*
 * The navbar that shows up on every page.
 *
 * TODO
 *   make sure navbar collapses at the right width
 *   the navbar moves a little to the right when friend request modal
 *     shows up - not a big issue
 * */
import React from "react";

import {Actions} from "../data/PetbookActions.js";

function Navbar(props) {

    function show_friend_requests() {
	$("#friends-modal").modal("show");
    }

    function show_unseen_messages() {
	$("#unseen-messages-modal").modal("show");
    }

    function accept_friend(uid) {
	let post_data = {
	    from: uid,
	    to: props.auth.uid
	};
	$.post("/accept-friend", post_data, (data) => {
	    if (data.success == true) {
		/* update list of friend requests */
		$.get("/api/friend-requests", (reqs, status) => {
		    Actions.update_friend_requests(reqs);
		});
		/* update friends list */
		$.get("/api/update-auth", (auth, status) => {
		    Actions.update_auth(auth);
		    /*
		     * update info on friends (firstName, lastName etc)
		     * this is not needed on any page, but the request
		     * is async so it shouldn't have a big impact on perf
		     *
		     * also, this needs to be done only after the list of
		     * friends is updated
		     * */
		    $.get("/api/friends", function(auth, status){
			Actions.update_auth(auth);
		    });
		});
	    }
	});
    }

    function reject_friend(uid) {
	let post_data = {
	    from: uid,
	    to: props.auth.uid
	};
	$.post("/reject-friend", post_data, (data) => {
	    if (data.success == true) {
		$.get("/api/friend-requests", (reqs, status) => {
		    Actions.update_friend_requests(reqs);
		});
	    }
	});
    }

    function view_message(user, uid) {
	/*
	 * TODO
	 * duplicated code with AboutView and ChatView
	 * */
	let req_url = "/api/chat/" + props.auth.uid + "/" + uid;
	$.get(req_url, (messages, status) => {
	    /* convert from /api/ format to local format */
	    let new_messages = [];
	    messages.forEach(message => {
		let firstName, lastName;
		if (message.from == props.auth.uid) {
		    firstName = props.auth.firstName;
		    lastName = props.auth.lastName;
		} else {
		    firstName = user.firstName;
		    lastName = user.lastName;
		}
		new_messages.push({
		    pid: uid,
		    from: message.from,
		    to: message.to,
		    firstName: firstName,
		    lastName: lastName,
		    message: message.message
		});
	    });
	    Actions.add_popup({
		uid: uid,
		firstName: user.firstName,
		lastName: user.lastName,
		avatar: user.avatar,
		avatarUrl: user.avatarUrl,
		messages: new_messages,
		me_typing: false,
		other_typing: false
	    });
	});
    }

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
	      <img src="/imgs/petbook-logo-inverted.png" />
	    </div>
	);
    }

    /* I guess the name is ok since this only shows in navbar */
    const received_requests = props.friend_requests.filter(elem => {
	return (elem.to.id == props.auth.uid) && (elem.status != "rejected");
    });

    /* TODO I don't think I use no_req_txt anymore */
    let req_nr, no_req_txt;
    if (received_requests.length > 0) {
	req_nr = (
	    <div id="req-nr">
	      {received_requests.length}
	    </div>
	);
	no_req_txt = "";
    }
    else {
	req_nr = "";
	no_req_txt = (
	    <div id="no-req-txt">
	      You have no friend requests
	    </div>
	);
    }

    /* unseen messages */
    let unseen_messages = props.unseen_messages,
	unseen_nr, unseen_txt;
    if (unseen_messages.cnt > 0) {
	unseen_nr = (
	    <div id="unseen-nr">
	      {unseen_messages.cnt}
	    </div>
	);
    } else {
	unseen_nr = "";
    }

    let unseen_messages_users = [], user_id = 0;
    for (let bucket_id in unseen_messages.users) {
	let user = unseen_messages.users[bucket_id];
	unseen_messages_users.push(
	    <div className="unseen-message" key={user_id++}>
	      <img src={user.avatarUrl} className="unseen-message-avatar" />
	      <a className="unseen-message-author"
		 href={"/user/" + bucket_id}>
		{user.firstName + " " + user.lastName}
	      </a>
	      <button className="form-group btn btn-primary unseen-view-btn"
		      onClick={(e) => view_message(user, bucket_id)}>
		View
	      </button>
	    </div>
	);
    }
    if (unseen_messages.cnt == 0) {
	unseen_messages_users = (
	    <div id="unseen-messages-empty">
	      You have no new messages
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
	      <a title="Explore" className="navbar-link" href="/explore">
		Explore
	      </a>
	      <img className="navbar-separator" src="/icos/vert-favicon.ico"/>
	      <a title="Profile" className="navbar-link"
		 href={"/user/" + props.auth.uid}>
		<img src={props.auth.avatarUrl} id="navbar-profile-image" />
		{props.auth.firstName}
	      </a>
	      <img className="navbar-separator" src="/icos/vert-favicon.ico"/>
	      <a title="Home" className="navbar-link" href="/">
		Home
	      </a>
	      <img className="navbar-separator" src="/icos/vert-favicon.ico"/>
	      <a id="friend-req-link" title="Friend Requests"
		 className="navbar-link" onClick={show_friend_requests}>
		<img id="friend-request" src="/imgs/pet-friend-req.png"/>
		{req_nr}
	      </a>
	      <img className="navbar-separator" src="/icos/vert-favicon.ico"/>
	      <a id="messages-link" title="Chat" className="navbar-link"
		 onClick={show_unseen_messages}>
		<img id="navbar-chat" src="/imgs/chat.png"/>
		{unseen_nr}
	      </a>
	      <form className="navbar-form" method="post" action="/">
		<button name="submit_logout" type="submit"
			className="form-group btn btn-default">
		  Log out
		</button>
	      </form>
	    </div>
	);
    }

    /* when page width goes under a certain value */
    const collapsed_btn = (
	<button type="button" className="navbar-toggle collapsed"
		data-toggle="collapse"
		data-target="#navmenu"
		aria-expanded="false">
	  <span className="icon-bar"></span>
	  <span className="icon-bar"></span>
	  <span className="icon-bar"></span>
	</button>
    );

    let friend_requests = received_requests.map(request => {
	return (
	    <div key={request.id} className="friend-request">
	      <img src={request.from.avatarUrl}
		   className="friends-modal-avatar" />
	      <a className="friends-modal-author"
		 href={"/user/" + request.from.id}>
		{request.from.firstName + " " + request.from.lastName}
	      </a>
	      <button className="form-group btn btn-primary accept-btn-modal"
		      onClick={(e) => accept_friend(request.from.id)}>
		Accept
	      </button>
	      <button className="form-group btn btn-primary reject-btn-modal"
		      onClick={(e) => reject_friend(request.from.id)}>
		Reject
	      </button>
	    </div>
	);
    });
    if (received_requests.length == 0) {
	friend_requests = (
	    <div id="friend-request-empty">
	      You have no friend requests
	    </div>
	);
    }
    return (
	<div>
	  <div className="modal" id="friends-modal">
	    <div className="modal-dialog modal-content"
		 id="friends-modal-dialog">
	      <div className="modal-header">
		<button className="close" data-dismiss="modal">
		  x
		</button>
		<div className="modal-title" id="friends-modal-title">
		  Friend Requests</div>
	      </div>
	      <div className="modal-body" id="friends-modal-body">
		{friend_requests}
	      </div>
	    </div>
	  </div>

	  <div className="modal" id="unseen-messages-modal">
	    <div className="modal-dialog modal-content"
		 id="unseen-messages-modal-dialog">
	      <div className="modal-header">
		<button className="close" data-dismiss="modal">
		  x
		</button>
		<div className="modal-title" id="unseen-messages-title">
		  New Messages</div>
	      </div>
	      <div className="modal-body" id="unseen-messages-body">
		{unseen_messages_users}
	      </div>
	    </div>
	  </div>

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
	</div>
    );
}

export default Navbar;
