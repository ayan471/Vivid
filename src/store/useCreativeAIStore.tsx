import { create } from "zustand";
import { persist } from "zustand/middleware";
import { OutlineCard } from "@/lib/types";

type CreativeAiStore = {
  outlines: OutlineCard[] | [];
  addMultipleOutlines: (outline: OutlineCard[]) => void;
  addOutline: (outline: OutlineCard) => void;
  currentAiPrompt: string;
  setCurrentAiPrompt(prompt: string): void;
  resetOutlines: () => void;
};

export const useCreativeAiStore = create(
  persist<CreativeAiStore>(
    (set) => ({
      outlines: [],
      currentAiPrompt: "",
      addMultipleOutlines: (outlines: OutlineCard[]) => {
        set(() => ({ outlines: [...outlines] }));
      },
      addOutline: (outline: OutlineCard) => {
        set((state) => ({ outlines: [outline, ...state.outlines] }));
      },
      setCurrentAiPrompt: (prompt: string) => {
        set({ currentAiPrompt: prompt });
      },
      resetOutlines: () => set({ outlines: [] }),
    }),
    { name: "creative-ai" }
  )
);

export default useCreativeAiStore;
