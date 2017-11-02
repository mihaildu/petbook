/*
 * store used on the welcome page
 *
 * it stores flash messages and values
 * */
import {ReduceStore} from "flux/utils";
import Immutable from "immutable";

import PetbookDispatcher from "./PetbookDispatcher";
import {ActionTypes} from "./PetbookActions";

class WelcomeStore extends ReduceStore {
    constructor() {
	super(PetbookDispatcher);
    }
    getInitialState() {
	return Immutable.OrderedMap({
	    messages: [],
	    values: {first_name_signup: undefined}
	});
    }
    reduce(state, action) {
	switch(action.type) {
	case ActionTypes.UPDATE_MESSAGES:
	    return state.set("messages", action.messages);
	case ActionTypes.UPDATE_VALUES:
	    return state.set("values", action.values);
	default:
	    return state;
	}
    }
}

export default new WelcomeStore();
