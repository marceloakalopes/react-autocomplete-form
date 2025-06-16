import { createContext, useContext, useReducer, ReactNode } from 'react';

// Types
export interface AddressState {
  location: string;
  city: string;
  provinceState: string;
  postalCode: string;
  isAddressSelected: boolean;
  suggestions: PlacePrediction[];
  isLoading: boolean;
  latitude?: number;
  longitude?: number;
}

export interface PlacePrediction {
  placePrediction?: {
    text: {
      text: string;
      matches: Array<{ endOffset: number }>;
    };
    place: string;
    placeId: string;
  };
  queryPrediction?: {
    text: {
      text: string;
      matches: Array<{ endOffset: number }>;
    };
  };
}

// Action Types
type Action =
  | { type: 'SET_LOCATION'; payload: string }
  | { type: 'SET_CITY'; payload: string }
  | { type: 'SET_PROVINCE_STATE'; payload: string }
  | { type: 'SET_POSTAL_CODE'; payload: string }
  | { type: 'SET_SUGGESTIONS'; payload: PlacePrediction[] }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ADDRESS_SELECTED'; payload: boolean }
  | { type: 'RESET_FORM' };

// Initial State
const initialState: AddressState = {
  location: '',
  city: '',
  provinceState: '',
  postalCode: '',
  isAddressSelected: false,
  suggestions: [],
  isLoading: false,
};

// Reducer
function addressReducer(state: AddressState, action: Action): AddressState {
  switch (action.type) {
    case 'SET_LOCATION':
      return { ...state, location: action.payload };
    case 'SET_CITY':
      return { ...state, city: action.payload };
    case 'SET_PROVINCE_STATE':
      return { ...state, provinceState: action.payload };
    case 'SET_POSTAL_CODE':
      return { ...state, postalCode: action.payload };
    case 'SET_SUGGESTIONS':
      return { ...state, suggestions: action.payload };
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    case 'SET_ADDRESS_SELECTED':
      return { ...state, isAddressSelected: action.payload };
    case 'RESET_FORM':
      return initialState;
    default:
      return state;
  }
}

// Context
interface AutocompleteContextType {
  state: AddressState;
  dispatch: React.Dispatch<Action>;
  apiKey: string;
}

const AutocompleteContext = createContext<AutocompleteContextType | undefined>(undefined);

// Provider Component
interface AutocompleteProviderProps {
  children: ReactNode;
  apiKey: string;
}

export function AutocompleteProvider({ children, apiKey }: AutocompleteProviderProps) {
  const [state, dispatch] = useReducer(addressReducer, initialState);

  return (
    <AutocompleteContext.Provider value={{ state, dispatch, apiKey }}>
      {children}
    </AutocompleteContext.Provider>
  );
}

// Custom Hook
export function useAutocomplete() {
  const context = useContext(AutocompleteContext);
  if (context === undefined) {
    throw new Error('useAutocomplete must be used within an AutocompleteProvider');
  }
  return context;
} 