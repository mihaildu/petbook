import React from "react";
import ReactDOM from "react-dom";

import UserViewContainer from "./containers/UserViewContainer";
import {Actions} from "./data/PetbookActions";
import {connect_to_socket} from "./chat";

$.get("/api/auth", function(auth, status){
    Actions.update_auth(auth);
});

$.get("/api/friend-requests", function(requests, status){
    Actions.update_friend_requests(requests);
});

$.get("/api" + window.location.pathname, function(data, status){
    Actions.update_last_user(data);
});

/* this assumes path is /user/id */
const uid = window.location.pathname.split("/")[2];
$.get("/api/posts/" + uid, function(posts, status){
    /* this is fine since we can't see our own posts anyway */
    Actions.set_posts(posts);
});

$.get("/api/chat", function(messages, status){
    Actions.set_unseen_messages(messages);
});

/* connect to web socket for chat */
connect_to_socket();

ReactDOM.render(
    <UserViewContainer />,
    document.getElementById("root")
);
