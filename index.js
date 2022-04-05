const express = require('express');
const app = express();
const cors = require('cors')

app.set('port', process.env.PORT || 8000);

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true}))

const bookmarksController = require('./controllers/bookmark')
app.use('/api/bookmarks', bookmarksController)

const userController = require('./controllers/user')
app.use('/api/user', userController)

app.listen(app.get('port'), () => {
    console.log(`PORT: ${app.get('port')}`);
})
