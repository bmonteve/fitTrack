const express = require("express");
const mongoose = require("mongoose");
var path = require("path");

const PORT = process.env.PORT || 3333;

const app = express();
const db = require("./models");

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(express.static("public"));

mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost/workout", {
  useNewUrlParser: true,
  useFindAndModify: false
});

// routes

app.get("/exercise", function(req, res) {
  res.sendFile(path.join(__dirname, "./public/exercise.html"));
});
app.get("/stats", function(req, res) {
  res.sendFile(path.join(__dirname, "./public/stats.html"));
});
app.get("/", function(req, res) {
  res.sendFile(path.join(__dirname, "./public/index.html"));
});

app.put("/api/workouts/:id", ({body},res)=>{
  db.Exercise.create(body)
  .then(({_id}) => db.Workout.findOneAndUpdate({}, { $push: { exercises: _id } }, { new: true }))
  .then(exercises => {
    res.json(exercises);
  })
  .catch(err => {
    res.json(err);
  })
})

app.post("/api/workouts", ({body}, res) => {
  db.Workout.create(body)
  .then(workouts => {
    res.json(workouts);
  })
  .catch(err => {
    res.json(err);
  })
})

app.get("/api/workouts/range", (req, res) => {
  db.Workout.find({})
  .populate("exercises")
  .then(workout => {
    res.json(workout);
  });
})

app.get("/find", (req, res) => {
  db.Workout.find({})
  .populate("exercises")
  .then(exercise => {
    res.json(exercise);
  })
})

app.get("/remove", (req, res) => {
  db.Workout.remove({})
  .then(exercise => {
    res.json(exercise);
  })
})

app.listen(PORT, () => {
  console.log(`App running on port ${PORT}!`);
});