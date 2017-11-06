/*
 * Petbook - social network in react
 *
 * Social network, for pets!
 * */
var express = require("express");
var app = express();
const port = 5000;

const qs = require("querystring");

const login = require("my-util/login.js");
const signup = require("my-util/signup.js");
const photos = require("my-util/photos.js");
const posts = require("my-util/posts.js");
const users = require("my-util/users.js");

app.set("port", (process.env.PORT || port));
app.use(express.static(__dirname + "/public"));

/* file paths for views */
const index_path = __dirname + "/views/index.html";
const welcome_path = __dirname + "/views/welcome.html";
const user_path = __dirname + "/views/user.html";

/* start session */
const session = require("express-session");
app.use(session({
    secret: "p3tZ",
    resave: false,
    saveUninitialized: true
}));

/* value variables used in several places */
const login_values = ["email_login", "password_login"];
const signup_values = ["first_name_signup", "last_name_signup", "email_signup",
		       "password_signup", "pet_type_signup",
		       "pet_gender_signup", "pet_bday_signup"];

/* welcome page */
app.get(["/", "/index", "/index.html"], function(req, res) {
    /* session didn't start, something went wrong */
    if (typeof(req.session) == "undefined"){
	throw new Error("session didn't start");
    }
    /* if user already logged in, show "index.html" */
    if (typeof(req.session["auth"]) != "undefined"){
	res.sendFile(index_path);
	return;
    }
    /* else, show "welcome.html" */
    res.sendFile(welcome_path);
});

