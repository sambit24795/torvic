import React, { FunctionComponent } from "react";
import Navbar from "../Navbar";
import { useFriends, useConnection } from "../../provider";
import { classNames } from "../utils";
import MessageBox from "../MessageBox";
import { useEvent } from "../../hooks";

const Hero: FunctionComponent = () => {
  const {
    friendsData: { selectedUser, userChats, friends },
  } = useFriends();
  const { username, socketInstance } = useConnection();

  const sendEvent = useEvent();

  const chats = userChats.get(selectedUser?.token!);

  console.log({ userChats, chats });

  const sendHandler = (message: string) => {
    if (!socketInstance) {
      return;
    }

    console.log({ selectedUser });

    sendEvent(socketInstance, {
      from: username,
      to: selectedUser?.user!,
      message,
      token: selectedUser?.token!
    });
  };

  const isSelectedUserFriend = !!friends.find(
    (friend) => friend === selectedUser?.user
  );

  return (
    <div className="flex flex-col overflow-auto">
      {isSelectedUserFriend ? <Navbar username={selectedUser?.user!} /> : null}
      <div className="flex-col items-start justify-start flex-1 w-full h-full overflow-y-auto scrollbar hero-content ">
        {chats?.length ? (
          chats.map(({ from, message }, index) => (
            <div
              key={index}
              className={classNames(
                "w-4/5 ml-auto border card border-primary-content bg-base-100 overflow-visible",
                from === username ? "ml-0" : "mr-0"
              )}
            >
              <div className="card-body">
                <h2 className="card-title">{from}</h2>
                <p>{message}</p>
              </div>
            </div>
          ))
        ) : isSelectedUserFriend ? null : (
          <div className="flex items-center justify-center w-full h-full">
            <div className="items-center text-center hero-content">
              <div className="max-w-md">
                <h1 className="text-5xl font-bold">Hello there</h1>
                <p className="py-6">Make some friends and have fun</p>
              </div>
            </div>
          </div>
        )}
      </div>
      {isSelectedUserFriend ? <MessageBox sendHandler={sendHandler} /> : null}
    </div>
  );
};

export default Hero;
