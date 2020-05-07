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

router.post('/:id/posts', validateUserId, validatePost, (req, res) => {
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
  db.getById(req.params.id)
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

router.put('/:id',validateUserId,  (req, res) => {
  db.update(req.params.id, req.body)
  .then()(count => {
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
  let id = req.params.id;

  console.log(Object.keys(req.body));
  db.getById(id)
    .then((user) => {
      if (user) {
        next();
      } else {
        res.status(404).send("invalid user id");
      }
    })
    .catch((err) => {
      res.status(500).send("user id error");
    });
}

function validatePost(req, res, next) {
  if (Object.keys(req.body).length == 0) {
    res.status(400).json({
      msg: "missing data",
    });
  } else if (req.body.text === "") {
    res.status(400).json({
      msg: "missing text",
    });
  }
  next();
}

module.exports = router;
