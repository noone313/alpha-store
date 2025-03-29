import pkg from 'jsonwebtoken';
const { verify } = pkg;

export function verifyToken(req, res, next) {
  // جلب التوكن من الكوكيز
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).render("error",{ message: "غير مصرح به سجل الدخول اولاً" });
  }

  try {
    // التحقق من صحة التوكن
    const decoded = verify(token, process.env.JWT_SECRET);
    req.user = decoded; // إضافة معلومات المستخدم إلى الطلب
    next();
  } catch (error) {
    res.status(500).render("error", { message: error.message });
  }
}