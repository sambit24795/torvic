import { forwardRef, PropsWithChildren } from "react";
import { classNames } from "../../components/utils/index";

interface ModalProps extends PropsWithChildren {
  id: string;
  open: boolean;
  fullWidth?: boolean;
}

const Modal = forwardRef<HTMLLabelElement, ModalProps>(
  ({ id, open, fullWidth, children }, ref) => {
    return (
      <>
        <input type="checkbox" id={id} className="modal-toggle" />
        <label
          className={classNames(
            "modal cursor-pointer",
            open ? "modal-open" : ""
          )}
        >
          <label
            htmlFor={id}
            className={classNames(
              "relative modal-box",
              fullWidth ? "max-w-none p-0" : ""
            )}
            ref={ref}
          >
            {children}
          </label>
        </label>
      </>
    );
  }
);

export default Modal;
