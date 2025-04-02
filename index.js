import express from "express";
import bodyParser from "body-parser";
import pg from "pg";
const app = express();
const port = 3000;
const db = new pg.Client({
  // creating the data base configuration
  user: "postgres",
  host: "localhost",
  database: "permalist",
  password: "shhh",
  port: "5432",
});

db.connect(); // connecting the database

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

let items = [
  { id: 1, title: "Buy milk" },
  { id: 2, title: "Finish homework" },
];

app.get("/", async (req, res) => {
  try {
    const result = await db.query("SELECT * FROM items ORDER BY id ASC"); // fetching the items from our database
    items = result.rows;

    res.render("index.ejs", {
      listTitle: "Today",
      listItems: items,
    });
  } catch (err) {
    console.log(err);
  }
});

// for this we grab the item value name with body parser then enter a try catch statement where we query for
// Inserting an item into our table and redirect to the home page
app.post("/add", async (req, res) => {
  const item = req.body.newItem;
  try {
    await db.query(`INSERT INTO items (title) VALUES ($1)`, [item]);
    res.redirect("/");
  } catch (err) {
    console.log(err);
  }
});
// same thing here we turn it into an async gunction grab values with body parser then query them in
// finally redirecting to the home page
app.post("/edit", async (req, res) => {
  const item = req.body.updatedItemTitle;
  const id = req.body.updatedItemId;
  try {
    await db.query("UPDATE items SET title = ($1) WHERE id = ($2)", [item, id]);
    res.redirect("/");
  } catch (err) {
    console.log(err);
  }
});

app.post("/delete", async (req, res) => {
  const id = req.body.deleteItemId;
  try {
    await db.query("DELETE FROM items WHERE id = ($1)", [id]);
    res.redirect("/");
  } catch (err) {
    console.log(err);
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
