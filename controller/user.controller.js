import { userModel } from "../models/models.js";
import bcrypt from "bcryptjs";
import { config } from "dotenv";
config();
import { validationResult } from "express-validator";
import jwt from "jsonwebtoken";




export async function get_register(req, res) {
  try {
    res.status(200).render("register", { title: "Register" });
  } catch (error) {
    res.status(500).render("error",{message : error.message});
  }
}




export async function register(req, res) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).render("error",{ message: errors.array() });
  }

  try {
    const { userName, mobile, email, password, address } = req.body;
    

    if (!userName || !mobile || !email || !password || !address) {
      res.status(400).render("error",{message : "جميع الحقول مطلوبة"});
    }

    if (!req.file) {
      res.status(400).render("error",{message : "الصورة مطلوبة"});
    }

    const user = await userModel.findOne({ where: { email } });
    if (user) {
      res.status(400).render("error",{message : "الايميل مسجل مسبقاً"});
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await userModel.create({
      userName,
      mobile,
      email,
      password: hashedPassword,
      address,
      userImage : req.file.path 
    });

    res.redirect("/login")
  } catch (error) {
    if (error.message === 'Only images are allowed!') {
      return res.status(400).render("error",{ message: error.message });
    }
    res.status(500).render("error",{ message: error.message });
  }
}




export async function get_login(req,res) {
  try {
    res.status(200).render("login")
  } catch (error) {
    res.status(500).render("error",{ message: error.message });
  }
}




export async function login(req, res)  {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).render("error",{ message: errors.array() });
  }

  try {
    const { email, password } = req.body;

    // التحقق من وجود الحقول المطلوبة
    if (!email || !password) {
      return res.status(400).render("error",{ message: "جميع الحقول مطلوبة" });
    }

    // البحث عن المستخدم في قاعدة البيانات
    const user = await userModel.findOne({ where: { email } });
    if (!user) {
      return res.status(400).render("error",{ message: "بيانات الاعتماد غير صحيحة" });
    }

    // التحقق من صحة كلمة المرور
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).render("error",{ message: "بيانات الاعتماد غير صحيحة" });
    }

    // إنشاء التوكن (Access Token)
    const token = jwt.sign(
      {
        userId: user.userId,
        email: user.email,
        userName: user.userName,
        mobile: user.mobile,
        role: user.role || 'user', 
      },
      process.env.JWT_SECRET,
      { expiresIn: '30d' }
    );


    res.cookie('token', token, {
      httpOnly: true, // لمنع الوصول إلى الكوكي من JavaScript
      maxAge: 30 * 24 * 60 * 60 * 1000, // 30 يوم بالميلي ثانية
      sameSite: 'strict', // لمنع هجمات CSRF
    });

    
    return res.redirect("/");

  } catch (error) {
    res.status(500).render("error",{ message: error.message });
  }
};