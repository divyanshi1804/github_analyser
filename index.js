const express = require("express");
const axios = require("axios");
const db = require("./db");
require("dotenv").config();

const app = express();
app.use(express.json());

// Route 1 - Fetch from GitHub and save to database
app.get("/analyze/:username", function(req, res) {
  const username = req.params.username;

  axios.get("https://api.github.com/users/" + username)
    .then(function(response) {
      const data = response.data;

      const sql = `INSERT INTO profiles (username, name, bio, public_repos, followers, following, location, github_url, avatar_url)
                   VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`;

      const values = [
        data.login,
        data.name,
        data.bio,
        data.public_repos,
        data.followers,
        data.following,
        data.location,
        data.html_url,
        data.avatar_url
      ];

      db.query(sql, values, function(err, result) {
        if (err) {
          res.status(500).json({ error: "Database error", details: err });
        } else {
          res.json({ message: "Profile saved!", username: username });
        }
      });
    })
    .catch(function(err) {
      res.status(404).json({ error: "GitHub user not found" });
    });
});

// Route 2 - Get all saved profiles
app.get("/profiles", function(req, res) {
  db.query("SELECT * FROM profiles", function(err, results) {
    if (err) {
      res.status(500).json({ error: "Database error" });
    } else {
      res.json(results);
    }
  });
});

// Route 3 - Get single profile
app.get("/profiles/:username", function(req, res) {
  const username = req.params.username;
  db.query("SELECT * FROM profiles WHERE username = ?", [username], function(err, results) {
    if (err) {
      res.status(500).json({ error: "Database error" });
    } else if (results.length === 0) {
      res.status(404).json({ error: "Profile not found" });
    } else {
      res.json(results[0]);
    }
  });
});

app.listen(process.env.PORT, function() {
  console.log("Server running on port " + process.env.PORT);
});