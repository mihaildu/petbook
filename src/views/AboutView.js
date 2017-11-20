/*
 * the about view on user page
 *
 * should show info from db + avatar picture
 * */
import React from "react";

import {Actions} from "../data/PetbookActions.js";

function AboutView(props) {

    let {user_data, auth_data, friend_requests} = props;

    function avatar_close() {
	$("#avatar-modal").modal("hide");
    }

    function avatar_click() {
	let img_elem = document.getElementById("avatar-full-size");
	let new_width = img_elem.naturalWidth + 2;
	$("#avatar-modal").find(".modal-dialog").css("width", new_width);
	$("#avatar-modal").modal("show");
    }

    function add_friend() {
	/* add a friend request to db */
	let post_data = {
	    from: auth_data.uid,
	    to: user_data.uid
	};
	$.post("/add-friend", post_data, (data) => {
	    /* check for success */
	    if (data.success == true) {
		/*
		 * prob too much but fine for now
		 * one possible solution would be to just create the new
		 * object here
		 * */
		$.get("/api/friend-requests", (reqs, status) => {
		    Actions.update_friend_requests(reqs);
		});
	    }
	});
    }

    function unfriend() {
	/*
	 * unfriend someone
	 * I guess who is who is irrelevant here since we need
	 * to unfriend both ways
	 * */
	let post_data = {
	    from: auth_data.uid,
	    to: user_data.uid
	};
	$.post("/unfriend", post_data, (data) => {
	    if (data.success == true) {
		/* only friend list changes */
		$.get("/api/update-auth", (auth, status) => {
		    Actions.update_auth(auth);
		});
	    }
	});
    }

    function accept_request() {
	/* accept friend request */
	let post_data = {
	    from: user_data.uid,
	    to: auth_data.uid
	};
	$.post("/accept-friend", post_data, (data) => {
	    /* check for success */
	    if (data.success == true) {
		/*
		 * same as above
		 * we need to update auth_data.friends and friend_requests
		 * a simpler solution might be used here
		 * */
		$.get("/api/friend-requests", (reqs, status) => {
		    Actions.update_friend_requests(reqs);
		});
		$.get("/api/update-auth", (auth, status) => {
		    Actions.update_auth(auth);
		});
	    }
	});
    }

    function reject_request() {
	/* reject friend request */
	let post_data = {
	    from: user_data.uid,
	    to: auth_data.uid
	};
	$.post("/reject-friend", post_data, (data) => {
	    /* check for success */
	    if (data.success == true) {
		$.get("/api/friend-requests", (reqs, status) => {
		    Actions.update_friend_requests(reqs);
		});
	    }
	});
    }

    function is_friend(friends, uid) {
	/*
	 * function that checks if uid is in list of friends
	 * TODO test this
	 * */
	for (let i in friends) {
	    if (friends[i].id == uid)
		return true;
	}
	return false;
    }

    const add_friend_btn = (
	<button id="add-friend-btn" className="form-group btn btn-primary"
		onClick={add_friend}>
	  <span id="plus-icon" className="glyphicon glyphicon-plus">
	  </span>
	  <span className="separator"></span>
	  Add Friend
	</button>
    );
    const unfriend_btn = (
	<button id="unfriend-btn" className="form-group btn btn-primary"
		onClick={unfriend}>
	  Unfriend
	</button>
    );
    const friend_btn = (
	<button id="friend-btn" className="form-group btn btn-primary"
		disabled>
	  <span id="ok-icon" className="glyphicon glyphicon-ok">
	  </span>
	  <span className="separator"></span>
	  Friends
	</button>
    );
    const friend_request_btn = (
	<button id="friend-request-btn" className="form-group btn btn-primary"
		disabled>
	  Friend Request Sent
	</button>
    );
    const accept_friend_request_btn = (
	<button id="accept-friend-request-btn"
		className="form-group btn btn-primary"
		onClick={accept_request}>
	  Accept Friend Request
	</button>
    );
    const reject_friend_request_btn = (
	<button id="reject-friend-request-btn"
		className="form-group btn btn-primary"
		onClick={reject_request}>
	  Reject Friend Request
	</button>
    );
    const message_btn = (
	<button id="message-btn" className="form-group btn btn-primary">
	  Message
	</button>
    );
    let buttons;
    /*
     * TODO cheap trick to find out if we have all the data we need to
     * show buttons
     * */
    if (user_data.uid == "") {
	buttons = "";
    }
    else if (user_data.uid == auth_data.uid) {
	buttons = "";
    } else if (is_friend(auth_data.friends, user_data.uid)) {
	buttons = (
	    <div>
	      {friend_btn}
	      {unfriend_btn}
	      {message_btn}
	    </div>
	);
    } else {
	let friend_req = false;
	for (let i in friend_requests) {
	    if (friend_requests[i].from.id == user_data.uid) {
		/* if we received a friend request from this user */
		if (friend_requests[i].status == "rejected") {
		    buttons = (
			<div>
			  {message_btn}
			</div>
		    );
		} else {
		    buttons = (
			<div>
			  {accept_friend_request_btn}
			  {reject_friend_request_btn}
			  {message_btn}
			</div>
		    );
		}
		friend_req = true;
		break;
	    } else if (friend_requests[i].to.id == user_data.uid) {
		/* if we sent a friend request to this user */
		if (friend_requests[i].status == "rejected") {
		    buttons = (
			<div>
			  {message_btn}
			</div>
		    );
		} else {
		    buttons = (
			<div>
			  {friend_request_btn}
			  {message_btn}
			</div>
		    );
		}
		friend_req = true;
		break;
	    }
	}
	if (friend_req == false) {
	    buttons = (
		<div>
		  {add_friend_btn}
		  {message_btn}
		</div>
	    );
	}
    }

    return (
	<div id="about-view">
	  <div className="modal" id="avatar-modal">
	    <div className="modal-dialog modal-content">
	      <div className="modal-body avatar-modal-body">
		<img id="avatar-full-size" src={user_data.avatarUrl}/>
		<span className="close"
		      onClick={avatar_close}>x</span>
	      </div>
	    </div>
	  </div>

	  <div id="top-about">
	    <img id="profile-picture" src={user_data.avatarUrl}
		 onClick={avatar_click} />
	    <div id="name-div">
	      <div id="name">
		{user_data.firstName + " " + user_data.lastName}
	      </div>
	      {buttons}
	    </div>
	  </div>

	  <div id="other-info">
	    <div id="about-me" className="info-item">
	      About me:
	    </div>
	    <div id="email" className="info-item">
	      Email: {user_data.email}
	    </div>
	    <div id="type" className="info-item">
	      Type: {user_data.type}
	    </div>
	    <div id="gender" className="info-item">
	      Gender: {user_data.gender}
	    </div>
	    <div id="bday" className="info-item">
	      Birthday: {user_data.birthday}
	    </div>
	  </div>
	</div>
    );
}

export default AboutView;
