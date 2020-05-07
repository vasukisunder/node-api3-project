const express = require('express');
const db = require("./postDb");

const router = express.Router();

router.get('/', (req, res) => {
  db.get(req.query)
  .then(posts => {
    res.status(200).json(posts);
  })
  .catch(err => {
    console.log(err);
    res.status(500).json({msg: "error"})
  })

})

router.get('/:id', (req, res) => {
  db.getById(req.params.id)
  .then(post => {
    res.status(200).json(post);
  })
  .catch(err => {
    console.log(err);
    res.status(500).json({msg: "error"})
  })
});

router.delete('/:id', (req, res) => {
  db.remove(req.params.id)
  .then(count => {
    if (count == 1) {
      res.status(200).json({msg: "post deleted"});
    }
    else {
      res.status(404).json({msg: "post not found"});

    }
  })
  .catch(err => {
    console.log(err);
    res.status(500).json({msg: "error"})
  })
  
});

router.put('/:id', (req, res) => {
  db.update(req.params.id, req.body)
  .then()(count => {
    if (count == 1) {
      res.status(200).json({msg: "post updated"});
    }
    else {
      res.status(404).json({msg: "post not found"});

    }
  })
  .catch(err => {
    console.log(err);
    res.status(500).json({msg: "error"})
  })
  
});

// custom middleware

function validatePostId(req, res, next) {
  // do your magic!
}

module.exports = router;
