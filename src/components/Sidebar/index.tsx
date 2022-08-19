import React, {
  FunctionComponent,
  PropsWithChildren,
  useEffect,
  useRef,
  useState,
} from "react";
import { Modal } from "../../ui";

import { classNames } from "../utils";

const Sidebar: FunctionComponent<PropsWithChildren> = ({ children }) => {
  const [friendsSelected, setFriendsSelected] = useState<boolean>(false);
  const [modalOpen, setModalOpen] = useState<boolean>(false);

  const ref = useRef<HTMLLabelElement>(null);

  const friendsSelectHandler = () => {
    setFriendsSelected((prevState) => !prevState);
  };

  useEffect(() => {
    function handleClickOutside(event: MouseEvent): void {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setModalOpen(false);
      }
    }
    // Bind the event listener
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      // Unbind the event listener on clean up
      document.removeEventListener("mousedown", handleClickOutside);
    };
  });

  return (
    <>
      <Modal id="my-modal" open={modalOpen} ref={ref}>
        <h3 className="text-lg font-bold">Enter the friend email id</h3>
        <div className="form-control">
          <p className="py-4">enter the email id</p>
          <input
            type="text"
            placeholder="test@test.com"
            className="w-full max-w-xs input input-bordered input-primary"
          />
        </div>
        <div className="modal-action">
          <button
            onClick={() => setModalOpen(false)}
            className="btn btn-primary"
          >
            submit
          </button>
        </div>
      </Modal>
      <div className="flex flex-col justify-between h-full bg-base-100">
        <div className="flex items-center justify-center w-full h-12 px-5 py-12">
          <button
            className="w-full btn btn-primary modal-botton"
            onClick={() => setModalOpen(true)}
          >
            Add Friend
          </button>
        </div>
        {children}
        <div className="relative btm-nav">
          <button
            className={classNames(
              "text-primary border-primary transition-all",
              friendsSelected ? "border-t" : ""
            )}
            onClick={friendsSelectHandler}
          >
            friends
          </button>
          <button
            className={classNames(
              "text-primary border-primary transition-all",
              friendsSelected ? "" : "border-t"
            )}
            onClick={friendsSelectHandler}
          >
            invitations
          </button>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
