/*
 * store used on the quiz page
 *
 * TODO store data here when submitting incomplete forms
 * */
import {ReduceStore} from "flux/utils";
import Immutable from "immutable";

import PetbookDispatcher from "./PetbookDispatcher";
import {ActionTypes} from "./PetbookActions";

class QuizStore extends ReduceStore {
    constructor() {
	super(PetbookDispatcher);
    }
    getInitialState() {
	return Immutable.OrderedMap();
    }
    reduce(state, action) {
	switch(action.type) {
	default:
	    return state;
	}
    }
}

export default new QuizStore();
