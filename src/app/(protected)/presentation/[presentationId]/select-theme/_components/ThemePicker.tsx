import { generateLayouts } from "@/actions/chatgpt";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Slide, Theme } from "@/lib/types";
import { useSlideStore } from "@/store/useSlideStore";
import { Loader2, Wand2 } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import React, { useState } from "react";
import { toast } from "sonner";
import { motion } from "framer-motion";

type Props = {
  selectedTheme: Theme;
  themes: Theme[];
  onThemeSelect: (theme: Theme) => void;
};

const ThemePicker = ({ selectedTheme, themes, onThemeSelect }: Props) => {
  const router = useRouter();
  const params = useParams();

  const { project, setSlides, currentTheme } = useSlideStore();
  const [loading, setLoading] = useState(false);

  const handleGenerateLayouts = async () => {
    setLoading(true);
    if (!selectedTheme) {
      toast.error("Error", {
        description: "Please select a theme",
      });
      return;
    }
    if (project?.id === "") {
      toast.error("Error", {
        description: "Please create a project first",
      });
      router.push("/create-page");
      return;
    }

    try {
      const res = await generateLayouts(
        params.presentationId as string,
        currentTheme.name
      );

      if (res.status !== 200 && !res?.data) {
        throw new Error("Failed to generate layouts");
      }

      toast.success("Success", {
        description: "Generated Successfully",
      });

      router.push(`/presentation/${project?.id}`);
      if (res.data) {
        setSlides(res.data as Slide[]);
      } else {
        throw new Error("No data received");
      }
    } catch (error) {
      console.log(error);

      toast.error("Error", {
        description: "Failed to generate layouts",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="w-[400px] overflow-hidden sticky top-0 h-screen flex flex-col"
      style={{
        backgroundColor:
          selectedTheme.sidebarColor || selectedTheme.backgroundColor,
        borderLeft: `1px solid ${selectedTheme.accentColor}`,
      }}
    >
      <div className="p-8 space-y-6 flex-shrink-0">
        <div className="space-y-4">
          <h2 className="text-3xl font-bold">Select Theme</h2>
          <p className="text-sm" style={{ color: selectedTheme.accentColor }}>
            Choose from our selection of themes
          </p>
        </div>
        <Button
          className="w-full h-12 text-lg shadow-lg hover:shadow-xl translate-all duration-300"
          style={{
            backgroundColor: selectedTheme.accentColor,
            color: selectedTheme.backgroundColor,
          }}
          onClick={handleGenerateLayouts}
        >
          {loading ? (
            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
          ) : (
            <Wand2 className="mr-2 h-5 w-5" />
          )}
          {loading ? (
            <p className="animate-pulse"> Generating</p>
          ) : (
            "Generate Theme"
          )}
        </Button>
      </div>
      <ScrollArea className="flex-grow px-8 pb-8">
        <div className="grid grid-cols-1 gap-4">
          {themes.map((theme) => (
            <motion.div
              key={theme.name}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button
                onClick={() => onThemeSelect(theme)}
                className="flex flex-col items-center justify-start p-6 w-full h-auto"
                style={{
                  fontFamily: theme.fontFamily,
                  color: theme.fontColor,
                  background: theme.gradientBackground || theme.backgroundColor,
                }}
              >
                <div className="w-full flex items-center justify-between">
                  <span className="text-xl font-bold">{theme.name}</span>
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: theme.accentColor }}
                  ></div>
                </div>
                <div className="space-y-1 w-full">
                  <div
                    className="text-2xl font-bold"
                    style={{ color: theme.accentColor }}
                  >
                    Title
                  </div>
                  <div className="text-base opacity-70 ">
                    Body &{" "}
                    <span style={{ color: theme.accentColor }}>Accent</span>
                  </div>
                </div>
              </Button>
            </motion.div>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
};

export default ThemePicker;
