[![General Assembly Logo](https://camo.githubusercontent.com/1a91b05b8f4d44b5bbfb83abac2b0996d8e26c92/687474703a2f2f692e696d6775722e636f6d2f6b6538555354712e706e67)](https://generalassemb.ly/education/web-development-immersive)

# JSON APIs in Express & Postman

## Prerequisites

- Express Routes
- Mongoose.js
- Data modeling / ERDs

## Lesson Objectives

- Build an HTTP API in Express that serves JSON data from a Mongo DB
- Use Postman to test our routes
- Use CORS with our Express API to permit requests from other domains

## Framing

Instead of directly rendering a view (as HTML), the server will serve **data in
the form of JSON** that a client-side JS application will 'consume' and generate
content from.

> This an increasingly common pattern in modern web development, especially with
> the rise of 'serverless' services. You may or may not be familiar with the
> terms Platform as a Service and Service as a Service, but these are examples
> of 'serverless' services. See the additional reading
> [here](http://insightaas.com/serverless-computing-no-servers-really/).

We're not going to build a super complex application with many sets of endpoints
today, but rather build a single service that implements an API over HTTP.

## Review

### REST

**REST**, or REpresentational State Transfer, is a convention that standardizes how clients make requests to servers.

Knowing REST is important because the vast majority of web developers have agreed to follow this same convention.

The web as we know it transfers data via HTTP, or Hyper-Text Transfer Protocol, which is a common convention used for **REST**. HTTP specifies that a server receives a **request** from a client and then delivers a corresponding **response**.

Remember: a server's job is to respond to HTTP requests. In order to talk about how Express methods can respond to different HTTP verbs, we need to talk about how HTTP requests work.

Every HTTP request consists of a request **method** and **path**. The **path** is the part of the URL following the domain. We likely have noticed paths when navigating the web. What is the path for this lesson?

Your browser always sends that request in a _particular way_ that gives the server a hint as to the purpose of the request. This _particular way_ is the **method**.

"GET" is one of these methods. It means the browser just wants to read (or "get") some information. When you write `app.get('/books', (req, res) => {})`, you're telling your server how to respond when a browser says, "Hey, I'd like to get some information from the `/books` path."

We make requests all the time -- especially `GET` requests. Every time you go to your browser, enter a URL, and hit enter, you're actually making a `GET` request.

### RESTful HTTP Methods

HTTP defines five main methods, each of which corresponds to one of the CRUD functionalities.

| Method | Crud functionality | DB Action            |
| ------ | ------------------ | -------------------- |
| GET    | read               | retrieve data        |
| POST   | create             | add data             |
| PUT    | update             | modify existing data |
| PATCH  | update             | modify existing data |
| DELETE | delete             | delete existing data |

So, wait -- there are 5 REST methods, but only 4 CRUD methods?

`PUT` and `PATCH` are both used for updating. Whenever you update your Facebook profile you're probably making a `PUT` or `PATCH` request. The difference is `PUT` would be intended to completely replace your profile, whereas `PATCH` would be intended to just change a few fields of your profile.

To clarify further, `PATCH` is replacing part of the data and `PUT` is replacing the whole thing.

### What's the difference at a technical level between a GET and a POST request?

There is of course the difference in the METHOD type, but also in the request payload. A `POST` request for instance will contain all of the data necessary for creating some new object.

GET is for when you want to read something. The parameters of the GET request are used for identifying which piece of data the client would like to read. The parameters of the POST request are used for defining a new piece of data.

### RESTful Routes

A **route** is a **method** plus a **path**...

**Method + Path = Route**

Each route results in an **action**.

REST can be translated in to RESTful Routes (routes that follow REST):

| Action | Method | Path           | Action                                                               |
| ------ | ------ | -------------- | -------------------------------------------------------------------- |
| index  | GET    | `/engineers`   | Read information about all engineers                                 |
| create | POST   | `/engineers`   | Create a new engineer                                                |
| show   | GET    | `/engineers/1` | Read information about the engineer whose ID is 1                    |
| update | PUT    | `/engineers/1` | Update the existing engineer whose ID is 1 with all new content      |
| update | PATCH  | `/engineers/1` | Update the existing engineer whose ID is 1 with partially new content|
| destroy| DELETE | `/engineers/1` | Delete the existing engineer whose ID is 1                           |

Note that the path doesn't contain any of the words describing the CRUD functionality that will be executed. That's the method's job.

These routes are important to keep in mind as we build out our controllers. For a resource with full CRUD, the controller for that resource will likely have each of the above 7 routes.

## Building an API in Express

For this class, we'll be building an application called 'book-e' which can save
bookmarks for us. 

## Book-e

### Set Up Book-e Backend


Download [Postman here](https://www.postman.com/downloads/) if you
don't have it already. You'll need to create an account (free!) to use it.

Postman is going to substitute for a front end for our testing purposes.

## Setup ExpressJS

Before we can do anything, we need to actually make express work and listen for
requests.

In your `index.js` file add this below the requires:

```js
const express = require('express')
// instantiate express
const app = express();

/* START CONTROLLERS HERE */

/* END CONTROLLERS HERE */

app.set('port', process.env.PORT || 8000);

app.listen(app.get('port'), () => {
  console.log(`✅ PORT: ${app.get('port')} 🌟`);
});
```

This is great! Now our server should run with `nodemon`. But it doesn't do
anything yet.

### Build our models

We need some files where models should be. Lets build them out before
we attempt to use them.

Here's an example for the Bookmark model, let's just talk through this.

```js
// require the mongoose package from the connection pool
const mongoose = require("../connection");

// make a new schema with 2 properties, and assign it to a variable
const BookmarkSchema = new mongoose.Schema({
  title: String,
  url: String
});

// instantiate the model, calling it "Bookmark" and with the schema we just made
const Bookmark = mongoose.model("Bookmark", BookmarkSchema);

// export the newly created model
module.exports = Bookmark;
```

Following this same pattern, try to build out the User model. It should have 2
properties. We'll add the relation between them later:

- email: String
- name: String

Check out the
[mongoose schematypes](https://mongoosejs.com/docs/schematypes.html) for all the
various types that aren't strings.

### Seed the database

Create a `seeds.json` and `seeds.js` file inside the db directory.  For now, let's just create a seed file for the Bookmarks.

```json
[
  {
     "title": "Microsoft",
     "url": "https://microsoft.com",
  },
  {
     "title": "reddit",
     "url": "https://reddit.com",  
  },
  {
     "title": "Google",
     "url": "https://google.com",
  },
  {
     "title": "Know your meme",
     "url": "https://knowyourmeme.com/",
  },
  {
     "title": "Hacker news",
     "url": "https://news.ycombinator.com"
  }
]

```

### Making our first route

Let's create an **index** route to display all of the bookmarks in our database.  Remember the signature for the `get` method?  It looks like all of the [Express route methods](https://expressjs.com/en/guide/routing.html#route-methods).  We haven't seen the `next` parameter used yet, but we'll add it here for completeness:


```js
// controllers/bookmarks.js

// Index: GET all the bookmarks
router.get("/", (req, res, next) => {
  // 1. Get all of the bookmarks from the DB
  // 2. Send them back to the client as JSON
  // 3. If there's an error pass it on!
});
```

We've seen how we can send a response as HTML using a view engine with the `res.render()` method and we've used a couple of other [Express response methods](https://expressjs.com/en/guide/routing.html#response-methods) like `res.redirect()` and `res.send()`.  The key difference now is that we want to send the response as JSON.  


<details>
  <summary>Looking at the documentation method will we use to send back the data to the client?</summary>

`res.json()` 

</details>

This is the basis for how we will send data from the database to the front end.

### Reading Data

> The R in CRUD

Our controller is really intended to serve data from database, which means we
need to query the database. To this end, we will use the model which defined
using mongoose.

Next, let's fill out the routes for **reading** from the database.

```js
//...
// import the bookmark model
const Bookmark = require("../models/Bookmark");


// Index: GET all the bookmarks
router.get("/", (req, res, next) => {
  // 1. Get all of the bookmarks from the DB
  Bookmark.find({})
    // 2. Send them back to the client as JSON
    .then(bookmarks => res.json(bookmarks))
    // 3. If there's an error pass it on!
    .catch(next);
});

//...
```

To test things out, we'll need to import the bookmarks controller and then use it:

```js
/* START CONTROLLERS HERE */

const bookmarksController = require('./controllers/bookmarks');
app.use('/api/bookmarks/', bookmarksController);

/* END CONTROLLERS HERE */
```

The `app.use('/api/bookmarks/', bookmarksController)` method here takes two arguments.  It lets us define the base path
for all requests that will be sent to the bookmark controller.  This means that we won't be using the `/api/bookmarks` inside our controller. 

### We do: Get bookmark by ID

Using the same bookmark controller and model, we'll add a **show** route.

First let's add the route and console log:

```js
// Show: Get a Bookmark by ID
router.get("/:id", (req, res, next) => {
  console.log(req.params)
});
```

What's the `:id` syntax? This is how we tell express to
expect a **variable** to be passed in. In this case it's called a `param` and
express will interpret it and give it to us in the request object, in another
object called `params`.

```js
// Show: Get a Bookmark by ID
router.get("/:id", (req, res, next) => {
  // 1. Find the Bookmark by its unique ID
  // 2. Send it back to the client as JSON
  // 3. If there's an error pass it on!
});

```

How can we find an item in the database by it's id?  Do we have a pattern to use for this?

```js
// Show: Get a Bookmark by ID
router.get("/:id", (req, res, next) => {
  // 1. Find the Bookmark by its unique ID
  Bookmark.findById(req.params.id)
  // 2. Send it back to the client as JSON
    .then((bookmark) => res.json(bookmark))  
  // 3. If there's an error pass it on!
    .catch(next);
});

```

### GET requests with Postman

Launch Postman. Make sure you're logged in (create an account if you don't have
one).

Ensure `mongod` and `nodemon` are running with no errors.

- Enter `localhost:8000/api/bookmarks/` in the address bar
- Ensure the dropdown says `GET`
- Click `Send`

You should see the response below, containing all the bookmarks!

Also test the show route. You should see a
single bookmark as the response.

Now let's test these routes in the browser!

Make sure `nodemon` is running and you don't have any errors, and open the same
two urls.

If we're just testing GET routes, we can use either Postman or the browser. But
for anything more, we need to use postman, because its easier to send data.


### Creating Data + Body Parser

> The C in CRUD

There are a bunch of different methods we can use to retrieve data, but there's
really only one used to create new data: `.create()`

```js
router.post("/", (req, res, next) => {
  // 1. Use the data in the req body to create a new bookmark
  Bookmark.create(req.body)
    // 2. If the create is successful, send back the record that was inserted
    .then(bookmark => res.json(bookmark))
    // 3. If there was an error, pass it on!
    .catch(next)
});
```

Unfortunately, this won't work without some additional setup.

Express needs to be told how to handle certain types of requests - in this case,
a POST request that also contains some JSON (since that's what we'll be
sending).

We'll add the `express.json` middleware to be able to interpret the
request body. This will automatically parse the json and put it into the
`request` object for us.

Let's require and configure it in `index.js`...

```js
const express = require('express')
const app = express()
const bookmarksController = require('./controllers/bookmarks')

// Use middleware to parse the data in the HTTP request body and add
// a property of body to the request object containing a POJO with with data.
app.use(express.json())
app.use(express.urlencoded({ extended: true }));

/* START CONTROLLERS HERE */
...
```

**Remember this middleware must go before our controllers run.**

Once we have the route defined and JSON parsing enabled, we can send some POST
requests using postman.

Postman is a great tool that I hope you use all the time.

### Sending Data with Postman

1. Launch Postman.
2. Enter `localhost:8000/api/bookmarks` into the bar at the top of the screen.
3. Click on headers and add the following
	- Select `POST` as the request type
	- Under headers tab, specify the `Content-Type` as `application/json`. This allows the 
	client tells the server what type of data is actually sent.
   > ![Postman POST header config](./images/postRequestHeader.png)
4. Then, click on the body tab, select the `raw` radio button, and enter
   the new bookmark we'd like to create in the database.
   > ![Postman POST body config](./images/postRequestBody.png)
5. Hit send! Scroll down and you'll the response in the panel below.

> Note: These headers are always required when dealing with JSON. Depending on
> the client that we use (fetch, axios, etc), they can detect the type of data
> we're working with and set the headers for us automatically. Postman makes us
> do it manually.

What is the response that we get back?

Check your console (wherever nodemon is running) and you'll hopefully see some
output. Postman will also show the response from the server.

### You do: Updating Data (15 min)

> The U in CRUD

Updating is a bit more tricky than just retrieving or creating data - it's
basically doing both.

Combining the `params` and the `req.body` that we've used in the GET and POST
methods, try the following:

- create a new PUT route at `/api/bookmarks/:id`
- use the parameter to search for a record (see below)
- use req.body to pass in the data to the model

You'll use the model method `findOneAndUpdate()` which takes three arguments:

1. the query to find a record to be updated (same as `find({})` uses)
2. the new data to update the old record (an object)
3. an additional option so Mongoose returns the updated document (the default is
  the original document). You can read more about the possible options
  [here](https://mongoosejs.com/docs/api.html#model_Model.findOneAndUpdate), and
  this does not have to be anything more `{ new: true }` as the third argument

What HTTP verbs should you use for each? What routes should they go on?

Test your code using Postman. Make sure you set the method to PUT on the
dropdown.

> 5 min review

### You do: Delete a record

Deleting follows a similar pattern, this time we just need to delete based on
one value. We'll use title again.

- create a new DELETE route at `/api/bookmarks/:id`
- use req.params to search for a record to delete
- use `findOneAndDelete()` to delete a record by its title

> 5 min review

## Second half

### CRUD with two related models

So far we've built out CRUD on one model. But in a lot of cases, we have more
than one, and they relate to each other. We want to be able to query them both
as they relate.

We'll start by adding relations to the bookmark models.

```js
const BookmarkSchema = new mongoose.Schema({
  title: String,
  url: String,
  owner: {
    // References use the type ObjectId
    type: mongoose.Schema.Types.ObjectId,
    // the name of the model to which they refer
    ref: 'User'
  } 
});
```

### You do: Index Route: GET Users

Using what we covered earlier, build out the route to GET all users.

- use `find()`
- send a json response
- test your work using Postman

> 5 min review

### You do: Show Route: GET one user

Add a new route that gets a single user by id.

- use the route params, calling it `:id`
- use `findOne()` instead of `find()`
- send a json response
- test your work using Postman

### We do: Create a user

Now that we can query users, lets make a route to create a new user. For now, we
won't add any relations - just creating a single user without favorites.

This pattern should look familiar. We take the parsed object from the request
body and pass it directly into `create()`

```js
router.post("/", (req, res, next) => {
  User.create(req.body)
    .then(user => {
      res.json(user);
    })
    .catch(next)
});
```

## Using Population

Let's change up our seeds.js file so that we can quickly delete everything in the database and add a new user as our owner of a bunch of bookmarks:

```js
const mongoose = require('./connection');

const Bookmark = require('../models/Bookmark');
const User = require('../models/User');
const bookmarkseeds = require('./seeds.json');

Bookmark.deleteMany({})
  .then(() => User.deleteMany({}))
  .then(() => {
    return User.create({ email: 'fake@email.com', name: 'Fake Person' })
      .then((user) =>
        bookmarkseeds.map((bookmark) => ({ ...bookmark, owner: user._id }))
      )
      .then((bookmarks) => Bookmark.insertMany(bookmarks));
  })
  .then(console.log)
  .catch(console.error)
  .finally(() => {
    process.exit();
  });

```

Now we can see that the bookmarks all have an owner assigned to them.  We could use a second API call to get the details for the owner, but Mongoose makes it easy to add virtual data to our response object with the `.populate()` method. Change the index and show routes for the bookmarks as follows:

```diff

router.get('/', (req, res, next) => {
  Bookmark.find({})
+    .populate('owner')
    .then((bookmarks) => res.json(bookmarks))
    .catch(next);
});

router.get('/:id', (req, res, next) => {
  Bookmark
    .findById(req.params.id)
+    .populate('owner')
    .then((bookmark) => res.json(bookmark))
    .catch(next);
});
```

Test the results in the browser or Postman!!!

## Advanced

For some additional pointers and issues you may encounter using Express and Mongoose to build api's, check out the [advanced section](./advanced.md).

## Additional Resources

- Express docs http://expressjs.com/en/4x/api.html
- mongoose.js docs https://mongoosejs.com/docs/guide.html

## [License](LICENSE)

1. All content is licensed under a CC­BY­NC­SA 4.0 license.
1. All software code is licensed under GNU GPLv3. For commercial use or
   alternative licensing, please contact legal@ga.co.
