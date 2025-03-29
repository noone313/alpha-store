import { categoryModel, productModel } from "../models/models.js";

export async function addProduct(req,res) {
    try {

        const categories = await categoryModel.findAll();
        res.status(200).render("product",{categories});
        
    } catch (error) {
        res.status(500).render("error", {message : error.message});
    }
}


export async function createProduct(req, res) {

    try {

      const {
        productName,
        productPrice,
        productDiscount,
        productDescription,
        categoryName,
      } = req.body;
  
      // التحقق من وجود جميع الحقول المطلوبة
      if (
        !productName ||
        !productPrice ||
        !productDescription ||
        !categoryName
      ) {
        return res.status(400).render("error", { message: "جميع الحقول مطلوبة" });
      }
  
      // التحقق من رفع الصورة
      if (!req.file) {
        return res.status(400).render("error", { message: "الصورة مطلوبة" });
      }
  
      // البحث عن الفئة بناءً على اسم الفئة
      const productCategory = await categoryModel.findOne({
        where: { categoryName },
      });
  
      if (!productCategory) {
        return res
          .status(400)
          .render("error", { message: "الفئة غير موجودة" });
      }
  

      if (productDiscount == ''){


 // إنشاء المنتج باستخدام بيانات الطلب ومعرف الفئة المستخرج
 await productModel.create({
    productName,
    productPrice,
    productDiscount:null,
    productDescription,
    productImage: req.file.path,
    categoryId: productCategory.categoryId,
  });

      } else {


 // إنشاء المنتج باستخدام بيانات الطلب ومعرف الفئة المستخرج
 await productModel.create({
    productName,
    productPrice,
    productDiscount,
    productDescription,
    productImage: req.file.path,
    categoryId: productCategory.categoryId,
  });

      }
      
  
      return res.status(201).redirect('/dashboard/addProducts')

    } catch (error) {
      return res.status(500).render("error", { message: error.message });
    }
  }
  

  export async function showOneProduct(req, res) {
    try {
        const productId = req.params.id;

        // جلب المنتج المطلوب مع معلومات الفئة
        const oneProduct = await productModel.findByPk(productId, {
            include: [{
                model: categoryModel,
                attributes: ['categoryId', 'categoryName'],
            }],
        });

        if (!oneProduct) {
            return res.status(404).render("error", { message: "المنتج غير موجود" });
        }

        res.status(200).render("oneProduct", { oneProduct });
    } catch (error) {
      return res.status(500).render("error", { message: error.message });
    }
}


export async function allProducts(req,res){

  try {

    const products = await productModel.findAll({
      include:[{
        model:categoryModel,
        attributes:['categoryId','categoryName']
      }]
    });

    res.status(200).render("allProducts",{products});
    
  } catch (error) {
    return res.status(500).render("error", { message: error.message });
  }
}


export async function getUpdateProduct(req, res) {
  try {
    const { productId } = req.params;

    const product = await productModel.findByPk(productId, {
      include: [
        {
          model: categoryModel,
          attributes: ["categoryId", "categoryName"],
        },
      ],
    });

    if (!product) {
      return res.status(404).render("error", { message: "المنتج غير موجود" });
    }

    const categories = await categoryModel.findAll();

    return res.render("updateProduct", { product, categories });
  } catch (error) {
    return res.status(500).render("error", { message: error.message });
  }
}



export async function updateProduct(req, res) {
  try {
    const {
      productId,
      productName,
      productPrice,
      productDiscount,
      productDescription,
      categoryName,
    } = req.body;

    // التحقق من وجود جميع الحقول المطلوبة
    if (!productId || !productName || !productPrice || !productDescription || !categoryName) {
      return res.status(400).render("error", { message: "جميع الحقول مطلوبة" });
    }

    // البحث عن المنتج الحالي
    const existingProduct = await productModel.findByPk(productId);
    if (!existingProduct) {
      return res.status(404).render("error", { message: "المنتج غير موجود" });
    }

    // البحث عن الفئة بناءً على اسم الفئة
    const productCategory = await categoryModel.findOne({
      where: { categoryName },
    });

    if (!productCategory) {
      return res.status(400).render("error", { message: "الفئة غير موجودة" });
    }

    // التحقق مما إذا كان هناك صورة جديدة مرفوعة
    const productImage = req.file ? req.file.path : existingProduct.productImage;

    const discountValue = productDiscount === '' ? null : productDiscount;

    // تحديث بيانات المنتج
    await productModel.update(
      {
        productName,
        productPrice,
        productDiscount: discountValue,
        productDescription,
        productImage, 
        categoryId: productCategory.categoryId,
      },
      {
        where: { productId: productId },
      }
    );

    return res.status(200).redirect('/dashboard/updateProducts/' + productId);
  } catch (error) {
    return res.status(500).render("error", { message: error.message });
  }
}


export async function dashboardProducts(req, res) {
  try {
    // استعلام لجلب الفئات
    const products = await productModel.findAll();
    
    if (!products.length) {
      return res.status(404).render("dashboardProducts", { message: "لا توجد منتجات حالياً." });
    }

    // إرسال الفئات إلى واجهة المستخدم
    res.status(200).render("dashboardProducts", { products });
    
  } catch (error) {
    // معالجة الأخطاء بشكل صحيح
    return res.status(500).render("error", { message: error.message });
  }
}



export async function deleteProduct(req, res) {
  try {
    const { productId } = req.body;

    // التحقق من إدخال معرف المنتج
    if (!productId) {
      return res.status(400).render("error", { message: "معرف المنتج مطلوب" });
    }

    // البحث عن المنتج في قاعدة البيانات
    const product = await productModel.findByPk(productId);
    if (!product) {
      return res.status(404).render("error", { message: "المنتج غير موجود" });
    }

    // حذف المنتج
    await product.destroy();

    // إعادة التوجيه إلى صفحة المنتجات (أو لوحة التحكم الخاصة بالمنتجات)
    return res.status(200).redirect("/dashboard/updateProducts");
  } catch (error) {
    return res.status(500).render("error", { message: error.message });
  }
}
