import {
  createContext,
  FunctionComponent,
  useContext,
  PropsWithChildren,
} from "react";
import { useState } from "react";
import { Socket } from "socket.io-client";

import { useSocket } from "../../hooks";
import { Chat, ConnectSocket } from "../../hooks/types";

type ConnectionContextType = {
  socketInstance: Socket | null;
  username: string;
  connectSocket: ConnectSocket;
  error: string;
  setSocketData: (socket: Socket, socketUser: string) => void;
  onError: (message: string) => void;
  invites: Array<string>;
  friends: Array<string>;
  room: string;
  chat: Chat | null;
};

const ConnectionContext = createContext<ConnectionContextType>({
  socketInstance: null,
  username: "",
  connectSocket: () => {},
  error: "",
  setSocketData: () => {},
  onError: () => {},
  invites: [],
  friends: [],
  room: "",
  chat: null
});

const ConnectionProvider: FunctionComponent<PropsWithChildren> = ({
  children,
}) => {
  const [socketInstance, setSocketInstance] = useState<Socket | null>(null);
  const [username, setUsername] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [invites, setInvites] = useState<Array<string>>([]);
  const [friends, setFriends] = useState<Array<string>>([]);
  const [roomname, setRoomname] = useState<string>("");
  const [chat, setChat] = useState<Chat | null>(null);

  const setSocketData = (socket: Socket, socketUser: string) => {
    setSocketInstance(socket);
    setUsername(socketUser);
  };

  const onError = (message: string) => {
    setError(message);
  };

  const connectSocket = useSocket({
    onDataAdded: setSocketData,
    onError,
    onInvitation: (invites) => {
      console.log("connection invites", invites);
      setInvites(invites);
    },
    onFriendUpdated: (friends) => {
      console.log("connection friends", friends);
      setFriends(friends);
    },
    onRoomnameReceived: (roomname) => {
      console.log("connection roomname", roomname);
      setRoomname(roomname);
    },
    onMessageReceived: (data) => {
      console.log("connection chat", data);
      setChat(data);
    }
  });

  return (
    <ConnectionContext.Provider
      value={{
        socketInstance,
        username,
        connectSocket,
        error,
        setSocketData,
        onError,
        invites,
        friends,
        room: roomname,
        chat
      }}
    >
      {children}
    </ConnectionContext.Provider>
  );
};

export const useConnection = () => {
  return useContext(ConnectionContext);
};

export default ConnectionProvider;
