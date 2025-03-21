import React, { useEffect } from "react";
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
    active,
  } = useSortable({ 
    id,
    transition: {
      duration: 250,
      easing: 'cubic-bezier(0.25, 1, 0.5, 1)',
    },
  });

  // Create a memoized style object with proper transform handling
  const style = {
    transform: CSS.Transform.toString(transform),
    transition: transition || 'transform 250ms cubic-bezier(0.25, 1, 0.5, 1)',
    opacity: isDragging ? 0.5 : 1,
    position: "relative",
    zIndex: isDragging ? 999 : 0,
  };

  // Add a class when dragging to help with styling
  useEffect(() => {
    const element = document.getElementById(id);
    if (element) {
      if (isDragging) {
        element.classList.add('is-dragging');
      } else {
        element.classList.remove('is-dragging');
      }
    }
  }, [isDragging, id]);

  return (
    <div 
      id={id}
      ref={setNodeRef} 
      style={style} 
      className="sortable-video-item"
      data-dragging={isDragging ? "true" : "false"}
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
