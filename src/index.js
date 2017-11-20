import React from "react";
import ReactDOM from "react-dom";

import MainViewContainer from "./containers/MainViewContainer";
import {Actions} from "./data/PetbookActions";

/*
 * this is needed only when you accept a friend request
 * /api/auth won't read the auth from db again
 * you need the new friends list for chat side
 *
 * TODO use hooks
 * also, reading auth again is not that bad, the other
 * requests take way more time
 * */
$.get("/api/update-auth", function(auth, status){
    Actions.update_auth(auth);
});

$.get("/api/friends", function(auth, status){
    Actions.update_auth(auth);
});

$.get("/api/friend-requests", function(requests, status){
    Actions.update_friend_requests(requests);
});

$.get("/api/posts", function(posts, status){
    Actions.set_posts(posts);
});

ReactDOM.render(
    <MainViewContainer />,
    document.getElementById("root")
);
