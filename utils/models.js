/*
 * various mongoose models used in connection with the db
 * */
const mongoose = require("mongoose");

/* petbook.Users model */
const user_schema = mongoose.Schema({
    firstName: String,
    lastName: String,
    email: String,
    password: String,
    type: String,
    gender: String,
    birthday: String,
    friends: [String],
    avatar: String,
    isGuest: Boolean
});
const user_model = mongoose.model("user", user_schema, "Users");

/* petbook.Photos model */
const photo_schema = mongoose.Schema({
    path: String,
    owner: String,
    mimetype: String,
    description: String,
    size: Number
});
const photo_model = mongoose.model("photo", photo_schema, "Photos");

/*
 * petbook.Posts model
 *
 * for now also store avatar id in here (this can be obtained from uid)
 * since it's not that bad to duplicate ids anyway
 * this makes it easier to show user avatar near each post (saves one
 * db query)
 * */
const post_schema = mongoose.Schema({
    uid: String,
    isText: Boolean,
    text: String,
    timestamp: String,
    photo: String,
    comments: [String]
});
/* TODO first arg? */
const post_model = mongoose.model("post", post_schema, "Posts");

/* petbook.FriendRequests model */
const friend_req_schema = mongoose.Schema({
    from: String,
    to: String,
    seen: Boolean,
    status: String
});
const friend_req_model = mongoose.model("friend_req",
					friend_req_schema, "FriendRequests");

/* petbook.FriendRequests model */
const message_schema = mongoose.Schema({
    from: String,
    to: String,
    seen: Boolean,
    timestamp: String,
    message: String
});
const message_model = mongoose.model("message", message_schema, "Messages");

/* exports */
module.exports.user_model = user_model;
module.exports.photo_model = photo_model;
module.exports.post_model = post_model;
module.exports.friend_req_model = friend_req_model;
module.exports.message_model = message_model;
