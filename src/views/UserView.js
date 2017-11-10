/*
 * The user page
 * */
import React from "react";

import {Actions} from "../data/PetbookActions";
import Navbar from "./Navbar";
import NewsView from "./NewsView";
import AboutView from "./AboutView";

function UserView(props) {
    /*
     * user data: {uid, firstName, lastName, email,
     *   type, gender, birthday, friends, avatarUrl}
     * */
    const auth_data = props.main_store.get("auth");
    const user_data = props.main_store.get("last_user");
    const posts_data = props.main_store.get("posts_data");
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
    else if (tab == "friends")
	posts = [];
    return (
	<div>
	  <Navbar logo="img" login={false} auth={auth_data} />
	  <div id="clear-navbar"></div>
	  <div className="container" id="main-container">
	    <div className="col-md-6">
	      <AboutView auth_data={auth_data} user_data={user_data} />
	    </div>
	    <div className="col-md-6">
	      {nav_tabs}
	      <NewsView posts={posts} auth_data={auth_data} />
	    </div>
	  </div>
	</div>
    );
}

export default UserView;
