'use client'

import * as React from "react";
import { useState, useEffect, useRef } from "react";
import { X } from "lucide-react";
import {
  useAutocomplete,
  PlacePrediction,
} from "../context/autocomplete-context";
import { searchPlaces, getPlaceDetails } from "../lib/places";
import { cn } from "../lib/utils";

type LocationInputProps = React.ComponentPropsWithoutRef<"input">;

export const LocationInput = React.forwardRef<
  React.ComponentRef<"input">,
  LocationInputProps
>(({ className, ...props }, ref) => {
  const { state, dispatch } = useAutocomplete();
  const [typingTimeout, setTypingTimeout] = useState<NodeJS.Timeout>();
  const suggestionsRef = useRef<HTMLDivElement>(null);

  const handleSuggestionClick = async (suggestion: PlacePrediction) => {
    if (!suggestion.placePrediction) return;

    // Hide suggestions immediately
    dispatch({ type: "SET_SUGGESTIONS", payload: [] });
    dispatch({ type: "SET_ADDRESS_SELECTED", payload: true });

    try {
      const addressComponents = await getPlaceDetails(
        suggestion.placePrediction.placeId
      );

      dispatch({
        type: "SET_LOCATION",
        payload:
          `${addressComponents.streetNumber} ${addressComponents.street}`.trim(),
      });
      dispatch({ type: "SET_CITY", payload: addressComponents.city });
      dispatch({
        type: "SET_PROVINCE_STATE",
        payload: addressComponents.province,
      });
      dispatch({
        type: "SET_POSTAL_CODE",
        payload: addressComponents.postalCode,
      });
    } catch (err) {
      console.error("Error fetching place details:", err);
      // Reset the form if there's an error
      dispatch({ type: "RESET_FORM" });
    }
  };

  useEffect(() => {
    if (typingTimeout) {
      clearTimeout(typingTimeout);
    }

    if (!state.location) {
      dispatch({ type: "SET_SUGGESTIONS", payload: [] });
      return;
    }

    const timeout = setTimeout(async () => {
      dispatch({ type: "SET_LOADING", payload: true });
      const results = await searchPlaces(state.location);
      if (results) {
        dispatch({
          type: "SET_SUGGESTIONS",
          payload: results.suggestions || [],
        });
      }
      dispatch({ type: "SET_LOADING", payload: false });
    }, 2000);

    setTypingTimeout(timeout);

    return () => {
      if (typingTimeout) {
        clearTimeout(typingTimeout);
      }
    };
  }, [state.location, dispatch]);

  // Close suggestions when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        suggestionsRef.current &&
        !suggestionsRef.current.contains(event.target as Node)
      ) {
        dispatch({ type: "SET_SUGGESTIONS", payload: [] });
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative w-full">
      <input
        ref={ref}
        {...props}
        type="text"
        value={state.location}
        autoComplete="off"
        placeholder={props.placeholder || "e.g. 123 Trunk Rd"}
        onChange={(e) => {
          dispatch({ type: "SET_LOCATION", payload: e.target.value });
          dispatch({ type: "SET_ADDRESS_SELECTED", payload: false });
          dispatch({ type: "SET_LOADING", payload: true });
          dispatch({ type: "SET_CITY", payload: "" });
          dispatch({ type: "SET_PROVINCE_STATE", payload: "" });
          dispatch({ type: "SET_POSTAL_CODE", payload: "" });
        }}
        className={cn(
          "w-full px-4 py-2 text-sm rounded-xl border border-gray-300 focus:outline-none focus:border-black transition-colors ease-in duration-300",
          className
        )}
      />
      {state.location && (
        <button
          type="button"
          onClick={() => {
            dispatch({ type: "RESET_FORM" });
          }}
          className="absolute right-2 top-1/2 -translate-y-1/2 bg-gray-100 hover:bg-gray-200 cursor-pointer p-2 rounded-full transition-colors duration-200"
        >
          <X size={12} />
        </button>
      )}

      {state.location.length > 0 && !state.isAddressSelected && (
        <div
          ref={suggestionsRef}
          className="absolute top-[calc(100%+0.5rem)] w-full bg-white rounded-xl p-3 shadow-[0px_0px_20px_5px_rgba(0,_0,_0,_0.1)] z-10"
        >
          <div className="flex flex-col w-full gap-1">
            {state.isLoading
              ? Array.from({ length: 3 }).map((_, index) => (
                  <div
                    key={index}
                    className="h-8 bg-gray-200 rounded-xl animate-pulse"
                  ></div>
                ))
              : state.suggestions?.map((suggestion: PlacePrediction, index) => (
                  <button
                    key={index}
                    type="button"
                    onClick={() => handleSuggestionClick(suggestion)}
                    className="px-3 py-2 rounded-xl hover:bg-gray-100 transition-colors duration-200 font-medium text-start cursor-pointer"
                  >
                    {suggestion.placePrediction?.text?.text ||
                      suggestion.queryPrediction?.text?.text}
                  </button>
                ))}
          </div>

          <div className="flex gap-1 w-full justify-end items-center mt-5">
            <span className="text-[10px] text-gray-400">powered by</span>
            <img
              src="https://www.gstatic.com/marketing-cms/assets/images/c5/3a/200414104c669203c62270f7884f/google-wordmarks-2x.webp=n-w200-h64-fcrop64=1,00000000ffffffff-rw"
              height={42}
              width={42}
              alt="Google Logo"
            />
          </div>
        </div>
      )}
    </div>
  );
});

LocationInput.displayName = "LocationInput";
