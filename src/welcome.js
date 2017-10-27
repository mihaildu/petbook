import React from "react";
import ReactDOM from "react-dom";

import WelcomeView from "./views/WelcomeView";

/*
 * no need to use flux for the welcome page, at least for now
 * no data stored, just a login and signup forms for which
 * we want the default action
 * */
ReactDOM.render(
    <WelcomeView />,
    document.getElementById("root")
);
