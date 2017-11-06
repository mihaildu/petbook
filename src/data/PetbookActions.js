import PetbookDispatcher from "./PetbookDispatcher";

const ActionTypes = {
    UPDATE_MESSAGES: "UPDATE_MESSAGES",
    UPDATE_VALUES: "UPDATE_VALUES",
    UPDATE_AUTH: "UPDATE_AUTH",
    CHANGE_POST_VIEW: "CHANGE_POST_VIEW",
    SET_POSTS: "SET_POSTS"
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
    },
    update_auth(auth) {
	PetbookDispatcher.dispatch({
	    type: ActionTypes.UPDATE_AUTH,
	    auth
	});
    },
    change_post_view(view) {
	PetbookDispatcher.dispatch({
	    type: ActionTypes.CHANGE_POST_VIEW,
	    view
	});
    },
    set_posts(posts) {
	PetbookDispatcher.dispatch({
	    type: ActionTypes.SET_POSTS,
	    posts
	});
    }
};

export {ActionTypes, Actions};
