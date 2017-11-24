import React from "react";
import ReactDOM from "react-dom";

import ExploreViewContainer from "./containers/ExploreViewContainer";
import {Actions} from "./data/PetbookActions";
import {connect_to_socket} from "./chat";

$.get("/api/auth", function(auth, status){
    Actions.update_auth(auth);
});

$.get("/api/users", function(users, status){
    Actions.set_users(users);
});

$.get("/api/friend-requests", function(requests, status){
    Actions.update_friend_requests(requests);
});

$.get("/api/chat", function(messages, status){
    Actions.set_unseen_messages(messages);
});

/* connect to web socket for chat */
connect_to_socket();

ReactDOM.render(
    <ExploreViewContainer />,
    document.getElementById("root")
);
