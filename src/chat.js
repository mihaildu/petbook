import {Actions} from "./data/PetbookActions";

var socket;

function connect_to_socket() {
    if (typeof(socket) != "undefined")
	return;
    /*
     * you can also use io.connect
     * socket = io.connect(window.location.href);
     * */
    socket = io();

    /* register events */
    socket.on("chat", (msg) => {
	msg.pid = msg.from;
	Actions.add_message_popup(msg);
    });
    socket.on("typing", (popup_data) => {
	Actions.change_other_typing_popup(popup_data);
    });
}

function disconnect_from_socket() {
    /*
     * this seems to disconnect from socket without
     * emitting a disconnect event
     * TODO investigate
     * */
    if (typeof(socket) == "undefined")
	return;
    socket.disconnect();
}

export {socket, connect_to_socket, disconnect_from_socket};
