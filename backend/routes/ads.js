const express = require('express');
const router = express.Router();
const {Ad} = require('../models/ad');


router.get('/', async (req, res) => {
    const adList = await Ad.find().
                   populate('charity');

    if(!adList) {
      res.status(500).json({success: false})
    }
    res.send(adList);
  });

  router.get('/:id', async (req, res) => {
    const ad = await Ad.findById(req.params.id);

    if(!ad) {
      res.status(500).json({success: false})
    }
    res.send(ad);
  });

router.post('/', (req, res) => {
    const ad = new Ad({
      title: req.body.title,
      location: req.body.location,
      description: req.body.description,
      contact: req.body.contact,
      charity: req.body.charity,

    })

    ad.save().then((createdAd => {
      res.status(201).json(createdAd)
    })).catch((err => {
      res.status(500).json({
        error: err,
        success: false
      })
    }))
  });

  router.get('/get/count', async (req, res) => {
    const adCount = await Ad.countDocuments((count) => count)

    if(!adCount) {
      res.status(500).json({success: false})
    }
    res.send({
      adCount: adCount
    });
  });

module.exports = router;
