import  express  from 'express';
import { config } from 'dotenv';
import { userRouter } from './route/user.route.js';
import { startServer } from './models/models.js';
import cors from 'cors'; 
import cookieParser from 'cookie-parser';
import { homeRouter } from './route/home.route.js';
import { productRouter } from './route/product.route.js';
import { categoryRouter } from './route/category.route.js';
import { orderRouter } from './route/order.route.js';
import { searchRouter } from './route/search.route.js';
import { dashboardRouter } from './route/dashboard.route.js';

// تحميل متغيرات البيئة
config();

// تهيئة تطبيق Express
const app = express();

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser()); 
app.use(cors()); 
app.use('/uploads', express.static('uploads'));
app.set('view engine', 'ejs');
app.set('views', 'views');

// Routes
app.use('/', userRouter);
app.use("/", homeRouter);
app.use("/", productRouter);
app.use("/", categoryRouter);
app.use("/",orderRouter);
app.use("/",searchRouter);
app.use("/", dashboardRouter);

startServer();

// بدء الخادم
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 الخادم يعمل على: http://localhost:${PORT}`);
});