import { forwardRef, PropsWithChildren } from "react";
import { classNames } from "../../components/utils/index";

interface ModalProps extends PropsWithChildren {
  id: string;
  open: boolean;
}

const Modal = forwardRef<HTMLLabelElement, ModalProps>(
  ({ id, open, children }, ref) => {
    return (
      <>
        <input type="checkbox" id={id} className="modal-toggle" />
        <label
          className={classNames(
            "modal cursor-pointer",
            open ? "modal-open" : ""
          )}
        >
          <label htmlFor={id} className="relative modal-box" ref={ref}>
            {children}
          </label>
        </label>
      </>
    );
  }
);

export default Modal;
