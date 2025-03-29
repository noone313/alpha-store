import { Router } from 'express';
import { verifyToken } from '../middleware/auth.js';
import {dashboardCategories ,showCategories ,createCategories, add_categories, getOneCategory, getUpdateCategory, updateCategory, deleteCategory } from '../controller/category.controller.js';
import { uploadcategoryImage } from '../middleware/upload.js'
const categoryRouter = Router();


categoryRouter.get("/categories",verifyToken,showCategories);

categoryRouter.get("/categories/:id",verifyToken,getOneCategory);

categoryRouter.get('/dashboard/add_categories',verifyToken, add_categories);

categoryRouter.post('/category', uploadcategoryImage.single('categoryImage'),verifyToken,createCategories);

categoryRouter.get("/dashboard/updateCategory/:categoryId",verifyToken, getUpdateCategory);

categoryRouter.post("/updateCategory",uploadcategoryImage.single('categoryImage'),verifyToken,updateCategory);

categoryRouter.post("/deleteCategory",verifyToken,deleteCategory);

categoryRouter.get("/dashboard/categories",verifyToken,dashboardCategories);

export { categoryRouter };