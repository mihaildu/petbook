import PetbookDispatcher from "./PetbookDispatcher";

const ActionTypes = {
    UPDATE_MESSAGES: "UPDATE_MESSAGES",
    UPDATE_VALUES: "UPDATE_VALUES",
    UPDATE_AUTH: "UPDATE_AUTH",
    CHANGE_POST_VIEW: "CHANGE_POST_VIEW",
    SET_POSTS: "SET_POSTS",
    UPDATE_LAST_USER: "UPDATE_LAST_USER",
    SET_USERS: "SET_USERS",
    UPDATE_FRIEND_REQUESTS: "UPDATE_FRIEND_REQUESTS",
    ADD_POPUP: "ADD_POPUP",
    REMOVE_POPUP: "REMOVE_POPUP",
    ADD_MESSAGE_POPUP: "ADD_MESSAGE_POPUP",
    CHANGE_ME_TYPING_POPUP: "CHANGE_ME_TYPING_POPUP",
    CHANGE_OTHER_TYPING_POPUP: "CHANGE_OTHER_TYPING_POPUP"
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
    },
    update_last_user(data) {
	PetbookDispatcher.dispatch({
	    type: ActionTypes.UPDATE_LAST_USER,
	    data
	});
    },
    set_users(users) {
	PetbookDispatcher.dispatch({
	    type: ActionTypes.SET_USERS,
	    users
	});
    },
    update_friend_requests(requests) {
	PetbookDispatcher.dispatch({
	    type: ActionTypes.UPDATE_FRIEND_REQUESTS,
	    requests
	});
    },
    add_popup(popup) {
	PetbookDispatcher.dispatch({
	    type: ActionTypes.ADD_POPUP,
	    popup
	});
    },
    remove_popup(uid) {
	PetbookDispatcher.dispatch({
	    type: ActionTypes.REMOVE_POPUP,
	    uid
	});
    },
    add_message_popup(message) {
	PetbookDispatcher.dispatch({
	    type: ActionTypes.ADD_MESSAGE_POPUP,
	    message
	});
    },
    change_me_typing_popup(popup_data) {
	PetbookDispatcher.dispatch({
	    type: ActionTypes.CHANGE_ME_TYPING_POPUP,
	    popup_data
	});
    },
    change_other_typing_popup(popup_data) {
	PetbookDispatcher.dispatch({
	    type: ActionTypes.CHANGE_OTHER_TYPING_POPUP,
	    popup_data
	});
    }
};

export {ActionTypes, Actions};
