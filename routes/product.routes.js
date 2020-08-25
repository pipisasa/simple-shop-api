const { Router } = require("express");
const Product = require("../models/Product");
const auth = require("../middleware/auth.middleware");
const { check, validationResult } = require("express-validator");
const router = Router();

//? READ
router.get("/", async (req, res)=>{
  try {
    const products = await Product.find({});
    res.json(products)
  } catch (e) {
    res.status(500).json({ message: "Что-то пошло не так, попробуйте еще..." });
  }
})

//? DETAILS
router.get("/:slug", async (req, res)=>{
  try {
    const product = await Product.findOne({slug: req.params.slug});
    
    if(!product) return res.status(404).json({ message: `Product \"${req.params.slug}\" is not defined` });

    res.status(200).json(product);
  } catch (e) {    
    res.status(500).json({ message: "Что-то пошло не так, попробуйте еще..." });
  }
})

//? CREATE
router.post("/",[
  auth,
  check("title").exists().withMessage("title - does not exist").isLength({max: 50}).withMessage("max length for title - 50"),
  check("price").exists().withMessage("price - does not exist").isNumeric().withMessage("price must be number"),
  check("image").exists().withMessage("image - does not exist").isURL().withMessage("image must be URL"),
  check("description").isLength({max: 255}).withMessage("Max length for description - 255")
], async (req, res)=>{
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        errors: errors.array(),
        message: "Некорректные данные...",
      });
    }

    const { title, description, price, image } = req.body;
    const product = new Product({
      title,
      description: description ? description : "",
      price,
      image,
      owner: req.user.userId
    })
    const result = await product.save();
    res.status(201).json(result);
  } catch (e) {
    res.status(500).json({ message: "Что-то пошло не так, попробуйте еще..." });
  }
})

//? UPDATE
router.patch("/:slug", [
  auth,
  check("title").isLength({max: 50}).withMessage("max length for title - 50"),
  check("price").isNumeric().withMessage("price must be number"),
  check("image").isURL().withMessage("image must be URL"),
  check("description").isLength({max: 255}).withMessage("Max length for description - 255")
], async (req, res)=>{
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        errors: errors.array(),
        message: "Некорректные данные...",
      });
    }

    const { title, description, price, image } = req.body;

    await Product.findOneAndUpdate({slug: req.params.slug}, {
      title,
      description,
      price,
      image
    });

    res.status(200).json({ok: true})
  } catch (e) {
    res.status(500).json({ message: "Что-то пошло не так, попробуйте еще..." });
  }
})

//? DELETE
router.delete("/:slug", auth, async (req, res)=>{
  try {
    const candidate = await Product.findOne({
      _id: req.params.id,
      owner: req.user.userId
    });
    if(!candidate){
      return res.status(404).json({ message: `Product \"${req.params.slug}\" of this user is not defined` })
    }
    await candidate.deleteOne()
    res.status(200).json({ok: true})
  } catch (e) {
    res.status(500).json({ message: "Что-то пошло не так, попробуйте еще..." });
  }
})


module.exports = router;