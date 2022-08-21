import { FunctionComponent } from "react";
import axios from "axios";

import { Avatar } from "../../ui";

interface AvatarListProps {
  invitations?: boolean;
  invitationList: Array<string>;
  username: string;
}

enum InvitationActions {
  ACCEPT = "accept",
  REJECT = "reject",
}

const AvatarList: FunctionComponent<AvatarListProps> = ({
  invitations,
  invitationList,
  username,
}) => {
  const getApiResponse = async (type: InvitationActions, friend: string) => {
    return await axios.post(
      `http://localhost:4000/api/add-friend?action=${type}`,
      {
        username,
        friend,
      }
    );
  };

  const actionHandler = async (type: InvitationActions, friend: string) => {
    await getApiResponse(type, friend);
  };

  return (
    <div className="flex flex-col flex-1 gap-3 px-5 overflow-y-auto basis-36 scrollbar">
      {invitationList.length ? (
        invitationList.map((data) => (
          <div key={Math.random()} className="flex items-center justify-start">
            <Avatar />
            <span className="px-4 cursor-pointer hover:text-primary-focus">
              {data}
            </span>
            {invitations ? (
              <div className="ml-auto">
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
        <div className="text-center">No Users Available</div>
      )}
    </div>
  );
};

export default AvatarList;
