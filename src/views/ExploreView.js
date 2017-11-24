/*
 * The explore page where you can see all the users
 * */

import React from "react";

import {Actions} from "../data/PetbookActions";
import Navbar from "./Navbar";
import PopupChatView from "./PopupChatView";

function ExploreView(props) {
    const auth_data = props.main_store.get("auth");
    const user_list = props.main_store.get("users");
    const friend_requests = props.main_store.get("friend_requests");
    const unseen_messages = props.main_store.get("unseen_messages");
    const popup_chats = props.main_store.get("popup_chats");
    const users = user_list.map(user => {
	return (
	    <div key={user.id} className="user-div">
	      <a title={user.firstName + " " + user.lastName}
		 href={"/user/" + user.id}>
		<img src={user.avatarUrl} id={"img-" + user.id}
		     className="user-img" />
	      </a>
	      <a className="user-name" href={"/user/" + user.id}>
		{user.firstName + " " + user.lastName}
	      </a>
	    </div>
	);
    });

    return (
	<div>
	  <Navbar logo="img" login={false} auth={auth_data}
		  friend_requests={friend_requests}
		  unseen_messages={unseen_messages} />
	  <div id="clear-navbar"></div>
	  <div className="container">
	    <div id="users">
	      {users}
	    </div>
	  </div>
	  <PopupChatView auth_data={auth_data} popup_chats={popup_chats} />
	</div>
    );
}

export default ExploreView;
