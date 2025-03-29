import { orderItemModel, orderModel, productModel } from '../models/models.js';



// دالة لاسترجاع الطلبات الخاصة بالمستخدم الحالي مع تفاصيل عناصر الطلب والمنتجات
export async function userOrder(req, res) {
  try {
    // البحث عن جميع الطلبات التي تخص المستخدم الحالي مع ضم عناصر الطلب والمنتجات
    const orders = await orderModel.findAll({
      where: { userId: req.user.userId },
      include: [{
        model: orderItemModel,
        include: [productModel]
      }],
      order: [['createdAt', 'DESC']]
    });
    
    res.render("yourOrder", { orders });
  } catch (error) {
    return res.status(500).render("error", { message: error.message });
  }
}

export async function addOrder(req, res) {
  // استخراج البيانات من الطلب والتحقق منها
  const { productId } = req.body;
  if (!productId) {
    return res.status(400).render('error', { message: 'بيانات المنتج غير صحيحة' });
  }

  
 

  try {
    // التحقق من وجود المنتج
    const product = await productModel.findOne({ where: { productId } });
    if (!product) {
      
      return res.status(404).render('error', { message: 'المنتج غير موجود' });
    }

    // إنشاء الطلب وربطه بالمستخدم الحالي
    const order = await orderModel.create(
      { userId: req.user.userId }
    );

    // إنشاء عنصر الطلب وربطه بالطلب والمنتج
    await orderItemModel.create(
      {
        orderId: order.orderId,
        productId: product.productId,
        quantity:1,
        price: product.productPrice,
      }
    );

 

    // إعادة توجيه المستخدم مع تمرير رسالة نجاح عبر سلسلة الاستعلام
    res.redirect('/yourOrders');

  } catch (error) {
    
    return res.status(500).render("error", { message: error.message });
  }
}


export async function dashboardOrders(req, res) {
  try {
    const { orderStatus } = req.params;
    
    const orders = await orderModel.findAll({
      where: orderStatus ? { orderstatus: orderStatus } : {},
      include: [{
        model: orderItemModel,
        include: [productModel]
      }],
      order: [['createdAt', 'DESC']]
    });
    console.log(orders);

    // تحويل الكائنات إلى كائنات عادية لتسهيل استخدامها في EJS
    const plainOrders = orders.map(order => order.get({ plain: true }));

    console.log(plainOrders);
    res.render('dashboardOrders', {
      orders: plainOrders,
      orderStatus: orderStatus || undefined
    });

  } catch (error) {
    return res.status(500).render("error", { 
    message: error.message || "حدث خطأ أثناء جلب الطلبات" 
    });
  }
}


export async function updateOrderStatus(req, res) {
  const { orderId,orderStatus } = req.body;

  try {
    // تحديث حالة الطلب
    await orderModel.update(
      { orderstatus:orderStatus },
      { where: { orderId } }
    );

    res.redirect('/dashboard/orders/'+orderStatus);
  } catch (error) {
    return res.status(500).render("error", { message: error.message });
  }
}



export async function deleteOrder(req, res) {
  const { orderId } = req.body;
  try {
    // حذف الطلب
    await orderModel.destroy({ where: { orderId } });
    res.redirect('/dashboard/orders/false');
  } catch (error) {
    return res.status(500).render("error", { message: error.message });
  }
}



