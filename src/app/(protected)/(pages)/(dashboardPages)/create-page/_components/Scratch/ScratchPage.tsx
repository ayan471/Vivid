"use client";

import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  containerVariants,
  itemVariants,
  toastCustomStyles,
} from "@/lib/constants";
import { Button } from "@/components/ui/button";
import { ChevronLeft, RotateCcw } from "lucide-react";
import useScratchStore from "@/store/useStartScratchStore";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import CardList from "../Common/CardList";
import { OutlineCard } from "@/lib/types";
import { v4 as uuidv4 } from "uuid";
import { toast } from "sonner";
import { createProject } from "@/actions/project";
import { useSlideStore } from "@/store/useSlideStore";

type Props = {
  onBack: () => void;
};

const ScratchPage = ({ onBack }: Props) => {
  const router = useRouter();
  const { setProject } = useSlideStore();
  const [editText, setEditText] = useState("");
  const [editingCard, setEditingCard] = useState<string | null>(null);
  const [selectedCard, setSelectedCard] = useState<string | null>(null);
  const { resetOutlines, outlines, addOutline, addMultipleOutlines } =
    useScratchStore();
  const handleBack = () => {
    resetOutlines();
    onBack();
  };

  const resetCards = () => {
    setEditText("");
    resetOutlines();
  };

  const handleAddCard = () => {
    const newCard: OutlineCard = {
      id: uuidv4(),
      title: editText || "New Section",
      order: outlines.length + 1,
    };
    setEditText("");
    addOutline(newCard);
  };

  const handleGenerate = async () => {
    if (outlines.length === 0) {
      toast.error("Error", {
        description: "Please add at least one card to generate",
        style: toastCustomStyles.error,
      });
      return;
    }
    const res = await createProject(outlines?.[0]?.title, outlines);
    if (res.status !== 200) {
      toast.error("Error", {
        description: res.error || "Failed to create project",
        style: toastCustomStyles.error,
      });
      return;
    }
    if (res.data) {
      setProject(res.data);
      resetOutlines();
      toast.success("Success", {
        description: "Project created successfully",
      });
      router.push(`/presentation/${res.data.id}/select-theme`);
    } else {
      toast.error("Error", {
        description: "Failed to create project.",
      });
    }
  };
  return (
    <motion.div
      className="space-y-6 w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <Button className="mb-4" variant="outline" onClick={handleBack}>
        <ChevronLeft className="mr-2 h-4 w-4" />
        Back
      </Button>
      <h1 className="text-2xl sm:text-3xl font-bold text-primary text-left">
        Prompt
      </h1>
      <motion.div
        className="bg-primary/10 p-4 rounded-xl"
        variants={itemVariants}
      >
        <div className="flex flex-col p-4 sm:flex-row justify-between gap-3 items-center rounded-xl">
          <Input
            value={editText}
            onChange={(e) => setEditText(e.target.value)}
            placeholder="Enter Prompt and add to the cards..."
            className="text-base sm:text-xl border-0 focus-visible:ring-0 shadow-none p-0 bg-transparent flex-grow"
          />
          <div className="flex items-center gap-3">
            <Select
              value={outlines.length > 0 ? outlines.length.toString() : "0"}
            >
              <SelectTrigger className="w-fit gap-2 font-semibold shadow-xl">
                <SelectValue placeholder="Select number of cards" />
              </SelectTrigger>
              <SelectContent className="w-fit">
                {outlines.length === 0 ? (
                  <SelectItem className="font-semibold" value="0">
                    No cards
                  </SelectItem>
                ) : (
                  Array.from({ length: outlines.length }, (_, i) => i + 1).map(
                    (number) => (
                      <SelectItem
                        key={number}
                        value={number.toString()}
                        className="font-semibold"
                      >
                        {number} {number === 1 ? "Card" : "Cards"}
                      </SelectItem>
                    )
                  )
                )}
              </SelectContent>
            </Select>
            <Button
              variant="destructive"
              onClick={resetCards}
              size="icon"
              aria-label="Reset cards"
            >
              <RotateCcw className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </motion.div>
      <CardList
        outlines={outlines}
        addOutline={addOutline}
        addMultipleOutlines={addMultipleOutlines}
        editingCard={editingCard}
        selectedCard={selectedCard}
        editText={editText}
        onEditChange={setEditText}
        onCardSelect={setSelectedCard}
        setEditText={setEditText}
        setEditingCard={setEditingCard}
        setSelectedCard={setSelectedCard}
        onCardDoubleClick={(id, title) => {
          setEditingCard(id);
          setEditText(title);
        }}
      />
      <Button
        onClick={handleAddCard}
        variant="secondary"
        className="w-full bg-primary-10"
      >
        Add Card
      </Button>
      {outlines?.length > 0 && (
        <Button className="w-full" onClick={handleGenerate}>
          Generate PPT
        </Button>
      )}
    </motion.div>
  );
};

export default ScratchPage;
