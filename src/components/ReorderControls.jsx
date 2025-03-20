import React from "react";
import { FaArrowUp, FaArrowDown } from "react-icons/fa";

const ReorderControls = ({ onMoveUp, onMoveDown, disabledUp, disabledDown }) => {
  return (
    <div className="reorder-actions">
      <button
        className="move-video-up"
        onClick={onMoveUp}
        disabled={disabledUp}
        title="Move up"
      >
        <FaArrowUp />
      </button>
      <button
        className="move-video-down"
        onClick={onMoveDown}
        disabled={disabledDown}
        title="Move down"
      >
        <FaArrowDown />
      </button>
    </div>
  );
};

export default ReorderControls;
