# React Autocomplete Form

A collection of React components for building forms with Google Places autocomplete functionality.

## Installation

```bash
# Add all components to your project
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

## Available Components

- `AutocompleteForm`: A complete form with address autocomplete
- `LocationInput`: A single input field with Google Places autocomplete
- `CityInput`: A city selection input with autocomplete
- `ProvinceStateInput`: A province/state selection input
- `PostalcodeInput`: A postal code input with validation

## Usage

After installation, you can import and use the components like any other React component:

```tsx
'use client'

import { AutocompleteForm } from "@/components/autocomplete-form";
import { LocationInput } from "@/components/location-input";
import { CityInput } from "@/components/city-input";
import { ProvinceInput } from "@/components/province-state-input";
import { StateInput } from "@/components/province-state-input";
import { PostalCodeInput } from "@/components/postalcode-input";

export default function Home() {

  /**
   * Handle the form submission.
   * @param event - The form event.
   */
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
    <div className="relative flex flex-col min-h-screen items-center justify-center p-4">
      <div className="w-full max-w-xl">

        {/* Autocomplete Form */}
        <AutocompleteForm 
          className="flex flex-col gap-4"
          onSubmit={ async () => handleSubmit}
        >
          <div className="flex flex-col gap-1">
            <label htmlFor="location" className="font-semibold text-sm">
              Enter address *
            </label>

            {/* Location Input */}
            <LocationInput name="location" id="location" />
          </div>

          <div className="flex max-md:flex-col max-md:gap-3 w-full gap-2">
            <div className="w-full flex flex-col gap-1">
              <label htmlFor="city" className="font-semibold text-sm">
                City *
              </label>

              {/* City Input */}
              <CityInput name="city" id="city" />
            </div>

            <div className="w-full flex flex-col gap-1">
              <label htmlFor="province" className="font-semibold text-sm">
                Province *
              </label>

              {/* Province/State Input */}
              <ProvinceInput name="province" id="province" />

              {/* <StateInput name="province" id="province" /> */}
            </div>

            <div className="w-full flex flex-col gap-1">
              <label htmlFor="postalCode" className="font-semibold text-sm">
                Postal Code *
              </label>

              {/* Postal Code Input */}
              <PostalCodeInput name="postalCode" id="postalCode" />
            </div>
          </div>

          <button
            type="submit"
            className="mt-4 px-6 py-2 bg-black text-white font-semibold cursor-pointer rounded-xl hover:bg-gray-800 transition-colors duration-200"
          >
            Submit
          </button>
        </AutocompleteForm>
      </div>
    </div>
  );
}
```

## Requirements

- React 18 or higher
- TypeScript 4.5 or higher
- A Google Places API key (set as GOOGLE_PLACES_API_KEY in your environment)

## Features

- 🎯 Zero-config components
- 🔒 Type-safe
- 🎨 Customizable styles
- 📦 No npm dependencies - components are added directly to your project
- 🔍 Google Places API integration
- 🌍 International address support

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

MIT License - see the [LICENSE](LICENSE) file for details
