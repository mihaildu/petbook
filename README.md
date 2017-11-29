# petbook
Social network in React. A live demo for this project can be found at this address (petbook was already taken on heroku)

https://petster.herokuapp.com/

You can also run it on localhost (see instructions below).

This is a simple social network that follows facebook in design. While there are still a lot of features to be implemented, a core functionality is there.

### Installation on localhost
1. make sure you have node.js installed (petbook was tested on v8.9.1)

   https://nodejs.org/en/download/

2. clone the github repo
```
git clone https://github.com/dryhten/petbook.git
```

3. install required node packages
```
cd petbook
npm install --save
```

4. install mongodb (petbook was tested with v3.4.10 community edition)

   https://docs.mongodb.com/manual/administration/install-community/

5. create a new database in mongodb (you can name it whatever you want) and then do one of the following two:

   * set `MONGODB_URI` env variable to the database URI (more on mongodb URI here https://docs.mongodb.com/manual/reference/connection-string/)

     if you don't know about env variables on linux, check this link on how to set them (a permanent solution would be better) https://www.cyberciti.biz/faq/set-environment-variable-linux/

     e.g.

     ```
     export MONGODB_URI=mongodb://<dbuser>:<dbpassword>@<dbhost>:<dbport>/<dbname>
     ```

   OR

   * edit `petbook/my-util/connect.js`, update `credentials` variable with the correct information, uncomment lines for `connect_str`, and use `connect_str` instead of `process.env.MONGODB_URI` in `mongoose.connect()` call

6. (optional) create indexes for your collections (this should improve the speed a little)

   run this from the mongo shell:

   ```
   # if no data in the db - first create the collections
   db.createCollection("Users")
   db.createCollection("Posts")
   db.createCollection("Photos")
   db.createCollection("FriendRequests")
   db.createCollection("Messages")

   db.Posts.createIndex({uid: 1})
   db.Photos.createIndex({owner: 1})
   db.Users.createIndex({email: 1})
   db.FriendRequests.createIndex({from: 1})
   db.FriendRequests.createIndex({to: 1})
   db.Messages.createIndex({from: 1})
   db.Messages.createIndex({to: 1})
   ```

   more on mongodb indexes https://docs.mongodb.com/manual/indexes/

7. insert the default avatar photo in the db

   ```
   db.Photos.insertOne({
	path: "/photos/default_avatar.png",
	owner: null,
	mimetype: "image/png",
	description: "default avatar picture",
	size: 12077,
   })
   ```
   find the ObjectId of the document you just inserted into the db
   ```
   db.Photos.find().pretty();
   ```
   copy the string from `_id` field into `petbook/node_modules/my-util/photos.js` in `default_avatar_id` variable (replace the current value)

8. bundle the react js files with webpack (since this is the same repo that runs on heroku, you'll need to run webpack with `NODE_ENV=production`; also, you might need to install webpack globally for this)
   ```
   NODE_ENV=production webpack
   ```

9. start the webserver

   ```
   node app.js
   ```

10. visit the website on localhost (port should be 5000)
    ```
    http://127.0.0.1:5000/
    ```

11. (optional) since heroku won't allow image uploads on the website, petbook uses a private dropbox app to store the photos, so by default photo upload won't work; if you want to use photo upload you have two options:
    * use your own dropbox app, and then export the dropbox token to `DROPBOX_TOKEN` (as before with `MONGODB_URI`)

    * change `app.js` to use local files (this would be a long list of instructions, but it's not that hard since this was the initial functionality of petbook; also, local photos will be deleted automatically from the disk when you remove them from the website so you don't need to worry about that)
