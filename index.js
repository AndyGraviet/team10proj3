let express = require("express");
let app = express();
let path = require("path");
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
// make new page after search that shows the one file, with options: delete, edit, or back to all records

app.get("/findRecord", (req, res) => {
  res.render("findRecord");
});

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
    .then((people) => {
      res.redirect("/stats.ejs");
    });
});

app.get("/indRecord", (req, res) => {
  knex.select().from("people").where("last_name", req.query.last_name.toUpperCase()).then((people) => {
      if (people.length == 0) {
          res.render("noResults");
        } 
      else {
          res.render("indRecord", { people : people });
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
    .catch((err) => {
      console.log(err);
      res.status(500).json({ err });
    });
});

app.post("/editRecord", (req, res) => {
  knex("people")
    .where("people_id", parseInt(req.body.people_id))
    .update({
      first_name: req.body.first_name.toUpperCase(),
      last_name: req.body.last_name.toUpperCase(), //works!
    })
    .then((people) => {
      res.redirect("/stats.ejs");
    });
});

app.listen(port, () => console.log("SERVER RUNNING"));
