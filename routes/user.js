const router = require("express").Router();
const User = require("../models/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { requireLogin } = require("../middle/auth");

// Registro usuario
router.post("/register", async (req, res) => {
  const { name, email, password } = req.body;
  try {
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ error: "El usuario ya existe" });
    }
    const hash_password = await bcrypt.hash(password, 10);
    user = new User({
      name,
      email,
      password: hash_password,
    });
    await user.save();
    return res.status(201).json({ message: "Usuario creado" });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: "Error del servidor" });
  }
});

// Login usuario
router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    let user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ error: "Credenciales invalidas" });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: "Credenciales invalidas" });
    }
    const Token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });
    return res.json({ Token }); // return res.status(200).json({message: "Login exitoso"})
  } catch (err) {
    console.log(err.message);
  }
});

router.get("/", requireLogin, async (req, res) => {
  console.log(req.user);
  try {
    const user = await User.findById(req.user._id).select("-password");
    res.json(user);
  } catch (err) {
    console.log(err);
  }
});

module.exports = router;
