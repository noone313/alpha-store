import { userModel, productModel, categoryModel } from "../models/models.js";

export async function home(req, res) {
  try {
    const userinfo = await userModel.findOne({ where: { userId: req.user.userId } });

    // جلب المنتجات مع تضمين اسم الفئة
    const products = await productModel.findAll({
      include: [
        {
          model: categoryModel, // تضمين جدول الفئات
          attributes: ['categoryName'], // جلب اسم الفئة فقط
        },
      ],
    });

    const categories = await categoryModel.findAll();

    res.status(200).render("index", { title: "Home", products, categories, userinfo });
  } catch (error) {
    res.status(500).render("error", { message: error.message });
  }
}