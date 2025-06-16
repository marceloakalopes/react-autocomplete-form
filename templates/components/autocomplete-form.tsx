'use client'

import * as React from "react";
import { AutocompleteProvider } from "../context/autocomplete-context";
import { cn } from "../lib/utils";

type AutocompleteFormProps = React.ComponentPropsWithoutRef<"form">;

export const AutocompleteForm = React.forwardRef<
  React.ComponentRef<"form">,
  AutocompleteFormProps
>(({ className, ...props }, ref) => {
  return (
    <AutocompleteProvider apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || ""}>
      <form ref={ref} {...props} className={cn(
        "w-full border-0 p-0 m-0 bg-transparent",
        className
      )}>
        {props.children}
      </form>
    </AutocompleteProvider>
  );
});

AutocompleteForm.displayName = "AutocompleteForm";
