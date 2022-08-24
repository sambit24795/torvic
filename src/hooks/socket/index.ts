import io, { Socket } from "socket.io-client";
import { SocketCallbacks, Chat, RoomType } from "../types";

let socket: Socket | null;

function connect(username?: string) {
  if (!socket) {
    socket = io("http://localhost:4000", {
      auth: { user: { username } },
    });
  }

  return socket;
}

function useSocket(cb?: SocketCallbacks) {
  return function (username?: string) {
    if (!username && !socket) {
      return;
    }

    const socketInstance = connect(username);

    socketInstance.on("error", (err) => {
      console.log("got an error", err);
      if (cb?.onError) {
        cb.onError(err.message);
      }
    });

    socketInstance.on("add-user", (data) => {
      console.log("user added", data.user);
      if (cb?.onDataAdded) {
        cb.onDataAdded(socketInstance!, data.user.username);
      }
    });

    socketInstance.on("invite-user", (data) => {
      console.log("invitations", data);
      if (cb?.onInvitation) {
        cb.onInvitation(data.userInvitations);
      }
    });

    socketInstance.on("add-friend", (data) => {
      console.log("friends", data);
      if (cb?.onFriendUpdated) {
        cb.onFriendUpdated(data.friends);
      }
    });

    socketInstance.on("receive-message", (data) => {
      console.log("received message", data);
      if (cb?.onMessageReceived) {
        cb.onMessageReceived(data);
      }
    });

    socketInstance.on("receive-room", (data) => {
      console.log("received room", data);
      if (cb?.onRoomnameReceived) {
        cb.onRoomnameReceived(data);
      }
    });
  };
}

export function useEvent() {
  return function (socket: Socket, data: Chat) {
    socket.emit("send-message", data);
  };
}

export function useRoom() {
  return function (socket: Socket, data: RoomType) {
    socket.emit("send-room", data);
  };
}

export default useSocket;
