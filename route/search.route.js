import {Router} from "express";
import { search } from "../controller/search.controller.js";

const searchRouter = Router();

searchRouter.get("/search/:searchParam", search);

export { searchRouter };