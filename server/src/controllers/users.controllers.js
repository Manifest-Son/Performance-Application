import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const signupUser = async (req, res) => {
  const { fname, lname, email, password } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: {
        fname,
        lname,
        email,
        password: hashedPassword,
      },
    });
    res.status(201).json({ success: true, data: user });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

const loginUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return res.status(401).json({ error: "Invalid email or password" });
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: "Invalid email or password" });
    }
    const payload = {
      userId: user.userId,
      fname: user.fname,
      lname: user.lname,
      email: user.email,
      role: user.role,
      updatedAt: user.updatedAt,
      createdAt: user.createdAt,
      avatar: user.avatar,
    };
    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: "24h",
    });
    res.cookie("access_token", token).json({ success: true, data: payload });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
    res
      .status(500)
      .json({ success: false, message: "Server error. Please refresh." });
  }
};

const deleteUser = async (req, res) => {
  const { userId } = req.params;
  try {
    await prisma.user.delete({ where: { userId } });
    res
      .status(200)
      .send({ success: true, message: "User deleted successfully" });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

const updateUser = async (req, res) => {
  const { userId } = req.params;
  const { fname, lname, email, role, deptId } = req.body;
  try {
    const user = await prisma.user.update({
      where: { userId },
      data: { fname, lname, email, role, deptId },
    });
    res.json({ success: true, data: user });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

const getAllUsers = async (req, res) => {
  try {
    const users = await prisma.user.findMany();
    res.json(users);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const getUserById = async (req, res) => {
  const { userId } = req.params;
  try {
    const user = await prisma.user.findUnique({ where: { userId } });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    res.json(user);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export {
  signupUser,
  loginUser,
  deleteUser,
  updateUser,
  getAllUsers,
  getUserById,
};
