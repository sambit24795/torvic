import { Socket } from "socket.io-client";

export type SocketHook = (_cb?: SocketCallbacks) => ConnectSocket;

export type OnDataAdded = (_socket: Socket, _username: string) => void;

export type OnError = (_message: string) => void;

export type OnInvitation = (invites: Array<string>) => void;

export type OnFriendUpdated = (_friends: Array<string>) => void;

export type SocketCallbacks = {
  onDataAdded?: OnDataAdded;
  onError?: OnError;
  onInvitation?: OnInvitation;
  onFriendUpdated?: OnFriendUpdated;
};

export type ConnectSocket = (_username: string) => void;
