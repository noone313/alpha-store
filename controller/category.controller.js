import { categoryModel, productModel, userModel } from "../models/models.js";


export async function showCategories(req,res) {

  try {

    const allCategories = await categoryModel.findAll();

    res.status(200).render("showCategories", { allCategories });

  } catch (error) {

    res.status(500).render("error", {message : error.message});

  }


}

export async function add_categories(req,res) {
    try {

        const categories = await categoryModel.findAll();

        res.status(200).render("category",{categories});
        
    } catch (error) {
        res.status(500).render("error", {message : error.message})
    }
}


export async function createCategories(req, res) {

    try {


      const { categoryName } = req.body;
  
      // التحقق من وجود جميع الحقول المطلوبة
      if ( !categoryName ) {
        return res.status(400).render("error", { message: "جميع الحقول مطلوبة" });
      }
  
      // التحقق من رفع الصورة
      if (!req.file) {
        return res.status(400).render("error", { message: "الصورة مطلوبة" });
      }

      await categoryModel.create({
        categoryName,
        categoryImage: req.file.path
      })


      return res.status(201).redirect('/dashboard/add_categories')

    } catch (error) {
      return res.status(500).render("error", { message: error.message });
    }
  }
  

  export async function getOneCategory(req, res) {
    try {
      
      const categoryId = req.params.id;
  
      // جلب المنتجات التي تنتمي إلى الفئة المحددة مع تضمين اسم الفئة
      const oneCategory = await productModel.findAll({
        where: { categoryId: categoryId }, 
        include: [
          {
            model: categoryModel, // تضمين جدول الفئات
            attributes: ['categoryName'], // جلب اسم الفئة فقط
          },
        ],
      });
  
      // جلب معلومات الفئة نفسها
      const categoryInfo = await categoryModel.findOne({
        where: { categoryId: categoryId },
      });
  
      res.status(200).render("oneCategory", { oneCategory, categoryInfo });
    } catch (error) {
      return res.status(500).render("error", { message: error.message });
    }
  }




export async function getUpdateCategory(req, res) {
    try {
      const { categoryId } = req.params;
  
      // البحث عن الفئة المطلوبة
      const category = await categoryModel.findByPk(categoryId);
  
      if (!category) {
        return res.status(404).render("error", { message: "الفئة غير موجودة" });
      }
  
      return res.render("updateCategory", { category });
    } catch (error) {
      return res.status(500).render("error", { message: error.message });
    }
  }



  export async function dashboardCategories(req, res) {
    try {
      // استعلام لجلب الفئات
      const categories = await categoryModel.findAll();
      
      if (!categories.length) {
        return res.status(404).render("dashboardCategories", { message: "لا توجد فئات حالياً." });
      }
  
      // إرسال الفئات إلى واجهة المستخدم
      res.status(200).render("dashboardCategories", { categories });
      
    } catch (error) {
      // معالجة الأخطاء بشكل صحيح
      console.error("Error fetching categories:", error);
      return res.status(500).render("error", { message: error.message });
    }
  }
  


  
export async function updateCategory(req, res) {
    try {
        const { categoryId, categoryName } = req.body;

        // التحقق من إدخال جميع الحقول المطلوبة
        if (!categoryId || !categoryName) {
            return res.status(400).render("error", { message: "جميع الحقول مطلوبة" });
        }

        // البحث عن الفئة المطلوبة
        const existingCategory = await categoryModel.findByPk(categoryId);
        if (!existingCategory) {
            return res.status(404).render("error", { message: "الفئة غير موجودة" });
        }

        // التحقق مما إذا كان هناك صورة جديدة مرفوعة
        const categoryImage = req.file ? req.file.path : existingCategory.categoryImage;

        // تحديث بيانات الفئة
        await categoryModel.update(
            {
                categoryName,
                categoryImage, // تحديث الصورة إذا تم رفع صورة جديدة
            },
            {
                where: { categoryId: categoryId },
            }
        );

        return res.status(200).redirect("/dashboard/updateCategory/"+categoryId);
    } catch (error) {
        return res.status(500).render("error", { message: error.message });
    }
}


export async function deleteCategory(req, res) {
  try {
      const { categoryId } = req.body; // استلام معرف الفئة من البيانات المرسلة

      // التحقق مما إذا كان المعرف موجودًا
      if (!categoryId) {
          return res.status(400).render("error", { message: "معرف الفئة مطلوب" });
      }

      // البحث عن الفئة المطلوبة
      const category = await categoryModel.findByPk(categoryId);
      if (!category) {
          return res.status(404).render("error", { message: "الفئة غير موجودة" });
      }

      // حذف الفئة
      await category.destroy();

      // إعادة التوجيه إلى لوحة التحكم بعد الحذف
      return res.status(200).redirect("/categories");
  } catch (error) {
      return res.status(500).render("error", { message: error.message });
  }
}
