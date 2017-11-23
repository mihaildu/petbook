/*
 * the news area that is part of the wall
 *
 * it should have a list of posts by you and friends, sorted by timestamp
 * */
import React from "react";

function NewsView(props) {
    /*
     * props.posts:
     *   [{id, uid, text, avatar, comments, avatarUrl, ...TODO}, ...]
     * */

    /*
     * only allow for 6 lines of text in each post
     * if there are more, show "Read more..." and
     * expand if clicked
     *
     * TODO better way to check for overflow
     * */
    const max_lines = 6;
    /* variable to control edit state */
    let edit_mode = false;
    /* date options e.g. "Sun, Nov 5, 11:34 PM" */
    const date_options = {
	weekday: "short",
	month: "short",
	day: "numeric",
	hour: "numeric",
	minute: "numeric",
	hour12: true
    };

    function delete_post(event, id) {
	let elem_id = "#" + id;
	$(elem_id).find(".delete-post-form").submit();
    }

    function edit_post(event, id) {
	/* if already in edit mode do nothing */
	if (edit_mode === true) {
	    return;
	}
	edit_mode = true;

	/* hide both full-text and short-text */
	let elem_id = "#" + id;
	let full_text_div = $(elem_id).find(".full-text");
	let short_text_div = $(elem_id).find(".short-text");
	full_text_div.hide();
	short_text_div.hide();

	/* update edit-text and show it */
	let edit_text_div = $(elem_id).find(".edit-text");
	let edit_textarea = edit_text_div.find("#edit-textarea");
	let post_text;
	for (let key in props.posts) {
	    if (props.posts[key].id == id) {
		post_text = props.posts[key].text;
		break;
	    }
	}
	edit_textarea.val(post_text);
	edit_text_div.show();
    }

    function cancel_edit(event, id) {
	/* prevent post from submitting */
	event.preventDefault();

	/* nothing to do if cancel mode is off */
	if (edit_mode === false) {
	    return;
	}
	edit_mode = false;

	/* hide edit-text, show short_text */
	let elem_id = "#" + id;
	let edit_text_div = $(elem_id).find(".edit-text");
	let short_text_div = $(elem_id).find(".short-text");
	edit_text_div.hide();
	short_text_div.show();
    }

    function handle_read_more(event, id) {
	/* jquery to show/hide divs */
	event.preventDefault();
	let elem_id = "#" + id;
	$(elem_id).find(".short-text").hide();
	$(elem_id).find(".full-text").show();
    }

    function image_click(id) {
	let modal_id = "#img-modal-" + id;
	let img_elem = document.getElementById("img-" + id);
	/*
	 * take min between 95% * device_width and image width
	 * TODO I think window.innerWidth might be better
	 * test with it
	 * */
	let new_width = Math.min(img_elem.naturalWidth + 2,
				 (95 * window.screen.width) / 100);
	/*
	 * TODO this should be done only once
	 * maybe run once after page finished loading
	 * */
	$(modal_id).find(".modal-dialog").css("width", new_width);
	$(modal_id).modal("show");
    }

    function image_close(id) {
	let modal_id = "#img-modal-" + id;
	$(modal_id).modal("hide");
    }

    /* TODO auto-scrolling or limit the number of posts/make pages */
    const posts = props.posts.map(post => {
	if (post.photo === null)
	    post.photo = "";

	let id = 0, post_image = null;
	if (post.isText === false) {
	    /* TODO make sure the image works fine on mobile */
	    post_image = (
		<div>
		  <div className="modal img-modal" id={"img-modal-" + post.id}>
		    <div className="modal-dialog modal-content">
		      <div className="modal-body img-modal-body">
			<img id={"img-" + post.id} src={post.photoUrl}/>
			<span className="close"
			      onClick={(e) => image_close(post.id)}>x</span>
		      </div>
		    </div>
		  </div>
		  <div className="news-img-div">
		    <img className="news-img" src={post.photoUrl}
			 onClick={(e) => image_click(post.id)} />
		  </div>
		</div>
	    );
	}
	/*
	 * format text to be displayed
	 * doing {post.text} will convert \n to spaces (as is normal)
	 * one thing I can do is to generated multiple react elements
	 * and output something like {elem1}<br/>{elem2}...
	 * */
	const formatted_text = post.text.split("\n").map(elem => {
	    return (
		<span key={id++}>
		  {elem}
		  <br />
		</span>
	    );
	});
	let display_text;
	if (formatted_text.length > max_lines) {
	    display_text = (
		<span>
		  {formatted_text.slice(0, max_lines)}
		  <a href="" onClick={(e) => handle_read_more(e, post.id)}>
		    Read more...
		  </a>
		</span>
	    );
	} else {
	    display_text = formatted_text;
	}
	const timestamp = new Date(post.timestamp).toLocaleString(
	    "en-US", date_options);
	let edit_icon = null, delete_icon = null;
	if (post.uid == props.auth_data.uid) {
	    edit_icon = (
		<span className="glyphicon glyphicon-edit edit-post"
		      title="Edit"
		      onClick={(e) => edit_post(e, post.id)}>
		</span>
	    );
	    delete_icon = (
		<form method="post" className="delete-post-form">
		  <span className="glyphicon glyphicon-remove delete-post"
			title="Delete"
			onClick={(e) => delete_post(e, post.id)}>
		  </span>
		  <input type="hidden" name="pid" value={post.id} />
		  <input type="hidden" name="isText" value={post.isText} />
		  <input type="hidden" name="photo_id" value={post.photo} />
		  <input type="hidden" name="photo_url" value={post.photoUrl}/>
		  <input type="hidden" name="submit_delete_post"/>
		</form>
	    );
	}
	return (
	    <div id={post.id} key={post.id}
		 className="news-post">
	      <div className="news-header">
		<img src={post.avatarUrl} className="news-avatar" />
		<a className="post-author" href={"/user/" + post.uid}>
		  {post.firstName + " " + post.lastName}
		</a>
		<div className="news-date">
		  {timestamp}
		</div>
		{edit_icon}
		{delete_icon}
	      </div>
	      <div className="news-body">
		<div className="full-text">
		  {formatted_text}
		</div>
		<div className="short-text">
		  {display_text}
		</div>
		<div className="edit-text">
		  <form method="post" className="edit-post-form">
		    <input type="hidden" name="pid" value={post.id} />
		    <input type="hidden" name="isText" value={post.isText} />
		    <input type="hidden" name="photo_id" value={post.photo} />
		    <textarea className="form-control" name="edit_text"
			      id="edit-textarea">
		    </textarea>
		    <div className="save-btn-wrapper">
		      <button name="submit_save_post"
			      type="submit" id="save-btn"
			      className="form-group btn btn-primary">
			Save
		      </button>
		      <button name="cancel_edit" id="cancel-btn"
			      className="form-group btn btn-primary"
			      onClick={(e) => cancel_edit(e, post.id)}>
			Cancel
		      </button>
		    </div>
		  </form>
		</div>
		{post_image}
	      </div>
	    </div>
	);
    });
    return (
	<div id="news-view" className="text-centered">
	  {posts}
	</div>
    );
}

export default NewsView;
