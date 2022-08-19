import { FunctionComponent } from "react";
import { Avatar } from "../../ui";

interface AvatarListProps {
  invitations?: boolean;
}

const AvatarList: FunctionComponent<AvatarListProps> = ({ invitations }) => {
  return (
    <div className="flex flex-col flex-1 gap-3 px-5 overflow-y-auto basis-36 scrollbar">
      {Array(20)
        .fill(<Avatar />)
        .map((c) => (
          <div className="flex items-center justify-start">
            <Avatar key={Math.random()} />
            <span className="px-4 cursor-pointer hover:text-primary-focus">
              Sambit Nayak
            </span>
            {invitations ? (
              <div className="ml-auto">
                <button className=" btn btn-error btn-outline">reject</button>
                <button className=" btn btn-success btn-outline">accept</button>
              </div>
            ) : null}
          </div>
        ))}
    </div>
  );
};

export default AvatarList;