app.post(["/", "/index", "/index.html"], function(req, res){
    /* get post data in async/flowing mode */
    let body = "";
    req.on("data", (chunk) => {
	let chunk_str = chunk.toString();
	body += chunk_str;
    });

    let post_data;
    req.on("end", () => {
	post_data = qs.parse(body);

	/* login post */
	if (typeof(post_data["submit_login"]) != "undefined"){
	    /* if user already logged in - ignore */
	    if (typeof(req.session["auth"]) != "undefined"){
		res.redirect("/");
		return;
	    }
	    /* check if post was done correctly */
	    if (!login_values.every(prop => prop in post_data)){
		console.error("incorrect post");
		res.redirect(req.url);
		return;
	    }
	    let login_data = {
		email: post_data["email_login"],
		password: post_data["password_login"]
	    };
	    login.attempt_login(login_data, req);
	    return;
	}
	/* signup post */
	if (typeof(post_data["submit_create_signup"]) != "undefined"){
	    /* if user already logged in - ignore */
	    if (typeof(req.session["auth"]) != "undefined"){
		res.redirect("/");
		return;
	    }
	    /*
	     * check if post was done correctly
	     * post_data must have all the required fields
	     *
	     * first copy the signup_values and remove pet_gender
	     * since it can be absent
	     * */
	    let required_fields = signup_values.slice();
	    const gender_index = required_fields.indexOf("pet_gender_signup");
	    required_fields.splice(gender_index, 1);
	    if (!required_fields.every(prop => prop in post_data)){
		console.error("incorrect post");
		res.redirect(req.url);
		return;
	    }
	    let signup_data = {
		firstName: post_data["first_name_signup"],
		lastName: post_data["last_name_signup"],
		email: post_data["email_signup"],
		password: post_data["password_signup"],
		type: post_data["pet_type_signup"],
		gender: post_data["pet_gender_signup"],
		birthday: post_data["pet_bday_signup"]
	    };
	    signup.attempt_signup(signup_data, req);
	    return;
	}
	/* guest account post TODO */
	if (typeof(post_data["submit_guest_signup"]) != "undefined"){
	    res.send("Guest Account");
	    return;
	}
	/* logout post */
	if (typeof(post_data["submit_logout"]) != "undefined"){
	    req.session.destroy();
	    res.redirect("/");
	    return;
	}
	/* post something on the wall */
	if (typeof(post_data["submit_post"]) != "undefined"){
	    /* if user is not logged in - nothing to submit */
	    if (typeof(req.session["auth"]) == "undefined"){
		res.redirect("/");
		return;
	    }
	    /* TODO check type of post - text or picture */
	    if (!("post_text" in post_data)) {
		console.error("incorrect post");
		res.redirect(req.url);
		return;
	    }
	    /*
	     * if text is empty - nothing to submit
	     * TODO perform this check on the frontend
	     * */
	    if (post_data["post_text"] == "") {
		res.redirect(req.url);
		return;
	    }
	    /* add user id and avatar id (for now) to data */
	    post_data["uid"] = req.session.auth["uid"];
	    post_data["avatar"] = req.session.auth["avatar"];
	    posts.submit_post(post_data, req, "post_text");
	    return;
	}
	/* delete post */
	if (typeof(post_data["submit_delete_post"]) != "undefined"){
	    /* if user is not logged in - nothing to do */
	    if (typeof(req.session["auth"]) == "undefined"){
		res.redirect("/");
		return;
	    }
	    /* this is like this for future updates */
	    if(!["pid"].every(
		prop => prop in post_data)){
		console.error("incorrect post");
		res.redirect(req.url);
		return;
	    }
	    /* add uid as well - needed for permission checking */
	    post_data["uid"] = req.session.auth["uid"];
	    posts.delete_post(post_data, req, "post_text");
	    return;
	}
	/* save post after editing */
	if (typeof(post_data["submit_save_post"]) != "undefined"){
	    /* if user is not logged in - nothing to do */
	    if (typeof(req.session["auth"]) == "undefined"){
		res.redirect("/");
		return;
	    }
	    if(!["edit_text", "pid"].every(
		prop => prop in post_data)){
		console.error("incorrect post");
		res.redirect(req.url);
		return;
	    }
	    /* add uid as well - needed for permission checking */
	    post_data["uid"] = req.session.auth["uid"];
	    posts.update_post(post_data, req, "post_text");
	    return;
	}
	/* other type of post */
	console.error("invalid post: ", post_data);
	res.redirect(req.url);
    });

    /* after login is done */
    req.once("login", (ret, args) => {
	if (ret["success"] === true){
	    /* move values from ret.session to req.session */
	    req.session.auth = {};
	    Object.assign(req.session.auth, ret.session);

	    /*
	     * get avatar path for auth.avatar id
	     * first register a callback, then wait for it
	     * */
	    req.once("avatar", (ret) => {
		if (ret["success"] == true)
		    req.session.auth["avatarUrl"] = ret["photo_url"];
		res.redirect("/");
	    });
	    photos.get_photo_url(req.session.auth.avatar, req, "avatar");
	    return;
	}

	/* save messages in req.session - flash messages */
	req.session["messages"] = ret["messages"];

	/* save post data for autofill */
	login_values.forEach(function(elem){
	     if (elem in post_data)
		 req.session[elem] = post_data[elem];
	});

	/* switch from post to get */
	res.redirect(req.url);
	return;
    });
    /* after signup is done */
    req.once("signup", (ret, args) => {
	if (ret["success"] === true){
	    /*
	     * log the user in and redirect
	     * this will add avatarUrl by default
	     * */
	    req.session.auth = {};
	    Object.assign(req.session.auth, ret.session);
	    res.redirect("/");
	    return;
	}

	/* save messages in req.session - flash messages */
	req.session["messages"] = ret["messages"];

	/*
	 * save post data for autofill
	 * save only signup_values, there might be a lot of trash
	 * in the post data to consume memory
	 * */
	signup_values.forEach(function(elem){
	     if (elem in post_data)
		 req.session[elem] = post_data[elem];
	 });

	/* switch from post to get */
	res.redirect(req.url);
	return;
    });
    /*
     * after posting something new
     * after deleting/updating post
     * */
    req.once("post_text", (ret, args) => {
	/*
	 * TODO maybe display errors to users if anything?
	 * if (ret["success"] === true)
	 * */
	res.redirect("/");
    });
});

/*
 * TODO - maybe move all /api/ routes to a different file?
 * then mount it on /api/ and make all routes shorter
 * */
