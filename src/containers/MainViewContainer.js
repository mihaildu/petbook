import {Container} from "flux/utils";

import MainView from "../views/MainView";
import MainStore from "../data/MainStore";

/* connect the store to the view */
function getStores() {
    return [MainStore];
}
function getState() {
    return {
	main_store: MainStore.getState()
    };
}

export default Container.createFunctional(MainView, getStores, getState);
