import React from "react";
import { FaArrowUp, FaArrowDown } from "react-icons/fa";

// Component for reorder controls to move videos up or down in a list
const ReorderControls = ({ onMoveUp, onMoveDown, disabledUp, disabledDown }) => {
    return (
        <div className="reorder-actions">
            {/* Button to move the video up */}
            <button
                className="move-video-up"
                onClick={onMoveUp}
                disabled={disabledUp}
                title="Move up"
            >
                <FaArrowUp />
            </button>
            {/* Button to move the video down */}
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
