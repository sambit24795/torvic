import { FunctionComponent } from "react";
import axios from "axios";

import { Avatar } from "../../ui";
import { classNames } from "../utils/index";

interface AvatarListProps {
  invitations?: boolean;
  invitationList: Array<string>;
  username: string;
  onClick: (_data: string, _isGroup: boolean) => void;
  selectedUser: string;
  isGroup: boolean;
}

enum InvitationActions {
  ACCEPT = "accept",
  REJECT = "reject",
}

const AvatarList: FunctionComponent<AvatarListProps> = ({
  invitations,
  invitationList,
  username,
  onClick,
  selectedUser,
  isGroup,
}) => {
  const getFriendsApiResponse = async (
    type: InvitationActions,
    friend: string
  ) => {
    return await axios.post(
      `http://localhost:4000/api/add-friend?action=${type}`,
      {
        username,
        friend,
      }
    );
  };

  const getGroupApiResponse = async (
    username: string,
    groupname: string,
    type: InvitationActions
  ) => {
    return await axios.post(
      `http://localhost:4000/api/add-group?action=${type}`,
      {
        username,
        groupname,
      }
    );
  };

  const actionHandler = async (type: InvitationActions, name: string) => {
    if (isGroup) {
      getGroupApiResponse(username, name, type);
      return;
    }

    await getFriendsApiResponse(type, name);
  };

  return (
    <div className="flex flex-col flex-1 gap-3 px-5 overflow-y-auto basis-36 scrollbar">
      {invitationList.length ? (
        invitationList.map((data) => (
          <div
            key={Math.random()}
            className={classNames(
              "flex items-center justify-start cursor-pointer hover:text-primary-focus",
              data === selectedUser ? "text-primary-focus" : ""
            )}
            onClick={onClick.bind(null, data, isGroup)}
          >
            <Avatar initial={data[0]} />
            <span className="px-4 cursor-pointer ">{data}</span>
            {invitations ? (
              <div className="flex items-center justify-center gap-2 ml-auto">
                <button
                  className=" btn btn-error btn-outline"
                  onClick={actionHandler.bind(
                    null,
                    InvitationActions.REJECT,
                    data
                  )}
                >
                  reject
                </button>
                <button
                  className=" btn btn-success btn-outline"
                  onClick={actionHandler.bind(
                    null,
                    InvitationActions.ACCEPT,
                    data
                  )}
                >
                  accept
                </button>
              </div>
            ) : null}
          </div>
        ))
      ) : (
        <div className="text-center">
          {!isGroup ? "no users available" : "no groups available"}
        </div>
      )}
    </div>
  );
};

export default AvatarList;
