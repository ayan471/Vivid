import { MasterRecursiveComponent } from "@/app/(protected)/presentation/[presentationId]/_components/editor/MasterRecursiveComponent";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { ContentItem } from "@/lib/types";
import { cn } from "@/lib/utils";
import React, { useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";

type Props = {
  content: ContentItem[];
  className?: string;
  isPreview?: boolean;
  slideId: string;
  onContentChange: (
    contentId: string,
    newContent: string | string[] | string[][]
  ) => void;
  isEdiatable?: boolean;
};

const ColumnComponents = ({
  content,
  className,
  isPreview = false,
  slideId,
  onContentChange,
  isEdiatable = true,
}: Props) => {
  const [columns, setColumns] = useState<ContentItem[]>([]);

  const createDefaultColumns = (count: number) => {
    return Array(count)
      .fill(null)
      .map(() => ({
        id: uuidv4(),
        type: "paragraph" as const,
        name: "Paragraph",
        content: "",
        placeholder: "Start typing...",
      }));
  };

  useEffect(() => {
    if (content.length === 0) {
      setColumns(createDefaultColumns(2));
    } else {
      setColumns(content);
    }
  }, [content]);

  return (
    <div className="relative w-full h-full">
      <ResizablePanelGroup
        direction="horizontal"
        className={cn(
          "h-full w-full flex",
          !isEdiatable && "!border-0",
          className
        )}
      >
        {columns.map((item, index) => (
          <React.Fragment key={item.id}>
            <ResizablePanel minSize={20} defaultSize={100 / columns.length}>
              <div className={cn("h-full w-full", item.className)}>
                <MasterRecursiveComponent
                  content={item}
                  isPreview={isPreview}
                  onContentChange={onContentChange}
                  slideId={slideId}
                  isEditable={isEdiatable}
                />
              </div>
            </ResizablePanel>
            {index < columns.length - 1 && isEdiatable && (
              <ResizableHandle withHandle={!isPreview} />
            )}
          </React.Fragment>
        ))}
      </ResizablePanelGroup>
    </div>
  );
};

export default ColumnComponents;
