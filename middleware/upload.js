import multer from 'multer';
import path from 'path';
import fs from 'fs';

// دالة لإنشاء المجلد إذا لم يكن موجودًا
const ensureDirExists = (dir) => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
};

// التأكد من وجود المجلدات المطلوبة
ensureDirExists('uploads/products');
ensureDirExists('uploads/users');
ensureDirExists('uploads/categories');
// إعداد التخزين الخاص بالمنتجات
const productStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/products');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const categoryStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/products');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

// إعداد التخزين الخاص بالمستخدمين
const userStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/users');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

// دالة التحقق من نوع الملف لقبول الصور فقط
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Only images are allowed!'), false);
  }
};

// دالة رفع صورة المنتج
export const uploadProductImage = multer({ 
  storage: productStorage,
  fileFilter: fileFilter
});

// دالة رفع صورة المستخدم
export const uploadUserImage = multer({ 
  storage: userStorage,
  fileFilter: fileFilter
});

// دالة رفع صورة المستخدم
export const uploadcategoryImage = multer({ 
  storage: userStorage,
  fileFilter: fileFilter
});