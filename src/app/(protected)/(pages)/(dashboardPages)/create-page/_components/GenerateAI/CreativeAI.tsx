"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  containerVariants,
  itemVariants,
  toastCustomStyles,
} from "@/lib/constants";
import useCreativeAiStore from "@/store/useCreativeAIStore";
import { motion } from "framer-motion";
import { ChevronLeft, Loader2, RotateCcw } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import CardList from "../Common/CardList";
import usePromptStore from "@/store/usePromptStore";
import RecentPrompts from "./RecentPrompts";
import { toast } from "sonner";
import { generateCreativePrompt } from "@/actions/chatgpt";
import { OutlineCard } from "@/lib/types";
import { v4 as uuid } from "uuid";
import { createProject } from "@/actions/project";
import { useSlideStore } from "@/store/useSlideStore";

type Props = {
  onBack: () => void;
};

const CreativeAI = ({ onBack }: Props) => {
  const router = useRouter();
  const { setProject } = useSlideStore();
  const [editingCard, setEditingCard] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedCard, setSelectedCard] = useState<string | null>(null);
  const [editText, setEditText] = useState("");
  const { prompts, addPrompt } = usePromptStore();
  const {
    currentAiPrompt,
    setCurrentAiPrompt,
    outlines,
    resetOutlines,
    addOutline,
    addMultipleOutlines,
  } = useCreativeAiStore();
  const [noOfCards, setNoOfCards] = useState(0);

  const handleBack = () => {
    onBack();
  };

  const resetCards = () => {
    setEditingCard(null);
    setSelectedCard(null);
    setEditText("");

    setCurrentAiPrompt("");
    resetOutlines();
  };

  const generateOutline = async () => {
    if (currentAiPrompt === "") {
      toast.error("Error", {
        description: "Please enter a prompt to generate an outline",
      });
      return;
    }
    setIsGenerating(true);
    const res = await generateCreativePrompt(currentAiPrompt);
    if (res.status === 200 && res?.data?.outlines) {
      const cardsData: OutlineCard[] = [];
      res.data?.outlines.map((outline: string, idx: number) => {
        const newCard = {
          id: uuid(),
          title: outline,
          order: idx + 1,
        };
        cardsData.push(newCard);
      });
      addMultipleOutlines(cardsData);
      setNoOfCards(cardsData.length);
      toast.success("Success", {
        description: "Outlines generated successfully",
        style: toastCustomStyles.success,
      });
    } else {
      toast.error("Error", {
        description: "Failed to generated outline. Please try again.",
        style: toastCustomStyles.error,
      });
    }
    setIsGenerating(false);
  };

  const handleGenerate = async () => {
    setIsGenerating(true);
    if (outlines.length === 0) {
      toast.error("Error", {
        description: "Please add atleast one card to generate slides",
        style: toastCustomStyles.error,
      });
      return;
    }
    try {
      const res = await createProject(
        currentAiPrompt,
        outlines.slice(0, noOfCards)
      );

      if (res.status !== 200 || !res.data) {
        throw new Error("Unable to create project");
      }
      router.push(`/presentation/${res.data.id}/select-theme`);
      setProject(res.data);
      addPrompt({
        id: uuid(),
        title: currentAiPrompt || outlines?.[0]?.title,
        outlines: outlines,
        createdAt: new Date().toISOString(),
      });

      toast.success("Success", {
        description: "Project successfully created!",
      });
      setCurrentAiPrompt("");
      resetOutlines();
    } catch (error) {
      console.log(error);

      toast.error("Error", {
        description: "Please add atleast one card to generate slides",
        style: toastCustomStyles.error,
      });
    } finally {
      setIsGenerating(false);
    }
  };

  useEffect(() => {
    setNoOfCards(outlines.length);
  }, [outlines.length]);

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
      <motion.div variants={itemVariants} className="text-center space-y-2">
        <h1 className="text-4xl font-bold text-primary">
          Generate with <span className="text-vivid">Creative AI</span>
        </h1>
        <p className="text-secondary">What would you like today?</p>
      </motion.div>
      <motion.div
        className="bg-primary/10 p-4 rounded-xl"
        variants={itemVariants}
      >
        <div className="flex flex-col sm:flex-row justify-between gap-3 items-center rounded-xl">
          <Input
            placeholder="Enter Prompt and add to the cards..."
            className="text-base sm:text-xl border-0 focus-visible:ring-0 shadow-none p-0 bg-transparent flex-grow"
            required
            value={currentAiPrompt || ""}
            onChange={(e) => setCurrentAiPrompt(e.target.value)}
          />
          <div className="flex items-center gap-3">
            <Select
              value={noOfCards.toString()}
              onValueChange={(value) => setNoOfCards(parseInt(value))}
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
              size="icon"
              onClick={resetCards}
              aria-label="Reset cards"
            >
              <RotateCcw className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </motion.div>
      <div className="w-full flex justify-center items-center">
        <Button
          className="font-medium text-lg flex gap-2 items-center"
          onClick={generateOutline}
          disabled={isGenerating}
        >
          {isGenerating ? (
            <>
              <Loader2 className="animate-spin mr-2" /> Generating...
            </>
          ) : (
            "Generating Outline"
          )}
        </Button>
      </div>
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
      {outlines.length > 0 && (
        <Button
          className="w-full"
          onClick={handleGenerate}
          disabled={isGenerating}
        >
          {isGenerating ? (
            <>
              <Loader2 className="animate-spin mr-2" /> Generating...
            </>
          ) : (
            "Generate"
          )}
        </Button>
      )}
      {prompts?.length > 0 && <RecentPrompts />}
    </motion.div>
  );
};

export default CreativeAI;
