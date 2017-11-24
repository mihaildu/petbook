/*
 * The index/main page after you log in
 * */

import React from "react";

import {Actions} from "../data/PetbookActions";
import Navbar from "./Navbar";
import SideBarView from "./SideBarView";
import WallView from "./WallView";
import ChatView from "./ChatView";
import PopupChatView from "./PopupChatView";

function MainView(props) {
    const auth_data = props.main_store.get("auth");
    const posts_data = props.main_store.get("posts_data");
    const friend_requests = props.main_store.get("friend_requests");
    const popup_chats = props.main_store.get("popup_chats");
    const unseen_messages = props.main_store.get("unseen_messages");
    /* get all posts */
    return (
	<div>
	  <Navbar logo="img" login={false} auth={auth_data}
		  friend_requests={friend_requests}
		  unseen_messages={unseen_messages} />
	  <div id="clear-navbar"></div>
	  <div className="container" id="main-container">
	    <div className="col-md-2">
	      <SideBarView />
	    </div>
	    <div className="col-md-7">
	      <WallView posts_data={posts_data} auth_data={auth_data} />
	    </div>
	    <div className="col-md-3" id="chat-area">
	      <ChatView auth_data={auth_data} />
	    </div>
	  </div>
	  <PopupChatView auth_data={auth_data} popup_chats={popup_chats} />
	</div>
    );
}

export default MainView;
