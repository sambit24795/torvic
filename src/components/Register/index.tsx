import { useRef, useState } from "react";
import { Modal } from "../../ui";
import { useConnection } from "../../provider/connection/index";
import { classNames } from "../utils/index";

const Register = () => {
  const [input, setInput] = useState<string>("");
  //const [error, setError] = useState<string>("");

  const modalRef = useRef<HTMLLabelElement>(null);

  const { connectSocket, username, socketInstance, error } = useConnection();

  const submitHandler = () => {
    connectSocket(input.trim());
  };

  return (
    <Modal
      id="my-username-modal"
      open={!socketInstance && !username}
      ref={modalRef}
    >
      <h3 className="text-lg font-bold">Enter your name</h3>
      <div className="form-control">
        <p className="py-4">enter an username</p>
        <input
          type="text"
          placeholder="type here"
          className={classNames(
            "w-full max-w-xs input input-bordered input-primary",
            error ? "input-error" : ""
          )}
          onChange={(e) => setInput(e.target.value)}
        />
        {error ? <p className="py-1 text-sm text-error">{error}</p> : null}
      </div>
      <div className="modal-action">
        <button onClick={submitHandler} className="btn btn-primary">
          submit
        </button>
      </div>
    </Modal>
  );
};

export default Register;
