import {
  createContext,
  FunctionComponent,
  PropsWithChildren,
  useReducer,
} from "react";

type VideoRoomDetails = any;

interface VideoRoomState {
  isUserInRoom: boolean;
  isUserCreator: boolean;
  videoRoomDetails: VideoRoomDetails;
  activeRooms: any;
  localStream: any;
  remoteStreams: any;
  audioOnly: boolean;
  screenSharingStream: any;
}

const initialState: VideoRoomState = {
  isUserCreator: false,
  isUserInRoom: false,
  videoRoomDetails: null,
  localStream: null,
  remoteStreams: [],
  audioOnly: false,
  screenSharingStream: null,
  activeRooms: [],
};

type VideoRoomContexttype = {
  videoData: VideoRoomState;
};

type VideoRoomAction = {
  type: string;
  payload: string;
};

type VideoRoomReducer<T, U> = (_state: T, actions: U) => T;

const reducer: VideoRoomReducer<VideoRoomState, VideoRoomAction> = (
  state,
  action
) => {
  return state;
};

const VideoRoomContext = createContext<VideoRoomContexttype>({
  videoData: initialState,
});

const VideoRoomProvider: FunctionComponent<PropsWithChildren> = ({
  children,
}) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  return (
    <VideoRoomContext.Provider value={{ videoData: state }}>
      {children}
    </VideoRoomContext.Provider>
  );
};

export default VideoRoomProvider;
