const express = require('express');
const connectDB = require('./db/Connection');
const cors = require('cors');
const app = express();
//insead of joi we can use mongoose or vice verse
connectDB();

const Port = process.env.Port || 5000;

//Middlewares
app.use(cors());
app.use(express.json());
app.use('/api/user', (req, res, next) => {
  // console.log('midddle ware is running', req.body);
  next();
});

//Routes

const userRoutes = require('./route/user');
app.use('/api/user', userRoutes);

const mealRoutes = require('./route/meal');
app.use('/api/meal', mealRoutes);
//app.get ,post ,delete ,patch to update

app.listen(Port, () => {
  console.log('your server is running on Port %d', Port);
});
// res.send(500,errmsg)
// res.status(404).send(msg)
//courses.find(c)
//const index=courses.indexOf()
//course.splice(index,1) go to index and delete one entry
//return imediatly in case of error
