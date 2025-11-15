import { useState } from 'react';
import { Check, X } from 'lucide-react';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from './ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from './ui/popover';

const COUNTRIES = [
  { code: 'USA', name: 'United States' },
  { code: 'CHN', name: 'China' },
  { code: 'JPN', name: 'Japan' },
  { code: 'DEU', name: 'Germany' },
  { code: 'GBR', name: 'United Kingdom' },
  { code: 'FRA', name: 'France' },
  { code: 'IND', name: 'India' },
  { code: 'BRA', name: 'Brazil' },
  { code: 'CAN', name: 'Canada' },
  { code: 'ITA', name: 'Italy' },
  { code: 'KOR', name: 'South Korea' },
  { code: 'AUS', name: 'Australia' },
  { code: 'ESP', name: 'Spain' },
  { code: 'MEX', name: 'Mexico' },
  { code: 'IDN', name: 'Indonesia' },
  { code: 'NLD', name: 'Netherlands' },
  { code: 'SAU', name: 'Saudi Arabia' },
  { code: 'TUR', name: 'Turkey' },
  { code: 'CHE', name: 'Switzerland' },
  { code: 'POL', name: 'Poland' },
];

interface CountrySelectorProps {
  selectedCountries: string[];
  onCountriesChange: (countries: string[]) => void;
}

export function CountrySelector({ selectedCountries, onCountriesChange }: CountrySelectorProps) {
  const [open, setOpen] = useState(false);

  const toggleCountry = (countryCode: string) => {
    if (selectedCountries.includes(countryCode)) {
      onCountriesChange(selectedCountries.filter(c => c !== countryCode));
    } else {
      if (selectedCountries.length < 6) {
        onCountriesChange([...selectedCountries, countryCode]);
      }
    }
  };

  const removeCountry = (countryCode: string) => {
    onCountriesChange(selectedCountries.filter(c => c !== countryCode));
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        {selectedCountries.map(code => {
          const country = COUNTRIES.find(c => c.code === code);
          return (
            <Badge key={code} variant="secondary" className="px-3 py-1.5">
              {country?.name}
              <button
                onClick={() => removeCountry(code)}
                className="ml-2 hover:text-destructive"
              >
                <X className="w-3 h-3" />
              </button>
            </Badge>
          );
        })}
      </div>

      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button variant="outline" className="w-full justify-start">
            Add countries {selectedCountries.length < 6 && `(${selectedCountries.length}/6)`}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-full p-0" align="start">
          <Command>
            <CommandInput placeholder="Search countries..." />
            <CommandList>
              <CommandEmpty>No countries found.</CommandEmpty>
              <CommandGroup>
                {COUNTRIES.map(country => {
                  const isSelected = selectedCountries.includes(country.code);
                  return (
                    <CommandItem
                      key={country.code}
                      value={country.name}
                      onSelect={() => toggleCountry(country.code)}
                    >
                      <div className="flex items-center gap-2 flex-1">
                        <div className={`w-4 h-4 border rounded flex items-center justify-center ${
                          isSelected ? 'bg-primary border-primary' : 'border-input'
                        }`}>
                          {isSelected && <Check className="w-3 h-3 text-primary-foreground" />}
                        </div>
                        <span>{country.name}</span>
                      </div>
                    </CommandItem>
                  );
                })}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>

      {selectedCountries.length >= 6 && (
        <p className="text-sm text-amber-600">Maximum 6 countries selected</p>
      )}
    </div>
  );
}
