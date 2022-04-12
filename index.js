// This is Project 3 for Team 10 including Andrew Graviet, Emma Antonucci, Evan Gregory, Holly Lambert, Justin Brown, Maryn Hansen, Styles Weiler
// This project implements CRUD on a website about Child Trafficking
// IS 303 
// Section 004

// calls the node modules necessary to run, specifically express and path
let express = require("express");
let app = express();
let path = require("path");
// path is url encoded and joined with the "/assets" page
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "/assets")));
const port = process.env.PORT || 3001;
const knex = require(path.join(__dirname + '/knex/knex.js'));

app.set("view engine", "ejs");

//setup stuff done
app.get("/", (req, res) => res.render("index"));
app.get("/indicators.ejs", (req, res) => res.render("indicators"));
app.get("/resources.ejs", (req, res) => res.render("resources"));

app.get("/stats.ejs", (req, res) => {
  knex.select().from("people").then((people) => {
      res.render("stats", { people : people }); //works!
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ err });
    });
});

// renders the correct file when the /findRecord GET method is called
app.get("/findRecord", (req, res) => {
  res.render("findRecord");
});

// GET method looks to the last name as mentioned above and checks the length to see whether to open the noResults (in case of length zero) or editRecord (length greater than zero) 
// in which the editRecord will receive a value for people that is based of the req.query
app.get("/editRecord", (req, res) => {
  knex
    .select()
    .from("people")
    .where("last_name", req.query.last_name.toUpperCase())
    .then((people) => {
      if ((people.length == 0)) {
        res.render("noResults");
      } else {
        res.render("editRecord", { people: people });
      }
    });
});

app.get("/addRecord", (req, res) => {
  res.render("addRecord");
});

// POST method for the addRecord file which inserts the data for data missing, name, age, location, profile characteristics through the req.body method
app.post("/addRecord", (req, res) => {
  knex("people")
    .insert({
      date_missing: req.body.date_missing,
      last_name: req.body.last_name.toUpperCase(),
      first_name: req.body.first_name.toUpperCase(),
      age_at_missing: req.body.age_at_missing,
      city: req.body.city.toUpperCase(),
      state: req.body.state.toUpperCase(),
      gender: req.body.gender,
      race: req.body.race,
    })
    // afterwards redirects to the stats ejs page
    .then((people) => {
      res.redirect("/stats.ejs");
    });
});
// This POST method is the delete portion of CRUD which will eliminate the people_id when they equal and then redirect to stats page

app.get("/indRecord", (req, res) => {
  knex.select().from("people").where("last_name", req.query.last_name.toUpperCase()).then((people) => {
      if (people.length == 0) {
          res.render("noResults");
        } 
      else {
          res.render("IndRecord", { people : people });
        }
  })
  .catch((err) => {
    console.log(err);
    res.status(500).json({ err });
  });
});

app.post("/deleteRecord", (req, res) => {
  knex("people")
    .where("people_id", req.body.people_id)
    .del()
    .then((people) => {
      res.redirect("/stats.ejs");
    })
    // error catching
    .catch((err) => {
      console.log(err);
      res.status(500).json({ err });
    });
});

// this is the U of CRUD which updates using a POST method by parsing the people id and updating it with an upper case first name and last name 
app.post("/editRecord", (req, res) => {
  knex("people")
    .where("people_id", parseInt(req.body.people_id))
    .update({
      first_name: req.body.first_name.toUpperCase(),
      last_name: req.body.last_name.toUpperCase(), 
    })
  // then redirects to the stats page
    .then((people) => {
      res.redirect("/stats.ejs");
    });
});

app.listen(port, () => console.log("SERVER RUNNING"));
