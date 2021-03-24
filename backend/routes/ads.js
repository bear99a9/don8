const express = require("express");
const router = express.Router();
const { Ad } = require("../models/ad");
const multer = require("multer");

const FILE_TYPE_MAP = {
  "image/png": "png",
  "image/jpeg": "jpeg",
  "image/jpg": "jpg",
};

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const isValid = FILE_TYPE_MAP[file.mimetype];
    let uploadError = new Error("invalid image type");

    if (isValid) {
      uploadError = null;
    }
    cb(uploadError, "public/uploads");
  },
  filename: function (req, file, cb) {
    const fileName = file.originalname.split(" ").join("-");
    const extension = FILE_TYPE_MAP[file.mimetype];
    cb(null, `${fileName}-${Date.now()}.${extension}`);
  },
});

const uploadOptions = multer({ storage: storage });


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

router.post("/", uploadOptions.single("image"), async (req, res) => {
  console.log(req)
  const file = req.body.image;
  // if (!file) return res.status(400).send("No image in the request");
  console.log("File:", file)
  const fileName = file ? file.filename : "no-image-icon-23494.png";
  console.log("File name:", fileName)
  const basePath = `${req.protocol}://${req.get("host")}/public/uploads/`;
  const ad = new Ad({
    title: req.body.title,
    location: req.body.location,
    description: req.body.description,
    contact: req.body.contact,
    charity: req.body.charity,
    image: `${basePath}${fileName}`,
    website: req.body.website,
  });

    ad.save().then((createdAd) => {
      res.status(201).json(createdAd);
    }).catch((err) => {
      console.log(err)
      res.status(500).json({
        error: err,
        success: false,
      });
    });
  });

router.get("/get/count", async (req, res) => {
  const adCount = await Ad.countDocuments((count) => count);

  if (!adCount) {
    res.status(500).json({ success: false });
  }
  res.send({
    adCount: adCount,
  });
});


module.exports = router;
