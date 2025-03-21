import React from "react";
import "../styles/components/SortableVideoItem.css";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import EditableVideoItem from "./EditableVideoItem";
import { FaGripVertical } from "react-icons/fa";

const SortableVideoItem = ({
  id,
  video,
  index,
  playlistId,
  onRemove,
  onEdit,
  onMoveUp,
  onMoveDown,
  isFirst,
  isLast,
  autoOpenEditModal,
  onModalClosed
}) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    position: "relative",
    zIndex: isDragging ? 1 : 0,
  };

  return (
    <div 
      ref={setNodeRef} 
      style={style} 
      className="sortable-video-item"
      data-dragging={isDragging}
    >
      <div className="drag-handle" {...attributes} {...listeners}>
        <FaGripVertical />
      </div>
      <EditableVideoItem
        video={video}
        index={index}
        playlistId={playlistId}
        onRemove={onRemove}
        onEdit={onEdit}
        onMoveUp={onMoveUp}
        onMoveDown={onMoveDown}
        isFirst={isFirst}
        isLast={isLast}
        autoOpenEditModal={autoOpenEditModal}
        onModalClosed={onModalClosed}
      />
    </div>
  );
};

export default SortableVideoItem;
