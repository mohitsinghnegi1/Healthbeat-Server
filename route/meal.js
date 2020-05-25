//post route file
var fetch = require('node-fetch');
var config = require('../config');
var verifyAuth = require('../middleware/Auth');

//integrate nutritionix api to get calories of given meal
var getCalories = async (mealName) => {
  var calories = -1;
  var response = await fetch(config.nutritionixEndPoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-app-id': 'd8e06552',
      'x-app-key': '4cd8c77632446b09fb465e75d34b42c4',
      'x-remote-user-id': 0,
    },
    body: JSON.stringify({ query: mealName }),
  });
  console.log('response');
  return response.json();
};

const Meal = require('../db/modals/Meal');
const express = require('express');
const router = express.Router();

//create meal for user
router.post('/', verifyAuth, async (req, res) => {
  // console.log('reqbody :', req.body);
  let body = req.body;
  // console.log('body ', body);
  if (!req.body.calorie) {
    // console.log('calories not provided ');
    body.calorie = -1; //get calories from api
    // console.log('meal name ', req.body.mealName);
    await getCalories(req.body.mealName).then((data) => {
      console.log('data ', data);

      if (data.hasOwnProperty('message')) {
        body.calorie = -1;
      } else {
        body.calorie = data.foods[0].nf_calories;
      }
    });
  }
  console.log('body after api call ', body);
  if (body.calorie != -1) {
    let mealModel = new Meal(body);
    console.log('success');
    mealModel
      .save()
      .then(() => {
        console.log(mealModel);
        res.status(200).send({
          error: false,
          message: 'Meal posted successfully',
        });
      })
      .catch((e) => {
        console.log('1 error');
        console.log(mealModel);
        res.status(400).send({
          error: true,
          message: 'Something went wrong!!',
          errObj: e,
        });
        return;
      });
  } else {
    console.log('2 error');
    res.status(400).send({
      error: true,
      message: 'Meal does not exist!!',
      errObj: null,
    });
  }
});

// router.get('/', verifyAuth, async (req, res) => {
//   try {
//     let mealModel = await Meal.find().limit();

//     res.status(200).send(mealModel);
//   } catch (e) {
//     res.status(404).send('no meal info found');
//   }
// });

//get user meals
router.get('/', verifyAuth, async (req, res) => {
  console.log('get meal request');
  const { _id, userType } = req.userInfo;

  try {
    let mealModel;
    if (userType == 'user') {
      mealModel = await Meal.find({ userId: _id });
    } else {
      mealModel = await Meal.find();
    }

    res.status(200).send({
      error: false,
      message: 'User Meals!!',
      errObj: null,
      meals: mealModel,
    });
  } catch (e) {
    res.status(404).send({
      error: true,
      message: 'Something went wrong!!',
      errObj: e,
    });
  }
});

// this route will get specific meal if exist
// router.get('/:userId', verifyAuth, async (req, res) => {
//   try {
//     const meal = await Meal.find({
//       userId: req.params.userId,
//     });
//     if (!meal) {
//       res.send(404).send({
//         error: true,
//         message: 'No meals found!!',
//         errObj: null,
//       });
//       return;
//     }
//     console.log('meal', meal);
//     res.send(200).json({
//       error: false,
//       message: 'Here is your meals!!',
//       errObj: null,
//       meals: meal,
//     });
//   } catch (e) {
//     res.status(400).send({
//       error: true,
//       message: 'Something went wrong!!',
//       errObj: e,
//     });
//   }
// });

// this route will delete specific meal if exist
router.delete('/:mealId', verifyAuth, async (req, res) => {
  try {
    const meal1 = await Meal.deleteOne({ _id: req.params.mealId });

    res.send({
      error: false,
      message: 'Meal deleted successfully!!',
      deleted: meal1,
    });
  } catch (e) {
    res.status(404).send({
      error: true,
      message: 'Something went wrong!!',
      errObj: error,
    });
  }
});

// this route will get specific meal if exist
router.patch('/:mealId', verifyAuth, async (req, res) => {
  const updateOps = {};
  console.log('body req', req);
  //we are expecting body like [{'propName':"firstName,'value':"mohit"},{'propName':"lastName,'value':"singhNegi"}]
  req.body.data.forEach((ops) => {
    updateOps[ops.propName] = ops.value;
  });
  // some other method to update
  // const updateduser = await Meal.updateOne(
  //   { _id: req.params.mealId },
  //   { $set: updateOps }
  // );

  Meal.updateOne({ _id: req.params.mealId }, { $set: updateOps })
    .exec()
    .then((response) => {
      res.status(200).send({
        error: false,
        message: 'Meal updated successfully',
        response: response,
      });
    })
    .catch((error) => {
      res.status(404).send({
        error: true,
        message: 'Something went wrong!!',
        errObj: error,
      });
    });
});

module.exports = router;
