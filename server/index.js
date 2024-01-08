const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const morgan = require("morgan");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv/config");

app.use(cors());
app.options("*", cors());

//middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.json());
app.use(morgan("tiny"));

app.use("/public/uploads", express.static(__dirname + "/public/uploads"));

const contactMessage = require('./models/ContactUs'); // Update with the correct path


//Routes

const cartsRoutes = require("./routes/cart");
const booksRoutes = require("./routes/book");
const usersRoutes = require("./routes/user");
const commentsRoutes = require("./routes/comment");
const errorRoutes = require("./routes/error");

const api = process.env.API_URL;

app.use(`${api}/cart`, cartsRoutes);
app.use(`${api}/book`, booksRoutes);
app.use(`${api}/user`, usersRoutes);
app.use(`${api}/comment`, commentsRoutes);
app.use(`${api}/*`, errorRoutes);


//Database
mongoose
  .connect(process.env.CONNECTION_STRING, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    dbName: "book_store_database_2",
  })
  .then(() => {
    console.log("Database Connection is ready...");
  })
  .catch((err) => {
    console.log(err);
  });



  app.get('/messages', async (req, res) => {
    try {
      
      const messages = await contactMessage.find();
      console.log(messages)

      res.status(200).json(messages);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching messages', error: error.message });
    }
  });
  



  app.put('/messages/:id', async (req, res) => {
    try {
      const updatedMessage = await contactMessage.findByIdAndUpdate(req.params.id, { email: req.body.email }, { new: true });
      res.json(updatedMessage);
    } catch (error) {
      res.status(500).send(error);
    }
  });
  
  app.delete('/messages/:id', async (req, res) => {
    try {
      const deletedMessage = await contactMessage.findByIdAndRemove(req.params.id);
      res.json(deletedMessage);
    } catch (error) {
      res.status(500).send(error);
    }
  });




  const User = require('./models/User'); // Update with the correct path

  // GET route to fetch users
  app.get('/users', async (req, res) => {
      try {
          const users = await User.find({});
          console.log(users)

          res.json(users);
      } catch (error) {
        console.log(error.message)
          res.status(500).send({ message: 'Error fetching users', error: error });
      }
  });






//Server
app.listen(8000, () => {
  console.log("server is running http://localhost:8000");
});
