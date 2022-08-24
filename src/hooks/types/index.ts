import { Socket } from "socket.io-client";

export type SocketHook = (_cb?: SocketCallbacks) => ConnectSocket;

export type OnDataAdded = (_socket: Socket, _username: string) => void;

export type OnError = (_message: string) => void;

export type OnInvitation = (invites: Array<string>) => void;

export type OnFriendUpdated = (_friends: Array<string>) => void;

export type OnRoomnameReceived = (_roomname: string) => void;

export type OnMessageReceived = (_data: Chat) => void;

export type SocketCallbacks = {
  onDataAdded?: OnDataAdded;
  onError?: OnError;
  onInvitation?: OnInvitation;
  onFriendUpdated?: OnFriendUpdated;
  onRoomnameReceived?: OnRoomnameReceived;
  onMessageReceived?: OnMessageReceived;
};

export type Chat = {
  to: string;
  from: string;
  message: string;
};

export type ConnectSocket = (_username: string) => void;

export type SendEventType = (socket: Socket, data: Chat) => void;

export type RoomType = {
  friends: Array<string>;
  roomname: string;
  username: string;
};

export type SendRoomType = (socket: Socket, data: RoomType) => void;
