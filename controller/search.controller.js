import { categoryModel, productModel } from "../models/models.js";
import { Op } from "sequelize";

// كائن لتعيين معايير الترتيب
const SORT_MAPPING = {
  price: 'productPrice',
  discount: 'productDiscount',
  name: 'productName'
};

// تحقق من صحة معاملات الترتيب
const validateSortParams = (sortBy, order) => {
  const validSortFields = Object.keys(SORT_MAPPING);
  const validOrders = ['ASC', 'DESC'];
  
  if (sortBy && !validSortFields.includes(sortBy.toLowerCase())) {
    throw new Error('معيار الترتيب غير صحيح');
  }
  
  if (order && !validOrders.includes(order.toUpperCase())) {
    throw new Error('اتجاه الترتيب غير صحيح');
  }
};

export async function search(req, res) {
  try {
    const { searchParam } = req.params;
    const { sortBy, order = 'ASC' } = req.query;
    
    // التحقق من صحة المعايير
    validateSortParams(sortBy, order);
    
    // بناء معايير الترتيب
    const orderClause = [];
    if (sortBy) {
      const dbColumn = SORT_MAPPING[sortBy.toLowerCase()];
      const direction = order.toUpperCase();
      orderClause.push([dbColumn, direction]);
    } else {
      // الترتيب الافتراضي حسب الأحدث إضافة
      orderClause.push(['createdAt', 'DESC']);
    }

    const products = await productModel.findAll({
      where: {
        productName: {
          [Op.iLike]: `%${searchParam}%`
        }
      },
      include: [{
        model: categoryModel,
        attributes: ['categoryId', 'categoryName'],
        required: false // لضمان إظهار المنتجات حتى بدون تصنيف
      }],
      order: orderClause,
    });

    res.status(200).render("search", { 
      products: products.map(p => p.toJSON()),
      queryParams: { sortBy, order },
        searchParam
    });
    
  } catch (error) {
    console.error('Search Error:', error);
    res.status(500).render("error", { 
      message: `خطأ في البحث: ${error.message}`,
      errorDetails: process.env.NODE_ENV === 'development' ? error.stack : null
    });
  }
}