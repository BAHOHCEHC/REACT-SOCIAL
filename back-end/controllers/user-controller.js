const bcrypt = require("bcryptjs");
const prisma = require("../prisma/prisma-client");
const jdenticon = require("jdenticon");
const path = require("path");
const fs = require("fs");
const jwt = require("jsonwebtoken");

const UserController = {
  register: async (req, res) => {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res
        .status(400)
        .json({ error: "Name, email, and password are required" });
    }

    try {
      const user = await prisma.user.findUnique({
        where: {
          email: email,
        },
      });

      if (user) {
        return res.status(409).json({ error: "User already exists" });
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      const png = jdenticon.toPng(name, 200);
      const avatarName = `${name}_${Date.now()}.png`;
      const avatarPath = path.join(__dirname, "../uploads", avatarName);
      fs.writeFileSync(avatarPath, png);

      const newUser = await prisma.user.create({
        data: {
          name,
          email,
          password: hashedPassword,
          avatarUrl: `/uploads/${avatarName}`,
        },
      });

      return res.status(201).json(newUser);
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        error: "An error occurred during registration",
        details: error.message,
      });
    }
  },
  login: async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }

    try {
      const user = await prisma.user.findUnique({
        where: {
          email: email,
        },
      });

      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(401).json({ error: "Invalid credentials" });
      }

      const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
        expiresIn: "1h",
      });

      return res.status(200).json({ token });
    } catch (error) {
      return res.status(500).json({ error: "An error occurred during login" });
    }
  },
  getUserById: async (req, res) => {
    const { id } = req.params;

    try {
      const user = await prisma.user.findUnique({
        where: { id },
        include: {
          followers: true,
          following: true,
        },
      });

      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      const isFollowing = await prisma.follows.findFirst({
        where: {
          AND: [{ followerId: req.user.id }, { followingId: id }],
        },
      });

      return res
        .status(200)
        .json({ ...user, isFollowing: Boolean(isFollowing) });
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        error: "An error occurred while fetching user details",
        details: error.message,
      });
    }
  },
  updateUser: async (req, res) => {
    const userId = req.params.id;
    const { name, email, password, dateOfBirth, bio, location } = req.body;
    let filePath = null;

    if (req.file) {
      filePath = `/uploads/${req.file.filename}`;
    }

    if (userId !== req.user.id) {
      return res
        .status(403)
        .json({ error: "You are not authorized to update this user" });
    }

    try {
      if (email) {
        const existingUser = await prisma.user.findFirst({
          where: {
            email: email,
          },
        });

        if (existingUser && existingUser.id !== userId) {
          return res.status(400).json({ error: "Email is already in use" });
        }
      }

      const user = await prisma.user.findUnique({
        where: {
          id: userId,
        },
      });
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
      const updatedUser = await prisma.user.update({
        where: {
          id: userId,
        },
        data: {
          name,
          email,
          avatarUrl: filePath || user.avatarUrl,
          dateOfBirth,
          bio,
          location,
        },
      });

      return res.status(200).json(updatedUser);
    } catch (error) {
      return res
        .status(500)
        .json({ error: "An error occurred while updating user details" });
    }
  },
  currentUser: async (req, res) => {
    try {
      const user = await prisma.user.findUnique({
        where: {
          id: req.user.id,
        },
        include: {
          followers: {
            include: {
              follower: true,
            },
          },
          following: {
            include: {
              following: true,
            },
          },
        },
      });

      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
      return res.status(200).json(user);
    } catch (error) {
      return res.status(500).json({
        error: "An error occurred while fetching current user details",
      });
    }
  },
};

module.exports = UserController;
