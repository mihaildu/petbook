/*
 * the bar on the left side in the main view
 *
 * some shortcuts should be placed here
 * and maybe some other things in the future
 * */
import React from "react";

function SideBarView(props) {
    /*
     * news.png taken from
     * https://www.freepik.com/free-icon/news_755689.htm
     *
     * chat.svg taken from
     * https://goo.gl/9HdzTR
     *
     * TODO move these at the top
     * */
    function handle_click(event, src) {
	/*
	 * which one is selected should be based on state
	 *
	 * this should change state and force a redraw
	 * based on what item is selected, something different
	 * should be drawn on wall/center area
	 *
	 * for now, just switch selection with jquery
	 * */
	if (src == "news") {
	    if ($("#news-li").hasClass("selected"))
		return;
	    $("#news-li").addClass("selected");
	    $("#chat-li").removeClass("selected");
	} else if (src == "chat") {
	    if ($("#chat-li").hasClass("selected"))
		return;
	    $("#chat-li").addClass("selected");
	    $("#news-li").removeClass("selected");
	}
    }
    return (
	<ul id="side-bar-list">
	  <a href="#" onClick={(e) => handle_click(e, "news")}>
	    <li id="news-li" className="selected">
	      <img src="imgs/news-white.png" id="news-image" />
	      News Feed
	    </li>
	  </a>
	  <a href="#" onClick={(e) => handle_click(e, "chat")}>
	    <li id="chat-li">
	      <img src="imgs/chat-white.png" id="chat-sidebar-image" />
	      Chat
	    </li>
	  </a>
	</ul>
    );
}

export default SideBarView;
