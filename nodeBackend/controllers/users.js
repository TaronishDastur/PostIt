const User = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

exports.signup = (req, res, next) => {
  bcrypt.hash(req.body.password, 10).then((password) => {
    const user = new User({
      email: req.body.email,
      password: password,
    });
    user
      .save()
      .then((data) =>
        res.status(201).json({
          message: "user add success",
          user: {
            ...data,
            id: data._id,
          },
        })
      )
      .catch((err) => {
        return res.status(500).json({
          message: "signup failed",
        });
      });
  });
};

exports.login = (req, res, next) => {
  let user;
  User.findOne({ email: req.body.email })
    .then((usr) => {
      if (!usr) {
        return res.status(404).json({
          message: "incorrect email",
        });
      }
      user = usr;
      return bcrypt.compare(req.body.password, usr.password);
    })
    .then((compareRes) => {
      if (!compareRes) {
        return res.status(401).json({
          message: "incorrect password",
        });
      }
      const token = jwt.sign(
        { email: user.email, userId: user._id },
        "thisIsMySuperSecretCode",
        {
          expiresIn: "1h",
        }
      );

      return res.status(200).json({
        message: "login success",
        token: token,
        expiresIn: 60,
        userId: user._id,
      });
    })
    .catch((err) => {
      return res.status(401).json({
        message: "authentication failed",
        error: err,
      });
    });
};
