import { createSneaker } from "../../../service/client.service";
import ProductForm from "./ProductForm";

const CreateForm = () => {
  const blankForm = "";

  return (
    <ProductForm submitFunction={createSneaker} initialState={blankForm} />
  );
};

export default CreateForm;
