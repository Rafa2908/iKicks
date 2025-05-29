import { updateSneakerById } from "../../../service/client.service";
import ProductForm from "./ProductForm";

const CreateForm = () => {
  const formData = {
    name: "",
    description: "",
    brand: "",
    price: "",
    image: {
      image1: "",
      image2: "",
      image3: "",
      image4: "",
    },
  };

  return (
    <ProductForm submitFunction={updateSneakerById} initialState={formData} />
  );
};

export default CreateForm;
