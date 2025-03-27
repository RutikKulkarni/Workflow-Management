import { BsPinAngle, BsPinAngleFill } from "react-icons/bs";

interface PinIconProps {
  isPinned: boolean;
}

export const PinIcon = ({ isPinned }: PinIconProps) => {
  if (isPinned) {
    return (
      <span className="inline-block relative">
        <BsPinAngleFill
          className="text-yellow-400"
          style={{ stroke: "black", strokeWidth: "1px" }}
        />
      </span>
    );
  }
  return <BsPinAngle />;
};
