const express = require("express");
var cors = require("cors");
const mongojs = require("mongojs");

const databaseUrl = "bestbuycart";
const collections = ["items"];

const db = mongojs(databaseUrl, collections);

//const mongoose = require("mongoose");
const routes = require("./routes");
const app = express();
require("dotenv").config();
const PORT = process.env.PORT || 3001;

// Define middleware here
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
// Serve up static assets (usually on heroku)
if (process.env.NODE_ENV === "production") {
  app.use(express.static("client/build"));
}
app.use(express.static("client/build"));

// Add routes, both API and view
app.use(routes);

// Error handling
app.use(function(err, req, res, next) {
  if (err.name === "UnauthorizedError") {
    // Send the error rather than to show it on the console
    res.status(401).send(err);
  } else {
    next(err);
  }
});

//// Connect to the Mongo DB
//mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost/reactcms");

app.get("/local/cart", (req, res) => {
  db.cart.find({}, (error, data) => {
      if (error) {
        res.send(error);
      } else {
        console.log(data);
        res.json(data);
      }
    });
});

app.put("/local/additem", (req, res) => {
  //console.log(req);
  //console.log("________________________________________________________________________________________________________________");
  db.cart.insert( { count:1,details:req.body } , (error, data) => {
    if (error) {
      console.log(error);
      res.send(error);
    } else {
      console.log(data);
      res.send(data);
    }
  });
});

app.get("/local/incitemcount/:id", (req, res) => {
  db.cart.find({
    _id: mongojs.ObjectId(req.params.id)
  }, (error, data) => {
    if (error) {
      res.send(error);
    } else {
      console.log("XXXXXXXXXXXXXXXXXXXXXXX");
      console.log(data[0]);
      var count=data[0].count;
      count++;
      console.log ("Count is" + count);
 
      db.cart.update(
        {
          _id: mongojs.ObjectId(req.params.id)
        },
        {
            $set: { count: count }
        },
        (error, data) => {
          if (error) {
            console.log(error);
            res.send(error);
          } else {

            console.log("Data");
            console.log(data);
            db.cart.find({}, (error, data) => {
              if (error) {
                res.send(error);
              } else {
                console.log(data);
                res.json(data);
              }
            });
          }
        }
      );
    }
  });
});

app.get("/local/decitemcount/:id", (req, res) => {
  db.cart.find({
    _id: mongojs.ObjectId(req.params.id)
  }, (error, data) => {
    if (error) {
      res.send(error);
    } else {
      console.log("XXXXXXXXXXXXXXXXXXXXXXX");
      console.log(data[0]);
      var count=data[0].count;
      count--;
      if(count==0)count=1;
      console.log ("Count is" + count);
 
      db.cart.update(
        {
          _id: mongojs.ObjectId(req.params.id)
        },
        {
            $set: { count: count }
        },
        (error, data) => {
          if (error) {
            console.log(error);
            res.send(error);
          } else {

            console.log("Data");
            console.log(data);
            db.cart.find({}, (error, data) => {
              if (error) {
                res.send(error);
              } else {
                console.log(data);
                res.json(data);
              }
            });
          }
        }
      );
    }
  });
});

app.get("/local/removeitem/:id", (req, res) => {
      db.cart.remove(
        {
          _id: mongojs.ObjectId(req.params.id)
        },
        (error, data) => {
          if (error) {
            console.log(error);
            res.send(error);
          } else {

            console.log("Data");
            console.log(data);
            db.cart.find({}, (error, data) => {
              if (error) {
                res.send(error);
              } else {
                console.log(data);
                res.json(data);
              }
            });
          }
        }
      )    
});

app.put("/local/decitemcount:id", (req, res) => {
})

// Start the API server
app.listen(PORT, function() {
  console.log(`🌎  ==> API Server now listening on PORT ${PORT}!`);
});
