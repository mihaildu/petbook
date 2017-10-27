/*
 * Petbook - social network in react
 *
 * Social network, for pets!
 * */
var express = require("express");
var app = express();
const port = 5000;

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

/* TODO decide on template engine */

/* welcome page */
app.get(["/", "/index", "/index.html"], function(req, res) {
    /* session didn't start, something went wrong */
    if (typeof(req.session) == "undefined"){
	throw new Error("session didn't start");
    }
    /* if user already logged in, show "index.html" */
    if (typeof(req.session["uid"]) != "undefined"){
	res.sendFile(index_path);
	return;
    }
    /* else, show "welcome.html" */
    res.sendFile(welcome_path);
});

app.post(["/", "/index", "/index.html"], function(req, res){
    /* TODO signup/login */
    res.send("TODO");
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
