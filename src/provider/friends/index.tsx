import {
  createContext,
  FunctionComponent,
  PropsWithChildren,
  useContext,
  useEffect,
  useReducer,
} from "react";

import {
  Chat,
  Room,
  GroupInvitation,
  GroupData,
  GroupRoom,
  GroupChat,
  ReceivedChat,
  ReceivedGroupChat,
} from "../../hooks/types";
import { useConnection } from "../connection";

type FriendsContextType = {
  friendsData: FriendsState;
  setFriends: (_friends: Array<string>) => void;
  setInvitations: (_invitations: Array<string>) => void;
  setOnlineUsers: (_onlineUsers: Array<string>) => void;
  setSelectedUser: (_selectedUser: SelectedUser) => void;
  setUserChats: (_userChats: Map<string, Array<Chat>>) => void;
  setSelectedGroup: (data: SelectedGroup) => void;
};

type SelectedUser = {
  user: string;
  token: string;
} | null;

type SelectedGroup = string | null;

export type UserChat = Omit<Chat, "token">;

interface FriendsState {
  friends: Array<string>;
  invitations: Array<string>;
  onlineUsers: Array<string>;
  selectedUser: SelectedUser | null;
  userChats: Map<string, Array<UserChat>>;
  rooms: Array<Room>;
  groupInvitations: Map<string, GroupData[]>;
  groups: Array<string>;
  groupRooms: Array<GroupRoom>;
  groupChats: Map<string, Array<GroupChat>>;
  selectedGroup: SelectedGroup;
}

enum ActionTypes {
  FRIENDS = "FRIENDS",
  INVITATIONS = "INVITATIONS",
  ONLINEUSERS = "ONLINEUSERS",
  SELECTEDUSER = "SELECTEDUSER",
  USERCHATS = "USERCHATS",
  ROOM = "ROOM",
  GROUPINVITATION = "GROUPINVITATION",
  GROUP = "GROUP",
  GROUPROOM = "GROUPROOM",
  GROUPCHAT = "GROUPCHAT",
  SELECTEDGROUP = "SELECTEDGROUP",
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

interface GroupChatType extends Action {
  payload: Map<string, Array<GroupChat>>;
}

interface RoomType extends Action {
  payload: Room;
}

interface GroupInvitationType extends Action {
  payload: Map<string, GroupData[]>;
}

interface GroupsType extends Action {
  payload: Array<string>;
}

interface GroupRoomType extends Action {
  payload: GroupRoom;
}

interface SelectedGroupType extends Action {
  payload: SelectedGroup;
}

type FriendsAction =
  | FriendsType
  | SelectedUserType
  | UserChatsType
  | RoomType
  | GroupInvitationType
  | GroupsType
  | GroupRoomType
  | GroupChatType
  | SelectedGroupType;

type FriendsReducer<T, U> = (_state: T, _action: U) => T;

const initialState: FriendsState = {
  friends: [],
  invitations: [],
  groupInvitations: new Map(),
  onlineUsers: [],
  selectedUser: null,
  userChats: new Map(),
  rooms: [],
  groups: [],
  groupRooms: [],
  groupChats: new Map(),
  selectedGroup: null,
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
    case ActionTypes.GROUPINVITATION:
      return {
        ...state,
        groupInvitations: action.payload as Map<string, GroupData[]>,
      };
    case ActionTypes.GROUP:
      return { ...state, groups: action.payload as Array<string> };
    case ActionTypes.GROUPROOM:
      const allGroupRooms = [...state.groupRooms];
      allGroupRooms.push(action.payload as GroupRoom);
      return { ...state, groupRooms: allGroupRooms };
    case ActionTypes.GROUPCHAT:
      return {
        ...state,
        groupChats: action.payload as Map<string, Array<GroupChat>>,
      };
    case ActionTypes.SELECTEDGROUP:
      return { ...state, selectedGroup: action.payload as SelectedGroup };
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
  setSelectedGroup: () => {},
});

const FriendsProvider: FunctionComponent<PropsWithChildren> = ({
  children,
}) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  const {
    invites,
    friends,
    room,
    chat,
    username,
    groupData,
    groups,
    groupRoom,
    groupChat,
  } = useConnection();

  useEffect(() => {
    setInvitations(invites);
    setFriends(friends);

    if (room) {
      setRoomData(room);
    }

    if (chat) {
      setChatData(chat);
    }

    if (groupData) {
      setGroupInvitationData(groupData);
    }

    if (groups) {
      setGroups(groups);
    }

    if (groupRoom) {
      setGroupRoomData(groupRoom);
    }

    if (groupChat) {
      setGroupChatData(groupChat);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [invites, friends, room, chat, groupData, groups, groupRoom, groupChat]);

  const setGroupChatData = (groupChat: ReceivedGroupChat) => {
    const allGroupChats = state.groupChats;
    allGroupChats.set(groupChat.token, groupChat.data);
    const allGroupChatsMap = new Map(allGroupChats);

    console.log("After Data Receive", { allGroupChats, allGroupChatsMap });
    setGroupChats(allGroupChatsMap);
  };

  const setGroupRoomData = (data: GroupRoom) => {
    if (username === data.initiator && !state.groupChats.has(data.token)) {
      createEmptyGroupChat(data.token);
      setGroupRooms(data);
      setSelectedGroup(data.token);
      return;
    }

    const isUserInGroup = data.members.find((member) => member === username);
    if (isUserInGroup && !state.groupChats.has(data.token)) {
      createEmptyGroupChat(data.token);
      setGroupRooms(data);
    }
  };

  const setGroupInvitationData = ({ data, user }: GroupInvitation) => {
    const allGroupInvitations = new Map().set(user, data);
    setGroupInvitations(allGroupInvitations);
  };

  const setChatData = ({ token, data }: ReceivedChat) => {
    const allChats = state.userChats;
    allChats.set(token, data);
    const allChatsMap = new Map(allChats);
    setUserChats(allChatsMap);
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

  const createEmptyGroupChat = (room: string) => {
    const initialGroupChatMap = state.groupChats;
    const initialgroupChat = initialGroupChatMap.set(room, []);
    setGroupChats(initialgroupChat);
  };

  const setFriends = (friends: Array<string>) => {
    dispatch({ type: ActionTypes.FRIENDS, payload: friends });
  };

  const setInvitations = (invitations: Array<string>) => {
    dispatch({ type: ActionTypes.INVITATIONS, payload: invitations });
  };

  const setOnlineUsers = (onlineUsers: Array<string>) => {
    console.log("set data", { onlineUsers });
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

  const setGroupInvitations = (invites: Map<string, GroupData[]>) => {
    dispatch({ type: ActionTypes.GROUPINVITATION, payload: invites });
  };

  const setGroups = (data: Array<string>) => {
    dispatch({ type: ActionTypes.GROUP, payload: data });
  };

  const setGroupRooms = (data: GroupRoom) => {
    dispatch({ type: ActionTypes.GROUPROOM, payload: data });
  };

  const setGroupChats = (data: Map<string, Array<GroupChat>>) => {
    dispatch({ type: ActionTypes.GROUPCHAT, payload: data });
  };

  const setSelectedGroup = (data: SelectedGroup) => {
    dispatch({ type: ActionTypes.SELECTEDGROUP, payload: data });
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
        setSelectedGroup,
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
