import React from "react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  rectSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Box, IconButton, Tooltip } from "@mui/material";
import DragIndicatorIcon from "@mui/icons-material/DragIndicator";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";

/**
 * SortableContainer
 * Manages DndContext and SortableContext for a list of items with unique `id`.
 */
export function SortableContainer({
  items = [],
  onReorder,
  strategy = verticalListSortingStrategy,
  children,
}) {
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5, // 5px threshold prevents accidental drag when clicking inputs/buttons
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = items.findIndex((it) => it.id === active.id);
    const newIndex = items.findIndex((it) => it.id === over.id);

    if (oldIndex !== -1 && newIndex !== -1) {
      const reordered = arrayMove(items, oldIndex, newIndex);
      onReorder(reordered);
    }
  };

  const itemIds = items.map((it) => it.id);

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <SortableContext items={itemIds} strategy={strategy}>
        {children}
      </SortableContext>
    </DndContext>
  );
}

/**
 * SortableItem
 * Wrapper for a draggable child element. Passes drag handle listeners and attributes to render prop.
 */
export function SortableItem({ id, children, sx = {} }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style = {
    transform: CSS.Translate.toString(transform),
    transition,
    opacity: isDragging ? 0.35 : 1,
    zIndex: isDragging ? 999 : "auto",
  };

  return (
    <Box
      ref={setNodeRef}
      style={style}
      sx={{
        position: "relative",
        transition: "box-shadow 0.2s ease, border-color 0.2s ease",
        ...(isDragging && {
          boxShadow: "0 14px 28px rgba(0,0,0,0.15), 0 10px 10px rgba(0,0,0,0.12)",
          borderColor: "#37AB79 !important",
          outline: "2px dashed #37AB79",
          borderRadius: 2,
        }),
        ...sx,
      }}
    >
      {typeof children === "function"
        ? children({ attributes, listeners, isDragging })
        : children}
    </Box>
  );
}

/**
 * DragHandle
 * Six-dot drag handle icon button. Only this element initiates dragging.
 */
export function DragHandle({ attributes, listeners, isDragging, title = "Drag to reorder", color = "#64748b" }) {
  return (
    <Tooltip title={title} placement="top">
      <IconButton
        {...attributes}
        {...listeners}
        size="small"
        sx={{
          cursor: isDragging ? "grabbing" : "grab",
          color: color,
          p: 0.5,
          borderRadius: 1,
          touchAction: "none",
          transition: "all 0.15s ease",
          "&:hover": {
            color: "#1e293b",
            backgroundColor: "#f1f5f9",
          },
        }}
        aria-label={title}
      >
        <DragIndicatorIcon fontSize="small" />
      </IconButton>
    </Tooltip>
  );
}

/**
 * AccessibleReorderButtons
 * Move Up / Move Down buttons for accessible / one-click ordering.
 */
export function AccessibleReorderButtons({
  onMoveUp,
  onMoveDown,
  isFirst = false,
  isLast = false,
  color = "#64748b",
}) {
  return (
    <Box sx={{ display: "inline-flex", alignItems: "center", gap: 0.25 }}>
      <Tooltip title="Move up" placement="top">
        <span>
          <IconButton
            size="small"
            disabled={isFirst}
            onClick={onMoveUp}
            sx={{
              p: 0.25,
              color: isFirst ? "#cbd5e1" : color,
              "&:hover": { backgroundColor: "#f1f5f9", color: "#1e293b" },
            }}
            aria-label="Move up"
          >
            <KeyboardArrowUpIcon fontSize="small" />
          </IconButton>
        </span>
      </Tooltip>
      <Tooltip title="Move down" placement="top">
        <span>
          <IconButton
            size="small"
            disabled={isLast}
            onClick={onMoveDown}
            sx={{
              p: 0.25,
              color: isLast ? "#cbd5e1" : color,
              "&:hover": { backgroundColor: "#f1f5f9", color: "#1e293b" },
            }}
            aria-label="Move down"
          >
            <KeyboardArrowDownIcon fontSize="small" />
          </IconButton>
        </span>
      </Tooltip>
    </Box>
  );
}

export { arrayMove, verticalListSortingStrategy, rectSortingStrategy };
