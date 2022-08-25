import {
  createContext,
  FunctionComponent,
  useContext,
  PropsWithChildren,
} from "react";
import { useState } from "react";
import { Socket } from "socket.io-client";

import { useSocket } from "../../hooks";
import { Chat, ConnectSocket, Room } from "../../hooks/types";

type ConnectionContextType = {
  socketInstance: Socket | null;
  username: string;
  connectSocket: ConnectSocket;
  error: string;
  setSocketData: (socket: Socket, socketUser: string) => void;
  onError: (message: string) => void;
  invites: Array<string>;
  friends: Array<string>;
  room: Room | null;
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
  room: null,
  chat: null,
});

const ConnectionProvider: FunctionComponent<PropsWithChildren> = ({
  children,
}) => {
  const [socketInstance, setSocketInstance] = useState<Socket | null>(null);
  const [username, setUsername] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [invites, setInvites] = useState<Array<string>>([]);
  const [friends, setFriends] = useState<Array<string>>([]);
  const [room, setRoom] = useState<Room | null>(null);
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
    onRoomnameReceived: (data) => {
      console.log("connection roomname", data);
      setRoom(data);
    },
    onMessageReceived: (data) => {
      console.log("connection chat", data);
      setChat(data);
    },
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
        room,
        chat,
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
