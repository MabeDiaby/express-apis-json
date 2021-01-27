# Advanced Express/Mongo

## Redirects

Since all of our routes are defined on `/api/something`, we sometimes want a
more user-friendly way to point people in the right direction. Enter the
redirect.

We'll define a route for the base url (`/`), and have it redirect the user to
`/api/bookmarks`.

In your index.js file, above the definitions for the API routes:

```js
app.get("/", (req, res) => {
  res.redirect("/api/bookmarks");
});
```

What we're really doing here is sending back a response that is a redirect,
rather than HTML or JSON. The browser knows how to handle this, so once it
receives the redirect response it automatically follows it to the new path. This
new path is treated as a new request, so the browser then performs a GET request
to the bookmarks url.

## CORS

Sometimes we need we'll need to add the `cors` dependency. CORS stands for cross
origin resource sharing. Express is enforcing a CORS policy that cross-origin
requests without proper configuration on the back end.

You can think of origins as website domains, like `localhost:3000`,
`localhost:8080`, `google.com`, `fuzzy-panda-cat.herokuapp.com`, and so on.

Because our server runs on `localhost:8080`, any requests that come from
somewhere that is NOT `localhost:8080` will be blocked, by default. So if we had
a website that made `fetch()` requests to `localhost:8080`, they would be
blocked unless we configure cors in express.

The npm package `cors` is middleware that tells express to accept requests from
different origins. By default it just enables ALL origins.

> [Here's a good article](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS)
> on MDN about what CORS is.

```diff
const express = require('express')
+const cors = require('cors')

const app = express()

+app.use(cors())


```

</details>

## Handling Errors

We've been using the `next` parameter in our controllers to pass our errors onto the _"next"_ piece of middleware in our application.  At this point we don't have anything to do the job of handling the errors though, so let's add something to do that.  Inside the `index.js` add the following code **right after the comment ending the controllers**:

```js
...
/* END CONTROLLERS HERE */

app.use((err, req, res, next) => {
  const statusCode = res.statusCode || 500;
  const message = err.message || 'Internal Server Error';
  res.status(statusCode).send(message);
});
```

Because we need to send an error back to the client if something goes wrong, we're going to check the errors that get passed through this middleware for a status code and a message, if none exists, we'll just use a generic 500 Internal Server Error.  The `res.status()` method allows us to set the status on an outgoing response, but it won't actually send the response.  We'll use the `send()` method to handle sending the response and give it the message stored in our variable.
