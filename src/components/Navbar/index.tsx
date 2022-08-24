import { FunctionComponent } from "react";

interface NavbarProps {
  username: string;
}

const Navbar: FunctionComponent<NavbarProps> = ({ username }) => {
  return (
    <div className="navbar bg-base-100">
      <div className="flex-1">
        <div className="px-5 text-xl font-bold normal-case text-primary">{username}</div>
      </div>
      <div className="flex-none">
        <ul className="p-0 menu menu-horizontal">
          <li>
            <div>audio</div>
          </li>
          <li>
            <div>video</div>
          </li>
          {/* <li>
            <a>Item 3</a>
          </li> */}
        </ul>
      </div>
    </div>
  );
};

export default Navbar;
