import { Socket } from "socket.io-client";

export type SocketHook = () => ConnectSocket;

export type OnDataAdded = (_socket: Socket, _username: string) => void;

export type OnError = (_message: string) => void;

export type ConnectSocket = (
  username: string,
  onDataAdded?: OnDataAdded,
  onError?: OnError
) => void;
