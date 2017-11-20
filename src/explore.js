import React from "react";
import ReactDOM from "react-dom";

import ExploreViewContainer from "./containers/ExploreViewContainer";
import {Actions} from "./data/PetbookActions";

$.get("/api/auth", function(auth, status){
    Actions.update_auth(auth);
});

$.get("/api/users", function(users, status){
    Actions.set_users(users);
});

$.get("/api/friend-requests", function(requests, status){
    Actions.update_friend_requests(requests);
});

ReactDOM.render(
    <ExploreViewContainer />,
    document.getElementById("root")
);
