import { FunctionComponent } from "react";

interface MenuItem {
  checked: boolean;
  item: string;
}

interface MenuProps {
  items: Array<MenuItem>;
  selectHandler: (_index: number) => void;
}

const Menu: FunctionComponent<MenuProps> = ({ items, selectHandler }) => {
  return (
    <ul className="w-56 h-56 p-2 overflow-y-auto menu menu-compact lg:menu-normal bg-base-100 rounded-box scrollbar">
      {items.map(({ item, checked }, index) => (
        <li
          key={index}
          className={checked ? `bordered` : ""}
          onClick={selectHandler.bind(null, index)}
        >
          <div>{item}</div>
        </li>
      ))}
    </ul>
  );
};

export default Menu;
