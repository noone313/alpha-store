import { Sequelize, DataTypes } from "sequelize";
import { config } from "dotenv";
config();

// إعداد الاتصال بقاعدة البيانات
const sequelize = new Sequelize(process.env.DB_URI, {
  dialect: "postgres",
  logging: false,
  dialectOptions: {
    ssl:
      process.env.NODE_ENV === "production"
        ? {
            require: true,
            rejectUnauthorized: false,
          }
        : false,
  },
});

// تعريف النماذج

const Category = sequelize.define("Category", 
  {
    categoryId: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    categoryName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    categoryImage: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  }
);

const User = sequelize.define(
  "User",
  {
    userId: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    userName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    mobile: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
      },
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    address: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    role: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "user",
    },
    userImage: {
      type: DataTypes.STRING,
      allowNull: true,
    }
  },
  {
    timestamps: true,
    createdAt: "createdAt",
    updatedAt: "updatedAt",
  }
);

const Product = sequelize.define("Product", {
  productId: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  productName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  productPrice: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  productDiscount: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  productDescription: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  productImage: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  categoryId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Category,
      key: "categoryId",
    },
  },
});

// علاقة المنتج بالفئة مع حذف متسلسل
Product.belongsTo(Category, {
  foreignKey: "categoryId",
  targetKey: "categoryId",
  onDelete: 'CASCADE',
});
Category.hasMany(Product, {
  foreignKey: "categoryId",
  sourceKey: "categoryId",
  onDelete: 'CASCADE',
});

const Order = sequelize.define("Order", {
  orderId: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: User,
      key: "userId",
    },
  },
  orderstatus: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  },
},
{
  timestamps: true,
  createdAt: "createdAt",
  updatedAt: "updatedAt",
});

// علاقة الطلب بالمستخدم مع حذف متسلسل
Order.belongsTo(User, {
  foreignKey: "userId",
  targetKey: "userId",
  onDelete: 'CASCADE',
});
User.hasMany(Order, {
  foreignKey: "userId",
  sourceKey: "userId",
  onDelete: 'CASCADE',
});

const OrderItem = sequelize.define("OrderItem", {
  orderItemId: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  orderId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Order,
      key: "orderId",
    },
  },
  productId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Product,
      key: "productId",
    },
  },
  quantity: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  price: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
});

// علاقات تفاصيل الطلب مع حذف متسلسل
OrderItem.belongsTo(Order, {
  foreignKey: "orderId",
  targetKey: "orderId",
  onDelete: 'CASCADE',
});
Order.hasMany(OrderItem, {
  foreignKey: "orderId",
  sourceKey: "orderId",
  onDelete: 'CASCADE',
});

OrderItem.belongsTo(Product, {
  foreignKey: "productId",
  targetKey: "productId",
  onDelete: 'CASCADE',
});
Product.hasMany(OrderItem, {
  foreignKey: "productId",
  sourceKey: "productId",
  onDelete: 'CASCADE',
});

// دالة بدء السيرفر ومزامنة قاعدة البيانات
const startServer = async () => {
  try {
    await sequelize.authenticate();
    console.log("✅ تم الاتصال بقاعدة البيانات");

    await sequelize.sync({ alter: true });
    console.log("🔄 تم تحديث الجداول تلقائيًا");
  } catch (error) {
    console.error("❌ خطأ فادح:", error);
    process.exit(1);
  }
};

export {
  sequelize,
  startServer,
  Category as categoryModel,
  Order as orderModel,
  Product as productModel,
  User as userModel,
  OrderItem as orderItemModel,
};
