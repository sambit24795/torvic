import {
  createContext,
  FunctionComponent,
  useContext,
  PropsWithChildren,
} from "react";
import { useState } from "react";
import { Socket } from "socket.io-client";

import { useSocket } from "../../hooks";
import { ConnectSocket } from "../../hooks/types";

type ConnectionContextType = {
  socketInstance: Socket | null;
  username: string;
  connectSocket: ConnectSocket;
  setSocketData: (_socket: Socket, _SocketData: string) => void;
};

const ConnectionContext = createContext<ConnectionContextType>({
  socketInstance: null,
  username: "",
  connectSocket: () => ({
    error: null,
    socket: null,
    socketUser: null,
  }),
  setSocketData: () => {},
});

const ConnectionProvider: FunctionComponent<PropsWithChildren> = ({
  children,
}) => {
  const [socketInstance, setSocketInstance] = useState<Socket | null>(null);
  const [username, setUsername] = useState<string>("");

  const connectSocket = useSocket();

  const setSocketData = (socket: Socket, socketUser: string) => {
    setSocketInstance(socket);
    setUsername(socketUser);
  };

  return (
    <ConnectionContext.Provider
      value={{ socketInstance, username, connectSocket, setSocketData }}
    >
      {children}
    </ConnectionContext.Provider>
  );
};

export const useConnection = () => {
  return useContext(ConnectionContext);
};

export default ConnectionProvider;
