'use client'

import * as React from "react";
import { useAutocomplete } from "../context/autocomplete-context";
import { cn } from "../lib/utils";

type CityInputProps = React.ComponentPropsWithoutRef<"input">;

export const CityInput = React.forwardRef<
  React.ComponentRef<"input">,
  CityInputProps
>(({ className, ...props }, ref) => {
  const { state, dispatch } = useAutocomplete();

  return (
    <input
      ref={ref}
      type="text"
      {...props}
      required
      value={state.city}
      placeholder={props.placeholder || "e.g. Vancouver"}
      onChange={(e) => dispatch({ type: "SET_CITY", payload: e.target.value })}
      className={cn(
        "w-full px-4 py-2 text-sm rounded-xl border border-gray-300 focus:outline-none focus:border-black transition-colors ease-in duration-300",
        className
      )}
    />
  );
});

CityInput.displayName = "CityInput";
