const express = require('express'); //call express from library
const app = express(); //Initialize app to make api requests, initialize server, etc. 
const cors = require('cors');

app.use(cors());
app.use(express.json());

const db = require('./models'); //Add this line

// Routers
const postRouter = require('./routes/Posts'); //apply router
app.use("/posts", postRouter); //apply middleware
const commentsRouter = require('./routes/Comments');
app.use("/comments", commentsRouter);
const usersRouter = require('./routes/Users');
app.use("/auth", usersRouter);
const likesRouter = require("./routes/Likes");
app.use("/likes", likesRouter);

db.sequelize.sync().then(()=> {
    //Entry point of API (where server starts)
    app.listen(3001, () =>{
        console.log("Server running on port 3001");
    }); //Message logged when server runs successfully
});


