import React from "react";
import ReactDOM from "react-dom";

import MainViewContainer from "./containers/MainViewContainer";
import {Actions} from "./data/PetbookActions";

$.get("/api/auth", function(auth, status){
    Actions.update_auth(auth);
});

$.get("/api/posts", function(posts, status){
    Actions.set_posts(posts);
});

ReactDOM.render(
    <MainViewContainer />,
    document.getElementById("root")
);
