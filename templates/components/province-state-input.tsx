'use client'

import * as React from "react";
import { useAutocomplete } from "../context/autocomplete-context";
import { cn } from "../lib/utils";

type ProvinceInputProps = React.ComponentPropsWithoutRef<"input">;

export const ProvinceInput = React.forwardRef<
  React.ComponentRef<"input">,
  ProvinceInputProps
>(({ className, ...props }, ref) => {
  const { state, dispatch } = useAutocomplete();

  return (
    <input
      ref={ref}
      type="text"
      {...props}
      required
      value={state.provinceState}
      onChange={(e) =>
        dispatch({ type: "SET_PROVINCE_STATE", payload: e.target.value })
      }
      placeholder="e.g. Quebec"
      pattern="^[A-Za-z\s]+$"
      className={cn(
        "w-full px-4 py-2 text-sm rounded-xl border border-gray-300 focus:outline-none focus:border-black transition-colors ease-in duration-300",
        className
      )}
    />
  );
});

ProvinceInput.displayName = "ProvinceInput";

type StateInputProps = React.ComponentPropsWithoutRef<"input">;

export const StateInput = React.forwardRef<
  React.ComponentRef<"input">,
  StateInputProps
>(({ className, ...props }, ref) => {
  const { state, dispatch } = useAutocomplete();

  return (
    <input
      ref={ref}
      type="text"
      {...props}
      required
      value={state.provinceState}
      onChange={(e) =>
        dispatch({ type: "SET_PROVINCE_STATE", payload: e.target.value })
      }
      placeholder="e.g. California"
      pattern="^[A-Za-z\s]+$"
      className={cn(
        "w-full px-4 py-2 text-sm rounded-xl border border-gray-300 focus:outline-none focus:border-black transition-colors ease-in duration-300",
        className
      )}
    />
  );
});

StateInput.displayName = "StateInput";
