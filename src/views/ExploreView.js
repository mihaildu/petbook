/*
 * The explore page where you can see all the users
 * */

import React from "react";

import {Actions} from "../data/PetbookActions";
import Navbar from "./Navbar";

function ExploreView(props) {
    const auth_data = props.main_store.get("auth");
    const user_list = props.main_store.get("users");
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
	  <Navbar logo="img" login={false} auth={auth_data} />
	  <div id="clear-navbar"></div>
	  <div className="container">
	    <div id="users">
	      {users}
	    </div>
	  </div>
	</div>
    );
}

export default ExploreView;
