<p align="center">
  <i align="center">react-autocomplete-form</i>
</p>


<div align="center">
  <img src="/demo/demo.gif" alt="Demo" />
</div>

A collection of React components for building forms with Google Places autocomplete functionality. The components are designed to be easily customizable and integrate seamlessly with Google Places API for address autocompletion.

## Features

- 🎯 Zero-config components that work out of the box
- 🎨 Fully customizable - modify and style components to match your needs
- 🔒 Type-safe with full TypeScript support
- 📦 No npm dependencies - components are added directly to your project
- 🔍 Google Places API integration for accurate address suggestions
- 🌍 International address support
- ⚡️ Automatic form field population based on selected address

## Installation

```bash
npx react-autocomplete-form init
```

This will:
1. Install required dependencies (clsx, tailwind-merge, lucide-react)
2. Add all components and their dependencies to your project in the following structure:
```
your-project/
├── components/
│   ├── autocomplete-form.tsx
│   ├── location-input.tsx
│   ├── city-input.tsx
│   ├── province-state-input.tsx
│   └── postalcode-input.tsx
├── lib/
│   ├── places.ts
│   └── utils.ts
└── context/
    └── autocomplete-context.tsx
```

## Setup

### 1. Google Places API Key

To use the address autocomplete functionality, you'll need a Google Places API key:

1. Go to the [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the "Places API" and "Maps JavaScript API"
4. Create credentials (API key)
5. (Optional but recommended) Restrict the API key to:
   - HTTP referrers (websites) where you'll use it
   - Only the APIs you need (Places API, Maps JavaScript API)

### 2. Environment Variables

Create a `.env.local` file in your project root (or `.env` if you prefer):

```env
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_google_maps_api_key_here
```

For version control, create a `.env.example` file:

```env
### MAPS ###
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_google_maps_api_key_here
```

## Components

The package provides several components that work together to create a seamless address input experience:

- `AutocompleteForm`: A form wrapper that manages the address context
- `LocationInput`: The main address input with Google Places autocomplete
- `CityInput`: City field that auto-populates based on the selected address
- `ProvinceInput`: Province selection for Canadian addresses
- `StateInput`: State selection for US addresses
- `PostalcodeInput`: Postal/ZIP code input with validation

### How It Works

The components are designed to work together but can be used independently:

1. `LocationInput` provides address suggestions from Google Places API
2. When a suggestion is selected, it automatically populates:
   - City in `CityInput`
   - Province/State in `ProvinceInput`/`StateInput`
   - Postal code in `PostalcodeInput`

All inputs are standard HTML inputs under the hood, making them easy to style and customize.

## Usage

### Basic Example

```tsx
'use client'

import { AutocompleteForm } from "@/components/autocomplete-form";
import { LocationInput } from "@/components/location-input";
import { CityInput } from "@/components/city-input";
import { ProvinceInput } from "@/components/province-state-input";
import { PostalCodeInput } from "@/components/postalcode-input";

export default function AddressForm() {
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    console.log({
      location: formData.get('location'),
      city: formData.get('city'),
      province: formData.get('province'),
      postalCode: formData.get('postalCode'),
    });
  };

  return (
    <AutocompleteForm onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <label htmlFor="location">Address</label>
        <LocationInput 
          name="location" 
          id="location"
          className="w-full px-4 py-2 border rounded-lg" 
        />
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="space-y-2">
          <label htmlFor="city">City</label>
          <CityInput 
            name="city" 
            id="city"
            className="w-full px-4 py-2 border rounded-lg" 
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="province">Province</label>
          <ProvinceInput 
            name="province" 
            id="province"
            className="w-full px-4 py-2 border rounded-lg" 
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="postalCode">Postal Code</label>
          <PostalCodeInput 
            name="postalCode" 
            id="postalCode"
            className="w-full px-4 py-2 border rounded-lg" 
          />
        </div>
      </div>

      <button 
        type="submit"
        className="w-full px-4 py-2 bg-blue-500 text-white rounded-lg"
      >
        Submit
      </button>
    </AutocompleteForm>
  );
}
```

### Customization

All components accept standard HTML input props and can be styled using:
- className prop for Tailwind CSS or other CSS classes
- style prop for inline styles
- Custom CSS/SCSS modules
- CSS-in-JS solutions

Example of custom styling:

```tsx
<LocationInput 
  name="location"
  className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
  placeholder="Start typing your address..."
  required
/>
```

## Requirements

- React 18 or higher
- TypeScript 4.5 or higher
- Google Places API key

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

MIT License - see the [LICENSE](LICENSE) file for details
