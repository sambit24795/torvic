import { FunctionComponent } from "react";

interface AvatarProps {
  initial: string;
}

const Avatar: FunctionComponent<AvatarProps> = ({ initial }) => {
  return (
    <div className="avatar online placeholder">
      <div className="w-16 rounded-full bg-neutral-focus text-neutral-content">
        <span className="text-xl uppercase">{initial}</span>
      </div>
    </div>
  );
};

export default Avatar;
