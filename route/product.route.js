import {Router} from "express";
import { addProduct,createProduct, showOneProduct, updateProduct, getUpdateProduct, allProducts, deleteProduct, dashboardProducts } from "../controller/product.controller.js";
import { uploadProductImage } from "../middleware/upload.js";
const productRouter = Router();


productRouter.get("/dashboard/addProducts", addProduct);

productRouter.get("/products/:id", showOneProduct);

productRouter.post("/products",uploadProductImage.single('productImage'),createProduct);

productRouter.get("/allProducts", allProducts);

productRouter.get("/dashboard/updateProducts/:productId", getUpdateProduct);

productRouter.post("/updateProducts",uploadProductImage.single('productImage'),updateProduct);

productRouter.get("/dashboard/products", dashboardProducts);

productRouter.post("/deleteProduct",deleteProduct);


export { productRouter };
