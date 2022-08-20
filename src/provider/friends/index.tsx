import {
  createContext,
  FunctionComponent,
  PropsWithChildren,
  useContext,
  useReducer,
} from "react";

type FriendsContextType = {
  friendsData: FriendsState;
  setFriends: (_friends: Array<string>) => void;
  setInvitations: (_invitations: Array<string>) => void;
  setOnlineUsers: (_onlineUsers: Array<string>) => void;
};

interface FriendsState {
  friends: Array<string>;
  invitations: Array<string>;
  onlineUsers: Array<String>;
}

enum ActionTypes {
  FRIENDS = "FRIENDS",
  INVITATIONS = "INVITATIONS",
  ONLINEUSERS = "ONLINEUSERS",
}

interface FriendsAction {
  type: ActionTypes;
  payload: Array<string>;
}

type FriendsReducer<T, U> = (_state: T, _action: U) => T;

const initialState: FriendsState = {
  friends: [],
  invitations: [],
  onlineUsers: [],
};

const reducer: FriendsReducer<FriendsState, FriendsAction> = (
  state,
  action
) => {
  switch (action.type) {
    case ActionTypes.FRIENDS:
      return { ...state, friends: action.payload };
    case ActionTypes.INVITATIONS:
      return { ...state, invitations: action.payload };
    case ActionTypes.ONLINEUSERS:
      return { ...state, onlineUsers: action.payload };
    default:
      return state;
  }
};

const FriendsContext = createContext<FriendsContextType>({
  friendsData: initialState,
  setFriends: () => {},
  setInvitations: () => {},
  setOnlineUsers: () => {},
});

const FriendsProvider: FunctionComponent<PropsWithChildren> = ({
  children,
}) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  const setFriends = (friends: Array<string>) => {
    dispatch({ type: ActionTypes.FRIENDS, payload: friends });
  };

  const setInvitations = (invitations: Array<string>) => {
    dispatch({ type: ActionTypes.INVITATIONS, payload: invitations });
  };

  const setOnlineUsers = (onlineUsers: Array<string>) => {
    dispatch({ type: ActionTypes.ONLINEUSERS, payload: onlineUsers });
  };

  return (
    <FriendsContext.Provider
      value={{
        friendsData: state,
        setFriends,
        setInvitations,
        setOnlineUsers,
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
