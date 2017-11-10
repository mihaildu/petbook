import React from "react";
import ReactDOM from "react-dom";

import UserViewContainer from "./containers/UserViewContainer";
import {Actions} from "./data/PetbookActions";

$.get("/api/auth", function(auth, status){
    Actions.update_auth(auth);
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

ReactDOM.render(
    <UserViewContainer />,
    document.getElementById("root")
);
