"use client";

import * as React from "react";
import * as SwitchPrimitives from "@radix-ui/react-switch";

import { cn } from "@/lib/utils";
import { Moon, Sun } from "lucide-react";

const CustomSwitch = React.forwardRef<
  React.ElementRef<typeof SwitchPrimitives.Root>,
  React.ComponentPropsWithoutRef<typeof SwitchPrimitives.Root>
>(({ className, ...props }, ref) => (
  <SwitchPrimitives.Root
    className={cn(
      "peer inline-flex h-5 w-9 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent shadow-sm transition-colors duration-300 ease-in-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary data-[state=unchecked]:bg-input relative",
      className
    )}
    {...props}
    ref={ref}
  >
    <Moon
      className={cn(
        "h-4 w-4 absolute z-[1000] top-[10px] left-[10px] stroke-gray-600 fill-white transition-opacity duration-300 ease-in-out",
        "data-[state=checked]:opacity-100 data-[state=unchecked]:opacity-0"
      )}
    />

    <SwitchPrimitives.Thumb
      className={cn(
        "pointer-events-none block h-7 w-7 rounded-full bg-background shadow-lg ring-0 transition-transform duration-300 ease-in-out data-[state=checked]:translate-x-8 data-[state=unchecked]:translate-x-0"
      )}
    />

    <Sun
      className={cn(
        "h-4 w-4 absolute z-[1000] top-[10px] right-[19px] stroke-gray-600 fill-black transition-opacity duration-300 ease-in-out",
        "data-[state=checked]:opacity-0 data-[state=unchecked]:opacity-100"
      )}
    />
  </SwitchPrimitives.Root>
));
CustomSwitch.displayName = SwitchPrimitives.Root.displayName;

export { CustomSwitch };
