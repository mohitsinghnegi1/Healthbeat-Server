//post route file
const User = require('../db/modals/User');
const express = require('express');
const bcrypt = require('bcrypt');
const mongoose = require('mongoose');
var jwt = require('jsonwebtoken');
var verifyAuth = require('../middleware/Auth');
const saltRounds = 10;
const router = express.Router();
router.post('/', (req, res) => {
  const { username, email, password, confpassword } = req.body;
  // console.log(req.body);

  if (password != confpassword) {
    res.send({
      message: 'Password not matched',
    });
    return;
  }

  bcrypt.hash(password, saltRounds, function (error, hash) {
    if (error) {
      return res.json({
        error: 'Something went wrong.Please try again later! .',
      });
    } else {
      let user = {};
      (user._id = mongoose.Types.ObjectId()), (user.username = username);
      user.email = email;
      user.password = hash;

      let userModel = new User(user);
      userModel
        .save()
        .then((data) => {
          console.log('res', data);
          res
            .status(200)
            .json({ message: 'User Registered Successfully', result: data });
        })
        .catch((e) => {
          console.log({ error: e });
          console.log(userModel);
          res.status(400).json({ error: e });
        });
    }

    // Store hash in your password DB.
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

router.get('/', verifyAuth, async (req, res) => {
  try {
    let userModel = await User.find().limit(5);

    res.status(200).send(userModel);
  } catch (e) {
    res.status(404).send('no user info found');
  }
});

// this route will get specific user if exist
router.get('/:userId', verifyAuth, async (req, res) => {
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
router.delete('/:userId', verifyAuth, async (req, res) => {
  try {
    const user1 = await User.deleteOne({ _id: req.params.userId });

    res.send(user1);
  } catch (e) {
    res.status(404).send('user not found to delete');
  }
});

// this route will get specific user if exist
router.patch('/:userId', verifyAuth, async (req, res) => {
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

//login user
router.post('/login', (req, res) => {
  const { email, password } = req.body;
  User.findOne({ email: email })
    .exec()
    .then((user) => {
      if (!user) {
        res.status(404).send({
          errorMsg: `Incorrect username and password`,
        });
      } else {
        bcrypt.compare(password, user.password, function (err, result) {
          if (err || !result) {
            res.status(404).send({
              errorMsg: `Inocorrect username and password `,
            });
          } else {
            console.log('sigin successful');
            const { _id, username, userType } = user;
            const userInfo = {
              _id,
              username,
              email,
              userType,
            };
            var token = jwt.sign(userInfo, 'secret', { expiresIn: '1h' });
            res
              .status(200)
              .json({ message: 'Login Successfull', token, userInfo });
          }
        });
      }
    })
    .catch((e) => {
      res.status(400).send({ errorMsg: e });
    });
});

module.exports = router;
