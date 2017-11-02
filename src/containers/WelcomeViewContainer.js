import {Container} from "flux/utils";

import WelcomeView from "../views/WelcomeView";
import WelcomeStore from "../data/WelcomeStore";

/* connect the store to the view */
function getStores() {
    return [WelcomeStore];
}
function getState() {
    return {
	welcome_store: WelcomeStore.getState()
    };
}

export default Container.createFunctional(WelcomeView, getStores, getState);
