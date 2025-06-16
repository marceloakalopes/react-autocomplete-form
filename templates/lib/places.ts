const GOOGLE_PLACES_API_URL = "https://places.googleapis.com/v1/places:autocomplete";
const GOOGLE_PLACE_DETAILS_API_URL = "https://places.googleapis.com/v1/places/";

interface LocationBias {
  circle?: {
    center: {
      latitude: number;
      longitude: number;
    };
    radius: number;
  };
  rectangle?: {
    low: {
      latitude: number;
      longitude: number;
    };
    high: {
      latitude: number;
      longitude: number;
    };
  };
}

interface PlacesAutocompleteRequest {
  input: string;
  locationBias?: LocationBias;
  locationRestriction?: LocationBias;
  origin?: {
    latitude: number;
    longitude: number;
  };
  regionCode?: string;
  languageCode?: string;
  typesFilter?: {
    includedTypes?: string[];
    excludedTypes?: string[];
  };
  maxResultCount?: number;
}

const DEFAULT_REQUEST: Omit<PlacesAutocompleteRequest, 'input'> = {
  locationBias: {
    circle: {
      center: {
        latitude: 46.5136,
        longitude: 84.3358,
      },
      radius: 500.0,
    },
  },
};

/**
 * Search for places using the Google Places API.
 * @param place - The place to search for.
 * @param customRequest - Optional custom request parameters to override defaults.
 * @returns An array of place predictions containing the placeId and formattedText.
 */
export async function searchPlaces(
  place: string,
  customRequest?: Partial<PlacesAutocompleteRequest>
) {
  try {
    const requestBody: PlacesAutocompleteRequest = {
      input: place,
      ...DEFAULT_REQUEST,
      ...customRequest,
    };

    const response = await fetch(GOOGLE_PLACES_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Goog-Api-Key": process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || '',
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status} - ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (err) {
    console.error("Error while searching places:", err);
  }
}

export interface AddressComponents {
  streetNumber: string;
  street: string;
  city: string;
  province: string;
  postalCode: string;
}

/**
 * Get the details of a place using the Google Places API.
 * @param placeId - The placeId of the place to get the details of.
 * @returns The address components of the place.
 */
export async function getPlaceDetails(placeId: string): Promise<AddressComponents> {
  try {
    const response = await fetch(
      `${GOOGLE_PLACE_DETAILS_API_URL}${placeId}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "X-Goog-Api-Key": process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || '',
          "X-Goog-FieldMask": "addressComponents,formattedAddress",
        },
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP ${response.status} - ${response.statusText}`);
    }

    const data = await response.json();
    const addressComponents = data.addressComponents || [];

    return {
      streetNumber: addressComponents.find((component: any) =>
        component.types.includes("street_number")
      )?.longText || "",
      street: addressComponents.find((component: any) =>
        component.types.includes("route")
      )?.longText || "",
      city: addressComponents.find((component: any) =>
        component.types.includes("locality")
      )?.longText || "",
      province: addressComponents.find((component: any) =>
        component.types.includes("administrative_area_level_1")
      )?.longText || "",
      postalCode: addressComponents.find((component: any) =>
        component.types.includes("postal_code")
      )?.longText || "",
    };
  } catch (err) {
    console.error("Error fetching place details:", err);
    throw err;
  }
}