/*
 * the about view on user page
 *
 * should show info from db + avatar picture
 * */
import React from "react";

function AboutView(props) {

    function avatar_close() {
	$("#avatar-modal").modal("hide");
    }
    function avatar_click() {
	let img_elem = document.getElementById("avatar-full-size");
	let new_width = img_elem.naturalWidth + 2;
	$("#avatar-modal").find(".modal-dialog").css("width", new_width);
	$("#avatar-modal").modal("show");
    }

    return (
	<div id="about-view">
	  <div className="modal" id="avatar-modal">
	    <div className="modal-dialog modal-content">
	      <div className="modal-body">
		<img id="avatar-full-size" src={props.user_data.avatarUrl}/>
		<span className="close"
		      onClick={avatar_close}>x</span>
	      </div>
	    </div>
	  </div>
	  <img id="profile-picture" src={props.user_data.avatarUrl}
	       onClick={avatar_click} />
	  <span id="name">
	    {props.user_data.firstName + " " + props.user_data.lastName}
	  </span>
	  <div id="other-info">
	    <div id="about-me" className="info-item">
	      About me:
	    </div>
	    <div id="email" className="info-item">
	      Email: {props.user_data.email}
	    </div>
	    <div id="type" className="info-item">
	      Type: {props.user_data.type}
	    </div>
	    <div id="gender" className="info-item">
	      Gender: {props.user_data.gender}
	    </div>
	    <div id="bday" className="info-item">
	      Birthday: {props.user_data.birthday}
	    </div>
	  </div>
	</div>
    );
}

export default AboutView;
