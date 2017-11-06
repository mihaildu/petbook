/*
 * main store - user data etc
 * */
import {ReduceStore} from "flux/utils";
import Immutable from "immutable";

import PetbookDispatcher from "./PetbookDispatcher";
import {ActionTypes} from "./PetbookActions";

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
	 *       friends: [...],
	 *       avatar: id of photo
	 *       avatarUrl: path to photo
	 *     }
	 *
	 *   posts: posts (on the wall) data
	 *     {
	 *       view: what to show Text/Picture post
	 *       posts: [post, ...] list of posts to show
	 *              eventually sorted
	 *         post: {"_id", "uid", "text", "__v", "comments", "avatarUrl"}
	 *     }
	 *
	 *   TODO friends: [{id, avatar, etc}]
	 */
	return Immutable.OrderedMap({
	    auth: {},
	    posts_data: {
		view: "text",
		posts: []
	    }
	});
    }
    reduce(state, action) {
	let new_posts_data;
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
	default:
	    return state;
	}
    }
}

export default new MainStore();
