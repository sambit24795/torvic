import {
  FunctionComponent,
  PropsWithChildren,
  useRef,
  useState,
} from "react";
import axios from "axios";

import { Modal } from "../../ui";
import { classNames } from "../utils";
import { useFriends, useConnection } from "../../provider";
import { useClickOutside, useRoom } from "../../hooks";
import AvatarList from "../AvatarList";

enum Tabs {
  FRIENDS = "FRIENDS",
  INVITATIONS = "INVITATIONS",
}

const Sidebar: FunctionComponent<PropsWithChildren> = () => {
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [tab, setTab] = useState<Tabs>(Tabs.FRIENDS);
  const [input, setInput] = useState<string>("");
  const [error, setError] = useState<string>("");

  const {
    friendsData,
    setSelectedUser,
  } = useFriends();
  const { username, socketInstance } = useConnection();

  console.log({ friendsData });

  const ref = useRef<HTMLLabelElement>(null);

  const sendRoom = useRoom();

  useClickOutside(ref, () => {
    setModalOpen(false);
  });

  const selectTabHandler = (tab: Tabs) => {
    if (tab === Tabs.FRIENDS) {
      setTab(Tabs.FRIENDS);
    } else if (tab === Tabs.INVITATIONS) {
      setTab(Tabs.INVITATIONS);
    }
  };

  const submitHandler = async () => {
    const { data } = await axios.post("http://localhost:4000/api/invite-user", {
      username,
      friend: input.trim(),
    });

    if (data.type === "success") {
      setModalOpen(false);
    } else {
      setError(data.message);
    }
  };

  const avatarClickHandler = (name: string) => {
    if (tab === Tabs.INVITATIONS || !socketInstance) {
      return;
    }

    setSelectedUser(name);
    if (
      friendsData.userChats.get(`${name}-${username}`) ||
      friendsData.userChats.get(`${username}-${name}`)
    ) {
      return;
    }

    sendRoom(socketInstance, {
      friends: [name],
      roomname: `${username}-${name}`,
      username,
    });
    
  };

  return (
    <>
      <Modal id="my-modal" open={modalOpen} ref={ref}>
        <h3 className="text-lg font-bold">Invite your friend</h3>
        <div className="form-control">
          <p className="py-4">enter an username</p>
          <input
            type="text"
            placeholder="type here"
            className={classNames(
              "w-full max-w-xs input input-bordered input-primary",
              error ? "input-error" : ""
            )}
            value={input}
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
      <div className="flex flex-col justify-between h-full bg-base-100">
        <div className="flex items-center justify-center w-full h-12 px-5 py-12">
          <button
            className="w-full btn btn-primary modal-botton"
            onClick={() => setModalOpen(true)}
          >
            Add Friend
          </button>
        </div>
        <AvatarList
          onClick={avatarClickHandler}
          username={username}
          invitationList={
            tab === Tabs.INVITATIONS
              ? friendsData.invitations
              : friendsData.friends
          }
          selectedUser={friendsData.selectedUser}
          invitations={tab === Tabs.INVITATIONS}
        />
        <div className="relative btm-nav">
          <button
            className={classNames(
              "text-primary border-primary transition-all",
              tab === Tabs.FRIENDS ? "border-t" : ""
            )}
            onClick={selectTabHandler.bind(null, Tabs.FRIENDS)}
          >
            friends
          </button>
          <button
            className={classNames(
              "text-primary border-primary transition-all",
              tab === Tabs.INVITATIONS ? "border-t" : ""
            )}
            onClick={selectTabHandler.bind(null, Tabs.INVITATIONS)}
          >
            invitations
          </button>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