app.get("/api/messages", function(req, res){
    /* flash messages - taken from session variable */
    let messages = [];
    if (typeof(req.session["messages"]) != "undefined"){
	req.session.messages.forEach(function(message){
	    messages.push(message);
	});
	/* clear for refresh/future requests */
	delete req.session.messages;
    }
    res.send(messages);
});

app.get("/api/values", function(req, res){
    /* saving typed data on forms */
    let values = {};
    let values_list = login_values.concat(signup_values);
    values_list.forEach(function(value){
	if (value in req.session){
	    values[value] = req.session[value];
	    /* you might want to keep typed data on refresh */
	    delete req.session[value];
	}
    });
    res.send(values);
});

app.get("/api/auth", function(req, res){
    /* auth details - from session variable */
    res.send(req.session["auth"]);
});

app.get("/api/posts", function(req, res){
    /*
     * list of posts to be displayed for user currently logged in
     * user logged in: req.session.auth.uid
     *
     * this should be a list of all the posts made by the user
     * or her/his friends, sorted after timestamp (TODO)
     *
     * do something like /api/friends -> uids -> get_posts(uids)
     * */
    if (typeof(req.session["auth"]) == "undefined"){
	res.send([]);
	return;
    }
    /* when we have posts from db */
    req.once("posts", (ret, args) => {
	/* on failure, ret.posts should be [] */
	if (ret.posts.length == 0) {
	    res.send([]);
	    return;
	}

	/*
	 * we need avatar and user info for each post
	 * req is used as event emitter for both
	 * ret will be in scope both times and I just modified
	 * this variable as a first solution
	 *
	 * when we have avatarUrls -> "avatarLoopFinish"
	 * when we have user info -> "userLoopFinish"
	 *
	 * for now posts will be sent in reversed order
	 * later: sort after timestamp
	 *
	 * also, should this (sorting) be performed on the frontend?
	 * */
	req.on("avatarLoopFinish", () => {
	    get_user_info();
	});
	req.on("userLoopFinish", () => {
	    //res.send(ret.posts.reverse());
	    /* sort posts after timestamp */
	    ret.posts.sort(function(a, b) {
		return new Date(b.timestamp).getTime() -
		    new Date(a.timestamp).getTime();
	    });
	    res.send(ret.posts);
	});
	get_avatar_info();

	/* add avatarUrl to posts */
	function get_avatar_info() {
	    let j = 0;
	    /* when avatarUrl is retrived for one element */
	    req.on("avatarLoopElem", (result) => {
		ret.posts[j++]["avatarUrl"] = result["photo_url"];
		if (j == ret.posts.length)
		    req.emit("avatarLoopFinish");
	    });
	    for (let i = 0; i < ret.posts.length; i++) {
		photos.get_photo_url(ret.posts[i].avatar,
				     req, "avatarLoopElem");
	    }
	}
	/* add firstName and lastName to posts */
	function get_user_info() {
	    let j = 0;
	    /* when user info is retrived for one element */
	    req.on("userLoopElem", (result) => {
		ret.posts[j]["firstName"] = result["firstName"];
		ret.posts[j]["lastName"] = result["lastName"];
		j++;
		if (j == ret.posts.length)
		    req.emit("userLoopFinish");
	    });
	    for (let i = 0; i < ret.posts.length; i++) {
		users.get_user_info(ret.posts[i].uid, req, "userLoopElem");
	    }
	}
    });
    /* get posts from db */
    posts.get_posts(req.session.auth.uid, req, "posts");
});

/* TODO maybe delete this */
app.get("/api/logout", function(req, res){
    req.session.destroy();
    res.redirect("/");
});

app.get("/quiz", function(req, res) {
    res.send("TODO");
});

app.use(function(err, req, res, next){
    /* generic error handler */
    console.error(err);
    res.status(500).send("Oops, something went wrong: " + err.message);
});

app.listen(app.get("port"), function() {
  console.log("Node app is running on port", app.get("port"));
});
