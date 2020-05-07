const express = require('express');
const db = require('./userDb');
const router = express.Router();
const postDb = require('../posts/postDb');

router.post('/', validateUser, (req, res) => {
  db.insert(req.body)
  .then(post => {
    res.status(201).json(post);
  })
  .catch(err => {
    console.log(err);
    res.status(500).json({msg: "error"});
  })
});

router.post('/:id/posts', validatePost, (req, res) => {
  console.log(req.body);
  req.body.user_id =  req.params.id;
  postDb
    .insert(req.body)
    .then((post) => {
      
      res.status(200).json(post);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ msg: "error" });
    });
});

router.get('/', (req, res) => {
  db.get(req.query)
  .then(users => {
    res.status(200).json(users);
  })
  .catch(err => {
    console.log(err);
    res.status(500).json({msg: "error"});
  })
});

router.get('/:id', validateUserId,(req, res) => {
  console.log(req);
  db.getById(req.user.id)
  .then(user => {
    res.status(200).json(user);
  })
  .catch(err => {
    console.log(err);
    res.status(500).json({msg: "error"})
  })
});

router.get('/:id/posts', validateUserId, (req, res) => {
  db.getUserPosts(req.params.id)
  .then(posts => {
    res.status(200).json(posts);
  })
  .catch(err => {
    console.log(err);
    res.status(500).json({msg: "error"})
  })
});

router.delete('/:id', validateUserId, (req, res) => {
  db.remove(req.params.id)
  .then(count => {
    if (count == 1) {
      res.status(200).json({msg: "user deleted"});
    }
    else {
      res.status(404).json({msg: "user not found"});

    }
  })
  .catch(err => {
    console.log(err);
    res.status(500).json({msg: "error"})
  })
});

router.put('/:id', validateUserId,  (req, res) => {
  db.update(req.params.id, req.body)
  .then(count => {
    console.log(count);
    if (count == 1) {
      res.status(200).json({msg: "user updated"});
    }
    else {
      res.status(404).json({msg: "user not found"});

    }
  })
  .catch(err => {
    console.log(err);
    res.status(500).json({msg: "error"})
  })
});

//custom middleware

function validateUserId(req, res, next) {
  let id = req.params.id;
  db.getById(id)
    .then((user) => {
      if (user) {
        req.user = user

        next();
      } else {
        res.status(404).send("invalid user id");
      }
    })
    .catch((err) => {
      res.status(500).send("user ID error");
    });
}

function validateUser(req, res, next) {
  const user = req.body
  if(!user){
    res.status(400).json({
      message: "Missing user data"
    })
  }else if(!user.name){
    res.status(400).json({
      message: "Missing required name field"
    })
  }else {
    next()
  }
}


function validatePost(req, res, next) {
  const post = req.body
  if(!post){
  res.status(400).json({
      message: "Missing post data"
      })
  }else if(!post.text){
  res.status(400).json({
      message: "Missing required text field"
      })
  } else {
      next()
  }
}

module.exports = router;
