const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const crypto = require("crypto");
const nodeMailer = require("nodemailer");

const app = express();
const port = 8000;
const cors = require("cors");
app.use(cors());

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const jwt = require("jsonwebtoken");

mongoose
  //.connect("mongodb+srv://omarmichael:Michael@cluster0.dpd2plg.mongodb.net/", {
  .connect("mongodb+srv://omarmichael:Michael@cluster0.dpd2plg.mongodb.net/", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.log("Error connecting to MongoDB", err);
  });

app.listen(port, () => {
  console.log("Server is running on port 8000");
});

const User = require("./models/user");
const Order = require("./models/order");

// Function to send verification token to the user
const sendVerificationEmail = async (email, verificationToken) => {
  // Create a nodemailer transport
  const transporter = nodeMailer.createTransport({
    // Configure the email service
    service: "gmail",
    auth: {
      user: "omarmichael41@gmail.com",
      pass: "nebldkidbhpyxyal",
    },
  });

  // Compose email message
  const mailOptions = {
    from: "amazon.com",
    to: email,
    subject: "Email Verification",
    text: `Please click the following link to verify your email : http://localhost:8000/verify/${verificationToken}`,
  };

  // Send the email
  try {
    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.log("Error sending verification email", error);
  }
};

// Endpoint to register in the app
app.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Check if email is already registered
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already registered" });
    }

    // Create a new user
    const newUser = new User({ name, email, password });

    // Generate and store the verification token
    newUser.verificationToken = crypto.randomBytes(20).toString("hex");

    // Save new user to the database
    await newUser.save();

    // Send verification email to the user
    sendVerificationEmail(newUser.email, newUser.verificationToken);
  } catch (error) {
    console.log("error registering user", error);
    res.status(500).json({ message: "Registration failed" });
  }
});

// Endpoint to verify the email
app.get("/verify/:token", async (req, res) => {
  try {
    const token = req.params.token;

    // Find the user with the given verification token
    const user = await User.findOne({ verificationToken: token });

    if (!user) {
      return res.status(404).json({ message: "Invalid verification token" });
    }

    // Mark user as verified
    user.verified = true;
    user.verificationToken = undefined;

    await user.save();

    res.status(200).json({ message: "Email verified successfully" });
  } catch {
    res.status(500).json({ message: "Email Verification Failed" });
  }
});
