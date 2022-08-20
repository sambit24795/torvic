import io from "socket.io-client";
import { OnDataAdded, OnError } from "../types/";

function useSocket() {
  return function (
    username: string,
    onDataAdded?: OnDataAdded,
    onError?: OnError
  ) {
    if (!username) {
      return;
    }

    const socket = io("http://localhost:4000", {
      auth: { user: { username } },
    });

    socket.on("connect", () => {
      console.log("connected with the server", socket!.id);
    });

    socket.on("error", (err) => {
      console.log("got an error", err);
      if (onError) {
        onError(err.message);
      }
    });

    socket.on("add-user", (data) => {
      console.log("user added", data.user);
      if (onDataAdded) {
        onDataAdded(socket!, data.user.username);
      }
    });
  };
}

export default useSocket;
