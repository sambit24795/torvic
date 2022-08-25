import {
  createContext,
  FunctionComponent,
  PropsWithChildren,
  useContext,
  useEffect,
  useReducer,
} from "react";

import { Chat, Room } from "../../hooks/types";
import { useConnection } from "../connection";

type FriendsContextType = {
  friendsData: FriendsState;
  setFriends: (_friends: Array<string>) => void;
  setInvitations: (_invitations: Array<string>) => void;
  setOnlineUsers: (_onlineUsers: Array<string>) => void;
  setSelectedUser: (_selectedUser: SelectedUser) => void;
  setUserChats: (_userChats: Map<string, Array<Chat>>) => void;
};

interface SelectedUser {
  user: string;
  token: string;
}

type UserChat = Omit<Chat, "token">;

interface FriendsState {
  friends: Array<string>;
  invitations: Array<string>;
  onlineUsers: Array<String>;
  selectedUser: SelectedUser | null;
  userChats: Map<string, Array<UserChat>>;
  rooms: Array<Room>;
}

enum ActionTypes {
  FRIENDS = "FRIENDS",
  INVITATIONS = "INVITATIONS",
  ONLINEUSERS = "ONLINEUSERS",
  SELECTEDUSER = "SELECTEDUSER",
  USERCHATS = "USERCHATS",
  ROOM = "ROOM",
}

interface Action {
  type: ActionTypes;
}

interface FriendsType extends Action {
  payload: Array<string>;
}

interface SelectedUserType extends Action {
  payload: SelectedUser;
}

interface UserChatsType extends Action {
  payload: Map<string, Array<UserChat>>;
}

interface RoomType extends Action {
  payload: Room;
}

type FriendsAction = FriendsType | SelectedUserType | UserChatsType | RoomType;

type FriendsReducer<T, U> = (_state: T, _action: U) => T;

const initialState: FriendsState = {
  friends: [],
  invitations: [],
  onlineUsers: [],
  selectedUser: null,
  userChats: new Map(),
  rooms: [],
};

const reducer: FriendsReducer<FriendsState, FriendsAction> = (
  state,
  action
) => {
  switch (action.type) {
    case ActionTypes.FRIENDS:
      return { ...state, friends: action.payload as string[] };
    case ActionTypes.INVITATIONS:
      return { ...state, invitations: action.payload as string[] };
    case ActionTypes.ONLINEUSERS:
      return { ...state, onlineUsers: action.payload as string[] };
    case ActionTypes.SELECTEDUSER:
      return { ...state, selectedUser: action.payload as SelectedUser };
    case ActionTypes.USERCHATS:
      return {
        ...state,
        userChats: action.payload as Map<string, Array<UserChat>>,
      };
    case ActionTypes.ROOM:
      const allRooms = [...state.rooms];
      allRooms.push(action.payload as Room);
      return { ...state, rooms: allRooms };
    default:
      return state;
  }
};

const FriendsContext = createContext<FriendsContextType>({
  friendsData: initialState,
  setFriends: () => {},
  setInvitations: () => {},
  setOnlineUsers: () => {},
  setUserChats: () => {},
  setSelectedUser: () => {},
});

const FriendsProvider: FunctionComponent<PropsWithChildren> = ({
  children,
}) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  const { invites, friends, room, chat, username } = useConnection();

  console.log("connection friend", { invites, friends, room, chat });

  useEffect(() => {
    setInvitations(invites);
    setFriends(friends);

    if (room) {
      setRoomData(room);
    }

    if (chat) {
      setChatData(chat);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [invites, friends, room, chat]);

  const setChatData = ({ token, to, from, message }: Chat) => {
    const allChats = state.userChats.get(token);

    console.log({ allChats });

    if (allChats) {
      allChats.push({ to, from, message });
      const userChats = new Map().set(token, allChats);
      setUserChats(userChats);
    }
  };

  const setRoomData = (room: Room) => {
    if (username === room.initiator && !state.userChats.has(room.data.token)) {
      createEmptyRoom(room);
      setSelectedUser({ user: room.data.friends[0], token: room.data.token });
      setRooms(room);
      return;
    }

    const isUserFriend = !!room.data.friends.find(
      (friend) => friend === username
    );
    if (isUserFriend && !state.userChats.has(room.data.token)) {
      createEmptyRoom(room);
      setRooms(room);
    }
  };

  const createEmptyRoom = (room: Room) => {
    const initialChatMap = state.userChats;
    const initialChat = initialChatMap.set(room.data.token, []);
    setUserChats(initialChat);
  };

  const setFriends = (friends: Array<string>) => {
    dispatch({ type: ActionTypes.FRIENDS, payload: friends });
  };

  const setInvitations = (invitations: Array<string>) => {
    dispatch({ type: ActionTypes.INVITATIONS, payload: invitations });
  };

  const setOnlineUsers = (onlineUsers: Array<string>) => {
    dispatch({ type: ActionTypes.ONLINEUSERS, payload: onlineUsers });
  };

  const setSelectedUser = (selectedUser: SelectedUser) => {
    dispatch({ type: ActionTypes.SELECTEDUSER, payload: selectedUser });
  };

  const setUserChats = (userChats: Map<string, Array<UserChat>>) => {
    dispatch({ type: ActionTypes.USERCHATS, payload: userChats });
  };

  const setRooms = (room: Room) => {
    dispatch({ type: ActionTypes.ROOM, payload: room });
  };

  return (
    <FriendsContext.Provider
      value={{
        friendsData: state,
        setFriends,
        setInvitations,
        setOnlineUsers,
        setSelectedUser,
        setUserChats,
      }}
    >
      {children}
    </FriendsContext.Provider>
  );
};

export const useFriends = () => {
  return useContext(FriendsContext);
};

export default FriendsProvider;
