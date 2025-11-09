import { useState, useEffect, useRef } from 'react';
import { ChevronDown, Plus, X } from 'lucide-react';

interface CreatableSelectProps {
  value: string;
  onChange: (value: string) => void;
  options: string[];
  placeholder?: string;
  storageKey: string;
  className?: string;
}

export function CreatableSelect({
  value,
  onChange,
  options: defaultOptions,
  placeholder = 'Select or create...',
  storageKey,
  className = '',
}: CreatableSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [savedOptions, setSavedOptions] = useState<string[]>([]);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Load saved options from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem(storageKey);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setSavedOptions(parsed);
      } catch (err) {
        console.error('Failed to load options from localStorage:', err);
      }
    }
  }, [storageKey]);

  // Combine default options with saved options (remove duplicates)
  const allOptions = Array.from(new Set([...defaultOptions, ...savedOptions]));

  // Filter options based on search query
  const filteredOptions = allOptions.filter((option) =>
    option.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Check if search query matches any existing option
  const exactMatch = allOptions.some(
    (option) => option.toLowerCase() === searchQuery.toLowerCase()
  );

  // Handle click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setSearchQuery('');
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleCreateNew = () => {
    if (!searchQuery.trim()) return;

    // Save to localStorage
    const newOption = searchQuery.trim();
    const updatedOptions = [...savedOptions, newOption];
    setSavedOptions(updatedOptions);
    localStorage.setItem(storageKey, JSON.stringify(updatedOptions));

    // Set as current value
    onChange(newOption);
    setIsOpen(false);
    setSearchQuery('');
  };

  const handleSelectOption = (option: string) => {
    onChange(option);
    setIsOpen(false);
    setSearchQuery('');
  };

  const handleClear = () => {
    onChange('');
  };

  return (
    <div ref={dropdownRef} className="relative">
      <div
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full px-4 py-3 border border-gray-300 rounded-lg focus-within:ring-2 focus-within:ring-[var(--primary)] focus-within:border-transparent cursor-pointer flex items-center justify-between ${className}`}
      >
        <span className={value ? 'text-gray-900' : 'text-gray-500'}>
          {value || placeholder}
        </span>
        <div className="flex items-center gap-2">
          {value && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                handleClear();
              }}
              className="text-gray-400 hover:text-gray-600"
              aria-label="Clear selection"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <ChevronDown
            className={`w-5 h-5 text-gray-400 transition-transform ${
              isOpen ? 'rotate-180' : ''
            }`}
          />
        </div>
      </div>

      {isOpen && (
        <div className="absolute z-50 w-full mt-2 bg-white border border-gray-300 rounded-lg shadow-lg max-h-64 overflow-hidden">
          <div className="p-2 border-b border-gray-200">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search or type to create..."
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent outline-none"
              autoFocus
            />
          </div>

          <div className="max-h-48 overflow-y-auto">
            {filteredOptions.length > 0 ? (
              filteredOptions.map((option) => (
                <button
                  key={option}
                  type="button"
                  onClick={() => handleSelectOption(option)}
                  className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-100 transition-colors ${
                    value === option ? 'bg-[var(--primary-light)] text-[var(--primary)]' : ''
                  }`}
                >
                  {option}
                </button>
              ))
            ) : (
              <div className="px-4 py-3 text-sm text-gray-500 text-center">
                No options found
              </div>
            )}

            {searchQuery.trim() && !exactMatch && (
              <button
                type="button"
                onClick={handleCreateNew}
                className="w-full text-left px-4 py-2 text-sm border-t border-gray-200 hover:bg-[var(--primary-light)] text-[var(--primary)] font-medium flex items-center gap-2 transition-colors"
              >
                <Plus className="w-4 h-4" />
                Create "{searchQuery}"
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
