import PetbookDispatcher from "./PetbookDispatcher";

const ActionTypes = {
    UPDATE_MESSAGES: "UPDATE_MESSAGES",
    UPDATE_VALUES: "UPDATE_VALUES"
};

const Actions = {
    update_messages(messages) {
	PetbookDispatcher.dispatch({
	    type: ActionTypes.UPDATE_MESSAGES,
	    messages
	});
    },
    update_values(values) {
	PetbookDispatcher.dispatch({
	    type: ActionTypes.UPDATE_VALUES,
	    values
	});
    }
};

export {ActionTypes, Actions};
