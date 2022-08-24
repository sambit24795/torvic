import {
  createContext,
  FunctionComponent,
  PropsWithChildren,
  useContext,
  useEffect,
  useReducer,
} from "react";

import { useSocket, useEvent, useRoom } from "../../hooks";
import { SendEventType, SendRoomType, Chat } from "../../hooks/types";
import { useConnection } from "../connection";

type FriendsContextType = {
  friendsData: FriendsState;
  setFriends: (_friends: Array<string>) => void;
  setInvitations: (_invitations: Array<string>) => void;
  setOnlineUsers: (_onlineUsers: Array<string>) => void;
  setSelectedUser: (_selectedUser: string) => void;
  setUserChats: (_userChats: Map<string, Array<Chat>>) => void;
};

interface FriendsState {
  friends: Array<string>;
  invitations: Array<string>;
  onlineUsers: Array<String>;
  selectedUser: string;
  userChats: Map<string, Array<Chat>>;
}

enum ActionTypes {
  FRIENDS = "FRIENDS",
  INVITATIONS = "INVITATIONS",
  ONLINEUSERS = "ONLINEUSERS",
  SELECTEDUSER = "SELECTEDUSER",
  USERCHATS = "USERCHATS",
}

interface Action {
  type: ActionTypes;
}

interface FriendsType extends Action {
  payload: Array<string>;
}

interface SelectedUserType extends Action {
  payload: string;
}

interface UserChatsType extends Action {
  payload: Map<string, Array<Chat>>;
}

type FriendsAction = FriendsType | SelectedUserType | UserChatsType;

type FriendsReducer<T, U> = (_state: T, _action: U) => T;

const initialState: FriendsState = {
  friends: [],
  invitations: [],
  onlineUsers: [],
  selectedUser: "",
  userChats: new Map(),
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
      return { ...state, selectedUser: action.payload as string };
    case ActionTypes.USERCHATS:
      return {
        ...state,
        userChats: action.payload as Map<string, Array<Chat>>,
      };
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

  const { invites, friends, room, chat } = useConnection();

  console.log("connection friend", { invites, friends, room, chat });

  useEffect(() => {
    setInvitations(invites);
    setFriends(friends);

    if (room) {
      const initialChatMap: Map<string, Array<Chat>> = state.userChats;
      const initialChat = initialChatMap.set(room, []);
      setUserChats(initialChat);
    }

    if (chat) {
      let key: string;
      const { to, from, message } = chat;

      if (state.userChats.has(`${to}-${from}`)) {
        key = `${to}-${from}`;
      } else {
        key = `${from}-${to}`;
      }

      const prevChats = state.userChats.get(key);
      prevChats?.push({ to, from, message });
      const allChats = new Map();
      allChats.set(key, prevChats);
      console.log({ allChats, key });
      setUserChats(allChats);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [invites, friends, room, chat]);

  const setFriends = (friends: Array<string>) => {
    dispatch({ type: ActionTypes.FRIENDS, payload: friends });
  };

  const setInvitations = (invitations: Array<string>) => {
    dispatch({ type: ActionTypes.INVITATIONS, payload: invitations });
  };

  const setOnlineUsers = (onlineUsers: Array<string>) => {
    dispatch({ type: ActionTypes.ONLINEUSERS, payload: onlineUsers });
  };

  const setSelectedUser = (selectedUser: string) => {
    dispatch({ type: ActionTypes.SELECTEDUSER, payload: selectedUser });
  };

  const setUserChats = (userChats: Map<string, Array<Chat>>) => {
    dispatch({ type: ActionTypes.USERCHATS, payload: userChats });
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
