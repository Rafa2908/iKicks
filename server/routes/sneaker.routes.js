import { Router } from "express";
import {
  createSneaker,
  deleteSneakerById,
  getAllSneakers,
  getSneakerByBrand,
  getSneakerById,
  updateSneakerById,
} from "../controllers/sneaker.controllers.js";

const sneakerRouter = Router();

sneakerRouter.route("/").post(createSneaker).get(getAllSneakers);

sneakerRouter
  .route("/:id")
  .get(getSneakerById)
  .put(updateSneakerById)
  .delete(deleteSneakerById);

sneakerRouter.route("/brand/:brand").get(getSneakerByBrand);

export default sneakerRouter;
