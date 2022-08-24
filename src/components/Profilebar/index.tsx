import { Avatar } from "../../ui";
import { useConnection } from "../../provider";

const Profilebar = () => {
  const { username } = useConnection();

  return (
    <div className="flex flex-col items-center justify-start w-full my-5 bg-base-300">
      <Avatar initial="S" />
      {username
        ? username.split("").map((user, index) => (
            <div key={index} className="text-primary-focus">
              {user}
            </div>
          ))
        : null}
    </div>
  );
};

export default Profilebar;
