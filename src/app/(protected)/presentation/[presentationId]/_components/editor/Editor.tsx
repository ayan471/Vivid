"use client";

import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import type { LayoutSlides, Slide } from "@/lib/types";
import { cn } from "@/lib/utils";
import { useSlideStore } from "@/store/useSlideStore";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { useDrag, useDrop } from "react-dnd";
import { v4 as uuidv4 } from "uuid";
import { MasterRecursiveComponent } from "./MasterRecursiveComponent";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { EllipsisVertical, Trash } from "lucide-react";
import { updateSlides } from "@/actions/project";

interface DropZoneProps {
  index: number;
  onDrop: (
    item: {
      type: string;
      layoutType: string;
      component: LayoutSlides;
      index?: number;
    },
    dropIndex: number
  ) => void;
  isEditable: boolean;
}

export const DropZone: React.FC<DropZoneProps> = ({
  index,
  onDrop,
  isEditable,
}) => {
  const [{ isOver, canDrop }, dropRef] = useDrop({
    accept: ["SLIDE", "layout"],
    drop: (item: {
      type: string;
      layoutType: string;
      component: LayoutSlides;
      index?: number;
    }) => {
      onDrop(item, index);
    },
    canDrop: () => isEditable,
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
      canDrop: !!monitor.canDrop(),
    }),
  });

  if (!isEditable) return null;
  return (
    <div
      ref={dropRef as unknown as React.RefObject<HTMLDivElement>}
      className={cn(
        "h-4 my-4 rounded-md transition-all duration-300 border-2 border-dashed",
        isOver && canDrop
          ? "border-green-500 bg-green-50"
          : "border-gray-200 hover:border-gray-300",
        canDrop ? "border-blue-200 hover:border-blue-300" : ""
      )}
    >
      {isOver && canDrop && (
        <div className="h-full flex items-center justify-center text-green-600 text-sm font-medium">
          Drop here
        </div>
      )}
    </div>
  );
};

interface DraggableSlideProps {
  slide: Slide;
  index: number;
  moveSlide: (dragIndex: number, hoverIndex: number) => void;
  handleDelete: (id: string) => void;
  isEditable: boolean;
}

export const DraggableSlide: React.FC<DraggableSlideProps> = ({
  slide,
  index,
  moveSlide,
  handleDelete,
  isEditable,
}) => {
  const ref = useRef(null);
  const { currentSlide, setCurrentSlide, currentTheme, updateContentItem } =
    useSlideStore();

  const [{ isDragging }, drag] = useDrag({
    type: "SLIDE",
    item: {
      index,
      type: "SLIDE",
    },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
    canDrag: isEditable,
  });

  const [_, drop] = useDrop({
    accept: ["SLIDE", "LAYOUT"],
    hover(item: { index: number; type: string }) {
      if (!ref.current || !isEditable) {
        return;
      }
      const dragIndex = item.index;
      const hoverIndex = index;

      if (item.type === "SLIDE") {
        if (dragIndex === hoverIndex) {
          return;
        }
        moveSlide(dragIndex, hoverIndex);
        item.index = hoverIndex;
      }
    },
  });

  drag(drop(ref));

  const handleContentChange = (
    contentId: string,
    newContent: string | string[] | string[][]
  ) => {
    if (isEditable) {
      updateContentItem(slide.id, contentId, newContent);
    }
  };

  return (
    <div
      ref={ref}
      className={cn(
        "w-full rounded-xl shadow-lg relative p-6 min-h-[400px] max-h-[800px]",
        "transition-all duration-300 ease-in-out",
        "flex flex-col bg-white dark:bg-gray-800",
        index === currentSlide
          ? "ring-2 ring-blue-500 ring-offset-4 ring-offset-background"
          : "hover:shadow-xl",
        slide.className,
        isDragging ? "opacity-50 cursor-grabbing" : "opacity-100 cursor-grab"
      )}
      style={{
        backgroundImage: currentTheme.gradientBackground,
      }}
      onClick={() => setCurrentSlide(index)}
    >
      <div className="h-full w-full flex-grow overflow-hidden">
        <MasterRecursiveComponent
          content={slide.content}
          isPreview={false}
          slideId={slide.id}
          isEditable={isEditable}
          onContentChange={handleContentChange}
        />
      </div>
      {isEditable && (
        <Popover>
          <PopoverTrigger asChild>
            <Button
              size="sm"
              variant="outline"
              className="absolute top-4 left-4 bg-white/80 backdrop-blur-sm hover:bg-white/90 dark:bg-gray-800/80 dark:hover:bg-gray-800/90"
            >
              <EllipsisVertical className="w-4 h-4" />
              <span className="sr-only">Slide options</span>
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-fit p-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleDelete(slide.id)}
              className="text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/50"
            >
              <Trash className="w-4 h-4 mr-2" />
              Delete slide
            </Button>
          </PopoverContent>
        </Popover>
      )}
    </div>
  );
};

