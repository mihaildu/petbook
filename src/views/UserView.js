/*
 * The user page
 * */
import React from "react";

import {Actions} from "../data/PetbookActions";
import Navbar from "./Navbar";
import NewsView from "./NewsView";
import AboutView from "./AboutView";
import PopupChatView from "./PopupChatView";

function UserView(props) {
    /*
     * user data: {uid, firstName, lastName, email,
     *   type, gender, birthday, friends, avatarUrl}
     * */
    const auth_data = props.main_store.get("auth");
    const user_data = props.main_store.get("last_user");
    const posts_data = props.main_store.get("posts_data");
    const friend_requests = props.main_store.get("friend_requests");
    const popup_chats = props.main_store.get("popup_chats");
    const tab = posts_data.view;

    function change_post_view(event, dest) {
	if (dest != tab)
	    Actions.change_post_view(dest);
    }

    /*
     * TODO for now timeline = text
     * I should use a different variable to store this info
     * */
    /* className={tab === "text" ? "active" : ""} */
    const nav_tabs = (
	<ul className="nav nav-tabs" id="news-header">
	  <li id="text-li" role="presentation"
	      className={tab == "text" ? "active" : ""}>
	    <a onClick={(e) => change_post_view(e, "text")}>
	      Timeline
	    </a>
	  </li>
	  <li id="pic-li" role="presentation"
	      className={tab === "pic" ? "active" : ""}>
	    <a onClick={(e) => change_post_view(e, "pic")}>
	      Pictures
	    </a>
	  </li>
	  <li id="pic-li" role="presentation"
	      className={tab === "friends" ? "active" : ""}>
	    <a onClick={(e) => change_post_view(e, "friends")}>
	      Friends
	    </a>
	  </li>
	</ul>
    );
    let posts;
    if (tab == "text") {
	posts = posts_data.posts;
    }
    if (tab === "pic") {
	posts = posts_data.posts.filter((elem) => {
	    return (elem.isText === false);
	});
    }
    let wall_view;
    if (tab == "friends") {
	if (user_data.friends === undefined) {
	    /* data is not ready yet */
	    wall_view = "";
	} else if (user_data.friends.length == 0) {
	    /*
	     * TODO
	     * maybe check for auth_data.uid and user_data.uid
	     * if same id, show "you have no friends, explore..."
	     * */
	    wall_view = (
		<div id="user-no-friends-txt">
		  This person has no friends.
		</div>
	    );
	} else if (typeof(user_data.friends[0].firstName) != "undefined") {
	    /*
	     * TODO
	     * for now this looks good
	     * later - add "Add Friend" & "Message" button
	     * or switch to only avatars (similar to explore)
	     *
	     * also, some checkings - is this me?
	     * */
	    let friends = user_data.friends.map(friend => {
		return (
		    <div key={friend.id} className="user-friend-item">
		      <img src={friend.avatarUrl}
			   className="user-friend-avatar" />
		      <a className="user-friend-name"
			 href={"/user/" + friend.id}>
			{friend.firstName + " " + friend.lastName}
		      </a>
		    </div>
		);
	    });
	    wall_view = (
		<div id="user-friend-list">
		  {friends}
		</div>
	    );
	} else {
	    /* data not ready or error */
	    wall_view = "";
	}
    } else {
	wall_view = <NewsView posts={posts} auth_data={auth_data} />;
    }
    return (
	<div>
	  <Navbar logo="img" login={false} auth={auth_data}
		  friend_requests={friend_requests} />
	  <div id="clear-navbar"></div>
	  <div className="container" id="main-container">
	    <div className="col-md-6">
	      <AboutView auth_data={auth_data} user_data={user_data}
			 friend_requests={friend_requests} />
	    </div>
	    <div className="col-md-6">
	      {nav_tabs}
	      {wall_view}
	    </div>
	  </div>
	  <PopupChatView auth_data={auth_data} popup_chats={popup_chats} />
	</div>
    );
}

export default UserView;
