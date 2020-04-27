//post route file
const User = require('../db/modals/User');
const express = require('express');
const router = express.Router();
router.post('/', (req, res) => {
  // res.json(userModel)
  const { firstName, lastName } = req.body;
  console.log(req.body);
  let user = {};
  user.firstName = firstName;
  user.lastName = lastName;
  let userModel = new User(user);
  userModel
    .save()
    .then(() => {
      console.log(user);
      res.status(200).send('posted successfully' + userModel);
      return;
    })
    .catch((e) => {
      res
        .status(400)
        .send(
          'please send body in this format {firstname:firstname,lastname:lastname}' +
            e
        );
      return;
    });
});

router.post('/specific', (req, res) => {
  // res.json(userModel)
  const { firstName, lastName } = req.body;
  console.log(req.body);
  let user = {};
  user.firstName = firstName;
  user.lastName = lastName;
  let userModel = new User(user);
  userModel
    .save()
    .then(() => {
      console.log(user);
      res.status(200).send('new specific root' + userModel);
      return;
    })
    .catch((e) => {
      res.status(400).send('lol send specific format' + e);
      return;
    });
});

router.get('/', async (req, res) => {
  try {
    let userModel = await User.find().limit(5);

    res.status(200).send(userModel);
  } catch (e) {
    res.status(404).send('no user info found');
  }
});

// this route will get specific user if exist
router.get('/:postId', async (req, res) => {
  try {
    const user = await User.findById(req.params.postId);

    console.log('user', user);
    res.json(user);
  } catch (e) {
    res.status(404).send('user not found');
  }
});

// this route will get specific user if exist
router.delete('/:postId', async (req, res) => {
  try {
    const user1 = await User.deleteOne({ _id: req.params.postId });

    res.send(user1);
  } catch (e) {
    res.status(404).send('user not found to delete');
  }
});

// this route will get specific user if exist
router.patch('/:postId', async (req, res) => {
  // const updateOps={}
  //we are expecting body like [{'propName':"firstName,'value':"mohit"},{'propName':"lastName,'value':"singhNegi"}]
  // for(const ops of req.body){
  //   updateOps[ops.propName]=ops.value;
  // }
  // some other method to update
  // const updateduser = await User.updateOne(
  //   { _id: req.params.postId },
  //   { $set: updateOps }
  // );

  // User.updateOne().exec().then((response)=>{}).catch((error)=>{})
  try {
    const updateduser = await User.updateOne(
      { _id: req.params.postId },
      { $set: { firstName: req.body.firstName } }
    );

    res.send(updateduser);
  } catch (e) {
    res.status(404).send('user not found to update');
  }
});

module.exports = router;
