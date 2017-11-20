/*
 * the chat bar on the right in the main view
 *
 * this should have a list of friends (both online and offline)
 * */
import React from "react";

function ChatView(props) {
    /*
     * props.auth_data.friends:
     *   [{id, firstName, lastName, avatar, avatarUrl}, ...]
     * */
    function friend_click(friend) {
	// open chat between you and friend.id
	alert(friend.firstName + " " + friend.lastName);
    }

    let {auth_data} = props;
    let friends_list;
    if (auth_data.friends === undefined) {
	/* data is not ready yet */
	friends_list = "";
    } else if (auth_data.friends.length == 0) {
	friends_list = (
	    <div id="chat-no-friends-txt">
	      You have no friends. <a href="/explore">Explore</a> petbook
	      to find new friends!
	    </div>
	);
    } else if (typeof(auth_data.friends[0].firstName) != "undefined") {
	let friends = props.auth_data.friends.map(friend => {
	    return (
		<div key={friend.id} className="chat-friend-wrapper">
		  <div className="chat-friend-item"
		       onClick={(e) => friend_click(friend)}>
		    <img src={friend.avatarUrl}
			 className="chat-friend-avatar" />
		    <span className="chat-friend-name">
		      {friend.firstName + " " + friend.lastName}
		    </span>
		  </div>
		</div>
	    );
	});
	friends_list = (
	    <div id="chat-friends-list">
	      {friends}
	    </div>
	);
    } else {
	/* data not ready or error */
	friends_list = "";
    }
    return (
	<div>
	  <div id="chat-friend-title">Friends</div>
	  {friends_list}
	</div>
    );
}

export default ChatView;
