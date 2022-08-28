import { Socket } from "socket.io-client";
import { UserChat } from "../../provider/friends";

export type GroupData = { groupname: string; allMembers: Array<string> };

export type GroupInvitation = { user: string; data: GroupData };

export type SocketHook = (_cb?: SocketCallbacks) => ConnectSocket;

export type OnDataAdded = (_socket: Socket, _username: string) => void;

export type OnError = (_message: string) => void;

export type OnInvitation = (invites: Array<string>) => void;

export type OnFriendUpdated = (_friends: Array<string>) => void;

export type OnRoomnameReceived = (_data: Room) => void;

export type OnMessageReceived = (_data: ReceivedChat) => void;

export type OnGroupInvitationReceived = (_data: GroupInvitation) => void;

export type OnGroupAdded = (_data: Array<string>) => void;

export type OnGroupRoomReceived = (_data: GroupRoom) => void;

export type OnGroupMessageReceived = (_data: ReceivedGroupChat) => void;

export type SocketCallbacks = {
  onDataAdded?: OnDataAdded;
  onError?: OnError;
  onInvitation?: OnInvitation;
  onFriendUpdated?: OnFriendUpdated;
  onRoomnameReceived?: OnRoomnameReceived;
  onMessageReceived?: OnMessageReceived;
  onGroupInvited?: OnGroupInvitationReceived;
  onGroupAdded?: OnGroupAdded;
  onGroupRoomReceived?: OnGroupRoomReceived;
  onGroupMessageReceived?: OnGroupMessageReceived;
};

export type Chat = {
  to: string;
  from: string;
  message: string;
  token: string;
};

export type ConnectSocket = (_username: string) => void;

export type SendEventType = (socket: Socket, data: Chat) => void;

export type RoomType = {
  friends: Array<string>;
  roomname: string;
  username: string;
};

export type SendRoomType = (socket: Socket, data: RoomType) => void;

export type RoomData = {
  friends: Array<string>;
  token: string;
};

export type Room = {
  initiator: string;
  data: RoomData;
};

export type ReceivedChat = {
  token: string;
  data: Array<UserChat>;
};

export type GroupRoomType = {
  groupname: string;
  username: string;
};

export type GroupRoom = {
  initiator: string;
  members: Array<string>;
  token: string;
};

export type GroupChat = {
  from: string;
  message: string;
};

export type ReceivedGroupChat = {
  token: string;
  data: Array<GroupChat>;
};
