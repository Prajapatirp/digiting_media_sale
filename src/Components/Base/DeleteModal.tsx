import React from "react";
import { Button, Modal, ModalBody, Spinner } from "reactstrap";

interface DeleteModalProps {
  show?: boolean;
  onDeleteClick?: () => void;
  onCloseClick?: () => void;
  recordId?: string;
  loader?: boolean;
}

const DeleteModal: React.FC<DeleteModalProps> = ({
  show,
  onDeleteClick,
  onCloseClick,
  recordId,
  loader
}) => {
  return (
    <Modal fade={true} isOpen={show} toggle={onCloseClick} centered={true}>
      <ModalBody className="py-3 px-5">
        <div className="mt-2 text-center">
          <i className="ri-delete-bin-line display-5 text-danger"></i>
          <div className="mt-4 pt-2 fs-15 mx-4 mx-sm-5">
            <h4>Are you sure ?</h4>
            <p className="text-muted mx-4 mb-0">
              Are you sure you want to remove this record{" "}
              {recordId ? recordId : ""} ?
            </p>
          </div>
        </div>
        <div className="d-flex gap-2 justify-content-center mt-4 mb-2">
          <Button color="light" size="btn w-sm" onClick={onCloseClick}>
            Close
          </Button>
          <Button  
          color="danger" size="btn w-sm" onClick={onDeleteClick}>
            Yes, Delete It!
            {loader}
            {loader && <Spinner size="sm" className="me-2" />}{" "}
          </Button>
        </div>
      </ModalBody>
    </Modal>
  ) as unknown as JSX.Element;
};

export default DeleteModal;