type Props = {
  isEditable: boolean;
};

const Editor = ({ isEditable }: Props) => {
  const {
    getOrderedSlides,
    currentSlide,
    reorderSlides,
    removeSlide,
    addSlideAtIndex,
    slides,
    project,
  } = useSlideStore();

  const orderedSlides = getOrderedSlides();
  const slideRefs = useRef<(HTMLDivElement | null)[]>([]);
  const autosaveTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [loading, setLoading] = useState(true);

  const moveSlide = (dragIndex: number, hoverIndex: number) => {
    if (isEditable) {
      reorderSlides(dragIndex, hoverIndex);
    }
  };

  const handleDrop = (
    item: {
      type: string;
      layoutType: string;
      component: LayoutSlides;
      index?: number;
    },
    dropIndex: number
  ) => {
    if (!isEditable) return;
    if (item.type === "layout") {
      addSlideAtIndex(
        {
          ...item.component,
          id: uuidv4(),
          slideOrder: dropIndex,
        },
        dropIndex
      );
    } else if (item.type === "SLIDE" && item.index !== undefined) {
      moveSlide(item.index, dropIndex);
    }
  };

  const handleDelete = (id: string) => {
    if (isEditable) {
      removeSlide(id);
    }
  };

  const saveSlides = useCallback(() => {
    if (isEditable && project) {
      (async () => {
        await updateSlides(project.id, JSON.parse(JSON.stringify(slides)));
      })();
    }
  }, [isEditable, project, slides]);

  useEffect(() => {
    if (slideRefs.current[currentSlide]) {
      slideRefs.current[currentSlide]?.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }
  }, [currentSlide]);

  useEffect(() => {
    if (typeof window !== "undefined") setLoading(false);
  }, []);

  useEffect(() => {
    if (autosaveTimeoutRef.current) {
      clearTimeout(autosaveTimeoutRef.current);
    }

    if (isEditable) {
      autosaveTimeoutRef.current = setTimeout(saveSlides, 2000);
    }

    return () => {
      if (autosaveTimeoutRef.current) {
        clearTimeout(autosaveTimeoutRef.current);
      }
    };
  }, [isEditable, saveSlides]);

  return (
    <div className="flex-1 flex flex-col h-full max-w-4xl mx-auto px-4 mb-20">
      {loading ? (
        <div className="w-full px-4 flex flex-col space-y-8 mt-8">
          <Skeleton className="h-[400px] w-full rounded-xl" />
          <Skeleton className="h-[400px] w-full rounded-xl" />
          <Skeleton className="h-[400px] w-full rounded-xl" />
        </div>
      ) : (
        <ScrollArea className="flex-1 mt-8">
          <div className="px-4 pb-4 space-y-6">
            {isEditable && (
              <DropZone index={0} onDrop={handleDrop} isEditable={isEditable} />
            )}
            {orderedSlides.map((slide, index) => (
              <React.Fragment key={slide.id || index}>
                <DraggableSlide
                  slide={slide}
                  index={index}
                  moveSlide={moveSlide}
                  handleDelete={handleDelete}
                  isEditable={isEditable}
                />
                {isEditable && (
                  <DropZone
                    index={index + 1}
                    onDrop={handleDrop}
                    isEditable={isEditable}
                  />
                )}
              </React.Fragment>
            ))}
          </div>
        </ScrollArea>
      )}
    </div>
  );
};

export default Editor;
