'use client'

import * as React from "react";
import { useAutocomplete } from "../context/autocomplete-context";
import { cn } from "../lib/utils";

type PostalCodeInputProps = React.ComponentPropsWithoutRef<"input">;

export const PostalCodeInput = React.forwardRef<
  React.ComponentRef<"input">,
  PostalCodeInputProps
>(({ className, ...props }, ref) => {
  const { state, dispatch } = useAutocomplete();

  return (
    <input
      ref={ref}
      type="text"
      {...props}
      required
      value={state.postalCode}
      onChange={(e) =>
        dispatch({ type: "SET_POSTAL_CODE", payload: e.target.value })
      }
      placeholder={props.placeholder || "e.g. V5K 0A1"}
      className={cn(
        "w-full px-4 py-2 text-sm rounded-xl border border-gray-300 focus:outline-none focus:border-black transition-colors ease-in duration-300",
        className
      )}
    />
  );
});

PostalCodeInput.displayName = "PostalCodeInput";