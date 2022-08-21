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
  error: string;
};

const ConnectionContext = createContext<ConnectionContextType>({
  socketInstance: null,
  username: "",
  connectSocket: () => {},
  error: "",
});

const ConnectionProvider: FunctionComponent<PropsWithChildren> = ({
  children,
}) => {
  const [socketInstance, setSocketInstance] = useState<Socket | null>(null);
  const [username, setUsername] = useState<string>("");
  const [error, setError] = useState<string>("");

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
  });

  return (
    <ConnectionContext.Provider
      value={{
        socketInstance,
        username,
        connectSocket,
        error,
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
