/*
 * main store - user data etc
 * */
import {ReduceStore} from "flux/utils";
import Immutable from "immutable";

import PetbookDispatcher from "./PetbookDispatcher";
import {ActionTypes} from "./PetbookActions";
import {socket} from "../chat";

class MainStore extends ReduceStore {
    constructor() {
	super(PetbookDispatcher);
    }
    getInitialState() {
	/*
	 * data in this store:
	 *   auth
	 *     auth data (for logged in users)
	 *     this data can be obtained from "/api/auth"
	 *     {
	 *       uid: user id
	 *       firstName: ...,
	 *       lastName: ...,
	 *       email: ...,
	 *       password: ...,
	 *       type: ..., (pet type e.g. cat)
	 *       gender: ...,
	 *       birthday: ...,
	 *       friends: [{id: ...}, ...],
	 *       avatar: id of photo
	 *       avatarUrl: path to photo
	 *     }
	 *
	 *   posts: posts (on the wall) data
	 *     {
	 *       view: what to show Text/Picture post
	 *         "text", "pic", "timeline", "friends"
	 *         TODO this needs to be split
	 *       posts: [post, ...] list of posts to show
	 *              eventually sorted
	 *         post: {"_id", "uid", "text", "__v", "comments", "avatarUrl"}
	 *     }
	 *
	 *   last_user: user data for last user page you visited
	 *
	 *   TODO friends: [{id, avatar, etc}]
	 */
	return Immutable.OrderedMap({
	    auth: {
		uid: "",
		firstName: "",
		lastName: "",
		email: "",
		password: "",
		type: "",
		gender: "",
		birthday: "",
		friends: undefined,
		avatar: "",
		avatarUrl: ""
	    },
	    posts_data: {
		view: "text",
		posts: []
	    },
	    last_user : {
		uid: "",
		firstName: "",
		lastName: "",
		email: "",
		type: "",
		gender: "",
		birthday: "",
		friends: undefined
	    },
	    users: [],
	    friend_requests: [],
	    popup_chats: [],
	    unseen_messages : {
		cnt: 0,
		users: {}
	    }
	});
    }
    reduce(state, action) {
	/* TODO replace switch with else ifs */
	let new_posts_data, new_popup_chats, old_popup_chats, new_popup, cnt,
	    unseen_messages_users, unseen_from_msg, unseen_messages, total_cnt;
	switch(action.type) {
	case ActionTypes.UPDATE_AUTH:
	    return state.set("auth", action.auth);
	case ActionTypes.CHANGE_POST_VIEW:
	    new_posts_data = {};
	    Object.assign(new_posts_data, state.get("posts_data"));
	    new_posts_data.view = action.view;
	    return state.set("posts_data", new_posts_data);
	case ActionTypes.SET_POSTS:
	    /*
	     * if I don't do this, react will think nothing changes
	     * so no re-render
	     * */
	    new_posts_data = {};
	    Object.assign(new_posts_data, state.get("posts_data"));
	    new_posts_data.posts = action.posts;
	    return state.set("posts_data", new_posts_data);
	case ActionTypes.UPDATE_LAST_USER:
	    return state.set("last_user", action.data);
	case ActionTypes.SET_USERS:
	    return state.set("users", action.users);
	case ActionTypes.UPDATE_FRIEND_REQUESTS:
	    return state.set("friend_requests", action.requests);
	case ActionTypes.ADD_POPUP:
	    old_popup_chats = state.get("popup_chats");
	    for (let i in old_popup_chats) {
		if (action.popup.uid == old_popup_chats[i].uid) {
		    /* chat already opened for user, nothing to do */
		    return state;
		}
	    }

	    /* mark unseen messages between you and uid as seen */
	    unseen_messages = state.get("unseen_messages");
	    if (action.popup.uid in unseen_messages.users) {
		unseen_messages.cnt = unseen_messages.cnt -
		    unseen_messages.users[action.popup.uid].cnt;
		delete unseen_messages.users[action.popup.uid];
	    }
	    let new_state = state.set("unseen_messages", unseen_messages);

	    /* post to server to update db as well */
	    $.post("/read-chat", {from: action.popup.uid}, (res) => {
		/* TODO maybe log an error here */
	    });

	    /* add the new popup */
	    new_popup_chats = old_popup_chats.slice();
	    new_popup = {};
	    Object.assign(new_popup, action.popup);
	    new_popup_chats.push(new_popup);

	    /* notify server we have a new popup for uid */
	    socket.emit("popup_open", {uid: action.popup.uid});

	    return new_state.set("popup_chats", new_popup_chats);

	case ActionTypes.REMOVE_POPUP:
	    old_popup_chats = state.get("popup_chats");
	    for (let i in old_popup_chats) {
		if (action.uid == old_popup_chats[i].uid) {
		    new_popup_chats = old_popup_chats.slice();
		    new_popup_chats.splice(i, 1);
		    socket.emit("popup_close", {uid: action.uid});
		    return state.set("popup_chats", new_popup_chats);
		}
	    }
	    return state;
	case ActionTypes.ADD_MESSAGE_POPUP:
	    old_popup_chats = state.get("popup_chats");
	    for (let i in old_popup_chats) {
		if (action.message.pid == old_popup_chats[i].uid) {
		    new_popup_chats = old_popup_chats.slice();
		    new_popup_chats[i].messages.push(action.message);
		    return state.set("popup_chats", new_popup_chats);
		}
	    }
	    /*
	     * TODO
	     * if message.to = me (state.get("auth")...)
	     * then I didn't have the popup opened => get new message
	     * from db and show notification
	     * */
	    return state;
	case ActionTypes.CHANGE_ME_TYPING_POPUP:
	    old_popup_chats = state.get("popup_chats");
	    for (let i in old_popup_chats) {
		if (action.popup_data.uid == old_popup_chats[i].uid) {
		    /* TODO long lines */
		    if (old_popup_chats[i].me_typing != action.popup_data.typing) {
			new_popup_chats = old_popup_chats.slice();
			new_popup_chats[i].me_typing = action.popup_data.typing;
			return state.set("popup_chats", new_popup_chats);
		    }
		    break;
		}
	    }
	    return state;
	case ActionTypes.CHANGE_OTHER_TYPING_POPUP:
	    old_popup_chats = state.get("popup_chats");
	    for (let i in old_popup_chats) {
		if (action.popup_data.uid == old_popup_chats[i].uid) {
		    /* TODO long lines */
		    if (old_popup_chats[i].other_typing != action.popup_data.typing) {
			new_popup_chats = old_popup_chats.slice();
			new_popup_chats[i].other_typing = action.popup_data.typing;
			return state.set("popup_chats", new_popup_chats);
		    }
		    break;
		}
	    }
	    return state;
	case ActionTypes.SET_UNSEEN_MESSAGES:
	    /* first, count how many unseen messages there are */
	    total_cnt = 0;
	    unseen_messages_users = {};
	    for (let uid in action.messages) {
		cnt = 0;
		unseen_from_msg = false;
		action.messages[uid].messages.forEach(msg => {
		    if ((msg.from == uid) && (msg.seen == false)) {
			cnt++;
			unseen_from_msg = true;
		    }
		});
		if (unseen_from_msg == true) {
		    unseen_messages_users[uid] = {
			firstName: action.messages[uid].firstName,
			lastName: action.messages[uid].lastName,
			avatar: action.messages[uid].avatar,
			avatarUrl: action.messages[uid].avatarUrl,
			cnt: cnt
		    };
		}
		total_cnt += cnt;
	    }
	    return state.set("unseen_messages",
			     {cnt: total_cnt, users: unseen_messages_users});
	default:
	    return state;
	}
    }
}

export default new MainStore();
