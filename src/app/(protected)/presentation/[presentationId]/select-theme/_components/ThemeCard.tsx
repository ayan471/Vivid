import React from "react";
import { AnimationControls } from "framer-motion";
import { Theme } from "@/lib/types";

interface ThemeCardProps {
  tittle: string;
  description: string;
  content: React.ReactNode;
  variant: "left" | "main" | "right";
  theme: Theme;
  controls: AnimationControls;
}

const ThemeCard = ({
  content,
  controls,
  description,
  theme,
  tittle,
  variant,
}: ThemeCardProps) => {
  const variants = {
    left: {
      hidden: { opacity: 0, x: "-50%", y: "-50%", scale: 0.9, rotate: 0 },
      visible: {
        opacity: 1,
        x: "-25%",
        y: "-25%",
      },
    },
    right: {},
    main: {},
  };
  return <div>ThemeCard</div>;
};

export default ThemeCard;
