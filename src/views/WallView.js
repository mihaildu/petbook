/*
 * the area in the center in main view
 *
 * it should have a text area and news feed
 * news feed = posts from other friends
 * */

/* TODO get rid of href in <li>, make mouse -> pointer */
import React from "react";

import {Actions} from "../data/PetbookActions";
import NewsView from "./NewsView";

function WallView(props) {
    function file_upload_change(event) {
	/* update name of selected file */
	const uploaded_filename = $("#file-upload").prop("files")[0].name;
	$("#file-upload-target").html(uploaded_filename);
    }
    function change_post_view(event, dest) {
	/* change from/to text/pic upload */
	if (dest != props.posts_data.view)
	    Actions.change_post_view(dest);
    }
    /* main text are in post box (text tab) */
    const text_area = (
	<textarea className="form-control" name="post_text"
		  id="post-textarea" placeholder="How are you feline today?">
	</textarea>
    );
    /* main pic area in post box (picture tab) */
    const pic_area = (
	<div id="post-pic">
	  <div id="post-upload">
	    <label htmlFor="file-upload" id="custom-file-upload">
	      <div id="file-upload-btn">
		Upload
	      </div>
	      <span id="file-upload-target">No file chosen</span>
	    </label>
	    <input id="file-upload" type="file" name="file_upload"
		   accept=".jpg, .jpeg, .png"
		   onChange={file_upload_change} />
	  </div>
	  <textarea className="form-control" name="post_pic_desc"
		    id="post-pic-desc"
		    placeholder="Enter picture description"></textarea>
	</div>
    );
    let input_area, post_text;
    if (props.posts_data.view == "text") {
	input_area = text_area;
	post_text = true;
    }
    else {
	input_area = pic_area;
	post_text = false;
    }
    /* enctype="multipart/form-data" */
    return (
	<div id="wall">
	  <form method="post" id="wall-form">
	    <div id="post-box">
	      <ul className="nav nav-tabs" id="post-header">
		<li id="text-li" role="presentation"
		    className={post_text ? "active" : ""}>
		  <a href="#" onClick={(e) => change_post_view(e, "text")}>
		    Text
		  </a>
		</li>
		<li id="pic-li" role="presentation"
		    className={post_text? "" : "active"}>
		  <a href="#" onClick={(e) => change_post_view(e, "pic")}>
		    Picture
		  </a>
		</li>
	      </ul>
	      {input_area}
	      <div id="post-btn-wrapper">
		<button name="submit_post" type="submit" id="post-btn"
			className="form-group btn btn-primary">
		  Post
		</button>
	      </div>
	    </div>
	  </form>
	  <NewsView posts={props.posts_data.posts} />
	</div>
    );
}

export default WallView;
