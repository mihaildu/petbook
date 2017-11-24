/*
 * The popup chat windows at the bottom
 *
 * The reason I use a class component here instead of a functional
 * one is to be able to run code after the component has rendered;
 * that is to have access to componentDidUpdate where I can update
 * the scroll window to bottom
 *
 * TODO add "Send" button for mobile or do something
 * about it
 * */
import React from "react";

import {Actions} from "../data/PetbookActions";
import {socket} from "../chat";

class PopupChatView extends React.Component {

    constructor(props) {
	/*
	 * props:
	 *   popup_chats:
	 *     [{id, firstName, lastName, avatarUrl, messages, ...}]
	 *     popup_chats[].messages:
	 *       [{firstName, lastName, avatarUrl, message}]
	 * */
	super(props);
    }

    remove_popup_window(uid) {
	/* removes popup_window after friend id */
	Actions.remove_popup(uid);
    }

    on_change(event, popup) {
	if (event.target.value == "") {
	    /* this might not be needed */
	    Actions.change_me_typing_popup({uid: popup.uid, typing: false});
	    /* notify other user that I stopped typing */
	    socket.emit("typing", {uid: popup.uid, typing: false});
	} else if (popup.me_typing == false) {
	    Actions.change_me_typing_popup({uid: popup.uid, typing: true});
	    socket.emit("typing", {uid: popup.uid, typing: true});
	}
    }

    key_down(event, popup) {
	const ENTER_KEY_CODE = 13;
	if (event.keyCode === ENTER_KEY_CODE) {
	    if (event.target.value != "") {
		/* send message via websocket */
		let msg = {
		    from: this.props.auth_data.uid,
		    to: popup.uid,
		    firstName: this.props.auth_data.firstName,
		    lastName: this.props.auth_data.lastName,
		    message: event.target.value
		};
		socket.emit("chat", msg);

		/* add it to the popup window */
		msg.pid = popup.uid;
		Actions.add_message_popup(msg);

		/* clear input text area */
		$("#input-" + popup.uid).val("");

		/* user is not typing anymore */
		Actions.change_me_typing_popup({uid: popup.uid,
						typing: false});
		socket.emit("typing", {uid: popup.uid, typing: false});
	    }
	}
    }

    num_popup_windows() {
	/*
	 * number of popup windows that can be displayed
	 * TODO get some of these values from CSS?
	 * everything except screen_margin should be taken from CSS
	 * */
	let screen_margin = 200;
	let popup_window_width = 300;
	let popup_window_space = 50;
	let threshold = window.innerWidth -
		(2 * screen_margin + popup_window_width);
	if (threshold < 0) {
	    return 0;
	}
	return 1 + parseInt(threshold /
			    (popup_window_width + popup_window_space));
    }

    componentDidUpdate() {
	/* update scroll window to bottom */
	let popup_messages = $(".popup-messages");
	for (let i = 0; i < popup_messages.length; i++) {
	    popup_messages[i].scrollTop = popup_messages[i].scrollHeight;
	}
    }

    render() {
	/*
	 * limit the number of chat windows to the first 3
	 * TODO
	 * add some "..." tab or sort after last message timestamp
	 * also, render this component again on window resize
	 * also, make margin % of total width
	 * */
	let {popup_chats, auth_data} = this.props;
	let max_popup_windows = this.num_popup_windows();
	if (popup_chats.length > max_popup_windows) {
	    popup_chats = popup_chats.slice(0, max_popup_windows);
	}

	let right_margin = 200;
	const popup_chats_elems = popup_chats.map(popup => {
	    const div_style = {
		right: right_margin.toString() + "px"
	    };
	    right_margin += 350;

	    let mid = 0;
	    const messages = popup.messages.map(message => {
		let message_author;
		/*
		 * TODO
		 * maybe change these with divs with different background
		 * colors with border-radius, aligned to different sides
		 * and maybe add avatarUrl + name as title
		 * */
		if (message.from == auth_data.uid) {
		    message_author = (
			<span
			   className="popup-message-self popup-message-author">
			  {"You: "}
			</span>
		    );
		} else {
		    message_author = (
			<span
			   className="popup-message-other popup-message-author">
			  {message.firstName + " " + message.lastName + ": "}
			</span>
		    );
		}
		return (
		    <div className="popup-message" key={mid++}>
		      {message_author}
		      <span className="popup-message-text">
			{message.message}
		      </span>
		    </div>
		);
	    });
	    let is_typing;
	    if (popup.other_typing == true) {
		is_typing = (
		    <div className="popup-message">
		      <span className="popup-typing-text">
			{popup.firstName + " " + popup.lastName +
			" is typing a message..."}
		      </span>
		    </div>
		);
	    } else {
		is_typing = "";
	    }
	    return (
		<div id={"popup-" + popup.uid} style={div_style}
		     className="popup-chat-window" key={popup.uid}>
		  <div className="popup-head">
		    <a href={"/user/" + popup.uid}>
		      {popup.firstName + " " + popup.lastName}
		    </a>
		    <span className="popup-close-icon"
			  onClick={(e) => this.remove_popup_window(popup.uid)}>
		      X
		    </span>
		  </div>
		  <div className="popup-messages">
		    {messages}
		    {is_typing}
		  </div>
		  <input type="text" className="popup-text form-control"
			 placeholder="Say something..."
			 onChange = {(e) => this.on_change(e, popup)}
			 id={"input-" + popup.uid}
			 onKeyDown={(e) => this.key_down(e, popup)} />
		</div>
	    );
	});
	return (
	    <div id="chat-popup-area">
	      {popup_chats_elems}
	    </div>
	);
    }
}

export default PopupChatView;
