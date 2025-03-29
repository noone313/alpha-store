import { check } from "express-validator";

export const registerValidationRules = [
  check("userName")
    .trim()
    .notEmpty()
    .withMessage("اسم المستخدم مطلوب"),
  check("mobile")
    .trim()
    .notEmpty()
    .withMessage("رقم الجوال مطلوب")
    .matches(/^[0-9]+$/)
    .withMessage("يجب أن يحتوي رقم الجوال على أرقام فقط"),
  check("email")
    .trim()
    .isEmail()
    .withMessage("يرجى إدخال بريد إلكتروني صحيح")
    .normalizeEmail(),
  check("password")
    .notEmpty()
    .withMessage("كلمة المرور مطلوبة")
    .isLength({ min: 6 })
    .withMessage("يجب أن تكون كلمة المرور 6 أحرف على الأقل"),
  check("address")
    .trim()
    .notEmpty()
    .withMessage("العنوان مطلوب")
];
