import { addNewProduct } from "../../../service/product.service";
import ProductForm from "./ProductForm";

const initialState = {
  name: "",
  brand: "",
  colorway: "",
  category: "",
  description: "",
  price: "",
  images: [null, null, null, null],
  sizes: {},
};

const CreateForm = () => (
  <ProductForm submitFunction={addNewProduct} initialState={initialState} />
);

export default CreateForm;
