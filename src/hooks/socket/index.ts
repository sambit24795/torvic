import io, { Socket } from "socket.io-client";
import { SocketCallbacks } from "../types/index";

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
  };
}

export default useSocket;
