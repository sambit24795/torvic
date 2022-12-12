import {
  FunctionComponent,
  PropsWithChildren,
  useEffect,
  useRef,
  useState,
} from "react";
import axios from "axios";

import { Modal, Menu, Badge } from "../../ui";
import { classNames } from "../utils";
import { useFriends, useConnection } from "../../provider";
import { useClickOutside, useRoom, useGroupRoom } from "../../hooks";
import AvatarList from "../AvatarList";
import { Socket } from "socket.io-client";

enum Tabs {
  FRIENDS = "FRIENDS",
  INVITATIONS = "INVITATIONS",
  GROUP = "GROUP",
}

const Sidebar: FunctionComponent<PropsWithChildren> = () => {
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [tab, setTab] = useState<Tabs>(Tabs.FRIENDS);
  const [input, setInput] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [menuUser, setMenuUser] = useState<
    Array<{ checked: boolean; item: string }>
  >([]);

  const { friendsData, setSelectedUser, setOnlineUsers, setSelectedGroup } =
    useFriends();
  const { username, socketInstance } = useConnection();

  const ref = useRef<HTMLLabelElement>(null);

  const allCheckedUsers = menuUser.filter((user) => user.checked);

  const allGroupInvitations =
    friendsData.groupInvitations
      .get(username)
      ?.map(({ groupname }) => groupname) ?? [];

  useEffect(() => {
    const allUsers: Array<{ checked: boolean; item: string }> = [];
    for (let i = 0; i < friendsData.onlineUsers.length; i++) {
      if (friendsData.onlineUsers[i] === username) {
        continue;
      }
      allUsers.push({ checked: false, item: friendsData.onlineUsers[i] });
    }
    setMenuUser(allUsers);
  }, [friendsData.onlineUsers, username]);

  const sendRoom = useRoom();
  const sendGroupRoom = useGroupRoom();

  useClickOutside(ref, () => {
    setModalOpen(false);
  });

  const selectTabHandler = async (tab: Tabs) => {
    setTab(tab);

    if (tab === Tabs.GROUP) {
      const { data, status } = await axios.get(
        "http://localhost:4000/api/online-user"
      );

      if (status === 200 && data) {
        setOnlineUsers(data.data);
      }
    }
  };

  const submitHandler = async (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    event.preventDefault();
    if (tab === Tabs.GROUP) {
      const { data } = await axios.post(
        "http://localhost:4000/api/invite-group",
        {
          username,
          invitedUsers: allCheckedUsers.map(({ item }) => item),
          groupname: input.trim(),
        }
      );

      if (data.type === "success") {
        setModalOpen(false);
      } else {
        setError(data.message);
      }
      return;
    }

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

  const groupHandler = (name: string, socketInstance: Socket) => {
    setSelectedUser(null);
    if (friendsData.groupChats.has(name)) {
      setSelectedGroup(name);
      return;
    }

    sendGroupRoom(socketInstance, {
      groupname: name,
      username,
    });
  };

  const friendHandler = (name: string, socketInstance: Socket) => {
    setSelectedGroup(null);
    const allRooms = [...friendsData.rooms];
    for (let i = 0; i < allRooms.length; i++) {
      const isUserCreator =
        allRooms[i].initiator === username &&
        allRooms[i].data.friends.find((friend) => friend === name);
      const isUserFriend =
        allRooms[i].initiator === name &&
        allRooms[i].data.friends.find((friend) => friend === username);

      if (isUserCreator || isUserFriend) {
        setSelectedUser({ user: name, token: allRooms[i].data.token });
        return;
      }
    }

    sendRoom(socketInstance, {
      friends: [name],
      roomname: `${username}-${name}`,
      username,
    });
  };

  const avatarClickHandler = (name: string, isGroup: boolean) => {
    if (tab === Tabs.INVITATIONS || !socketInstance) {
      return;
    }

    if (isGroup) {
      groupHandler(name, socketInstance);
      return;
    }

    friendHandler(name, socketInstance);
  };

  const menuSelectHandler = (index: number) => {
    const allUsers = [...menuUser];
    allUsers[index].checked = !allUsers[index].checked;
    setMenuUser(allUsers);
  };

  return (
    <>
      <Modal id="my-modal" open={modalOpen} ref={ref}>
        <h3 className="text-lg font-bold">Invite your friend</h3>
        <div className="form-control">
          <p className="py-4">
            {tab !== Tabs.GROUP ? "enter an username" : "enter groupname"}
          </p>
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
        {tab === Tabs.GROUP ? (
          <>
            <div className="my-4 form-control">
              <p className="py-4">select users</p>
              <div className="flex flex-col w-full lg:flex-row">
                <Menu items={menuUser} selectHandler={menuSelectHandler} />

                <div className="flex flex-col items-center justify-start flex-grow h-56 gap-3 p-4 overflow-y-auto rounded-box scrollbar">
                  {allCheckedUsers.length
                    ? allCheckedUsers.map((user, index) => (
                        <Badge gap={2} name={user.item} key={index} />
                      ))
                    : null}
                </div>
              </div>

              {error ? (
                <p className="py-1 text-sm text-error">{error}</p>
              ) : null}
            </div>
          </>
        ) : null}
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
            {tab === Tabs.GROUP ? "Add Group" : "Add Friend"}
          </button>
        </div>
        {tab === Tabs.FRIENDS || tab === Tabs.INVITATIONS ? (
          <AvatarList
            onClick={avatarClickHandler}
            username={username}
            invitationList={
              tab === Tabs.INVITATIONS
                ? friendsData.invitations
                : friendsData.friends
            }
            selectedUser={friendsData.selectedUser?.user ?? ""}
            invitations={tab === Tabs.INVITATIONS}
            isGroup={false}
          />
        ) : null}
        {tab === Tabs.GROUP || tab === Tabs.INVITATIONS ? (
          <AvatarList
            onClick={avatarClickHandler}
            username={username}
            invitationList={
              tab === Tabs.INVITATIONS
                ? allGroupInvitations
                : friendsData.groups
            }
            selectedUser={friendsData.selectedGroup!}
            invitations={tab === Tabs.INVITATIONS}
            isGroup
          />
        ) : null}
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
          <button
            className={classNames(
              "text-primary border-primary transition-all",
              tab === Tabs.GROUP ? "border-t" : ""
            )}
            onClick={selectTabHandler.bind(null, Tabs.GROUP)}
          >
            Groups
          </button>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
