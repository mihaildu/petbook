import {Container} from "flux/utils";

import QuizView from "../views/QuizView";
import QuizStore from "../data/QuizStore";

/* connect the store to the view */
function getStores() {
    return [QuizStore];
}
function getState() {
    return {
	quiz_store: QuizStore.getState()
    };
}

export default Container.createFunctional(QuizView, getStores, getState);
