import { FunctionComponent } from "react";

interface BadgeProps {
  gap: number;
  name: string;
}

const Badge: FunctionComponent<BadgeProps> = ({ gap, name }) => {
  return <div className={`gap-${gap} badge badge-success p-2`}>{name}</div>;
};

export default Badge;
