//post route file
const User = require('../db/modals/User');
const express = require('express');
const router = express.Router();
router.post('/', (req, res) => {
  // res.json(userModel)
  //We are expecting json inside body
  // const { firstName, lastName } = req.body;
  // console.log(req.body);
  // let user = {};
  // user.firstName = firstName;
  // user.lastName = lastName;
  console.log('reqbody :', req.body);
  let userModel = new User(req.body);
  userModel
    .save()
    .then(() => {
      console.log(userModel);
      res.status(200).send('posted successfully' + userModel);
      return;
    })
    .catch((e) => {
      console.log(userModel);
      res.status(400).send('Exception :' + e);
      return;
    });
});

// router.post('/specific', (req, res) => {
//   // res.json(userModel)
//   const { firstName, lastName } = req.body;
//   console.log(req.body);
//   let user = {};
//   user.firstName = firstName;
//   user.lastName = lastName;
//   let userModel = new User(user);
//   userModel
//     .save()
//     .then(() => {
//       console.log(user);
//       res.status(200).send('new specific root' + userModel);
//       return;
//     })
//     .catch((e) => {
//       res.status(400).send('lol send specific format' + e);
//       return;
//     });
// });

router.get('/', async (req, res) => {
  try {
    let userModel = await User.find().limit(5);

    res.status(200).send(userModel);
  } catch (e) {
    res.status(404).send('no user info found');
  }
});

// this route will get specific user if exist
router.get('/:userId', async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) {
      res.send(`no user found with id ${req.params.userId} `);
      return;
    }
    console.log('user', user);
    res.json(user);
  } catch (e) {
    res.status(404).send(e);
  }
});

// this route will get specific user if exist
router.delete('/:userId', async (req, res) => {
  try {
    const user1 = await User.deleteOne({ _id: req.params.userId });

    res.send(user1);
  } catch (e) {
    res.status(404).send('user not found to delete');
  }
});

// this route will get specific user if exist
router.patch('/:userId', async (req, res) => {
  const updateOps = {};
  //we are expecting body like [{'propName':"firstName,'value':"mohit"},{'propName':"lastName,'value':"singhNegi"}]
  req.body.forEach((ops) => {
    updateOps[ops.propName] = ops.value;
  });
  // some other method to update
  // const updateduser = await User.updateOne(
  //   { _id: req.params.userId },
  //   { $set: updateOps }
  // );

  User.updateOne({ _id: req.params.userId }, { $set: updateOps })
    .exec()
    .then((response) => {
      res.status(200).send(response);
    })
    .catch((error) => {
      res.status(404).send(error);
    });
  // try {
  //   const updateduser = await User.updateOne(
  //     { _id: req.params.userId },
  //     { $set: { firstName: req.body.firstName } }
  //   );

  //   res.send(updateduser);
  // } catch (e) {
  //   res.status(404).send('user not found to update');
  // }
});

module.exports = router;
