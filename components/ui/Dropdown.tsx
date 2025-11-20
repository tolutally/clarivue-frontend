import { useState, useEffect, useRef } from 'react';
import { ChevronDown, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { semantic } from '../../utils/colors';

export interface DropdownOption {
  value: string;
  label: string;
}

interface DropdownProps {
  value: string;
  onChange: (value: string) => void;
  options: DropdownOption[];
  placeholder?: string;
  className?: string;
  disabled?: boolean;
}

export function Dropdown({
  value,
  onChange,
  options,
  placeholder = 'Select...',
  className = '',
  disabled = false,
}: DropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  const selectedOption = options.find(opt => opt.value === value);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setHighlightedIndex(-1);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  // Keyboard navigation
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault();
          setHighlightedIndex(prev => 
            prev < options.length - 1 ? prev + 1 : prev
          );
          break;
        case 'ArrowUp':
          e.preventDefault();
          setHighlightedIndex(prev => prev > 0 ? prev - 1 : prev);
          break;
        case 'Enter':
          e.preventDefault();
          if (highlightedIndex >= 0 && highlightedIndex < options.length) {
            onChange(options[highlightedIndex].value);
            setIsOpen(false);
            setHighlightedIndex(-1);
          }
          break;
        case 'Escape':
          e.preventDefault();
          setIsOpen(false);
          setHighlightedIndex(-1);
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, highlightedIndex, options, onChange]);

  // Scroll highlighted item into view
  useEffect(() => {
    if (highlightedIndex >= 0 && listRef.current) {
      const highlightedElement = listRef.current.children[highlightedIndex] as HTMLElement;
      if (highlightedElement) {
        highlightedElement.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
      }
    }
  }, [highlightedIndex]);

  const handleToggle = () => {
    if (!disabled) {
      setIsOpen(!isOpen);
      if (!isOpen) {
        // Set highlighted to current selection when opening
        const currentIndex = options.findIndex(opt => opt.value === value);
        setHighlightedIndex(currentIndex);
      }
    }
  };

  const handleSelect = (optionValue: string) => {
    onChange(optionValue);
    setIsOpen(false);
    setHighlightedIndex(-1);
  };

  // Calculate min width for dropdown menu (so it fits contents)
  const menuMinWidth =
    dropdownRef.current?.offsetWidth
      ? `${dropdownRef.current.offsetWidth}px`
      : 'min-content';

  return (
    <div
      ref={dropdownRef}
      className={`relative inline-block align-middle ${className}`}
      style={{ minWidth: 0, width: 'auto' }}
    >
      {/* Trigger Button */}
      <Button
        type="button"
        onClick={handleToggle}
        disabled={disabled}
        size="md"
        variant="outline"
        endIcon={
          <ChevronDown
            className={`w-4 h-4 ${semantic.textSecondary} transition-transform duration-200 ${
              isOpen ? 'rotate-180' : ''
            }`}
          />
        }
        className={`
          inline-flex items-center justify-between min-w-12
          ${semantic.surface} border ${semantic.borderMedium}
          ${selectedOption ? semantic.textPrimary : semantic.textSecondary}
          ${disabled 
            ? 'opacity-50 cursor-not-allowed' 
            : `hover:${semantic.borderStrong} focus:ring-primary focus:border-transparent`
          }
          ${isOpen ? 'ring-2 ring-primary border-transparent' : ''}
          whitespace-nowrap
        `}
        style={{
          width: 'auto',
          minWidth: 0,
          maxWidth: '100%',
        }}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
      >
        <span
          className="truncate"
        >
          {selectedOption ? selectedOption.label : placeholder}
        </span>
      </Button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div
          className={`
            absolute z-50 mt-2 left-0
            ${semantic.surface} border ${semantic.borderMedium}
            rounded-lg shadow-lg
            max-h-64 overflow-hidden
            animate-in fade-in-0 slide-in-from-top-2 duration-200
          `}
          style={{
            minWidth: menuMinWidth,
            width: 'fit-content',
            maxWidth: '100vw',
          }}
          role="listbox"
        >
          <div
            ref={listRef}
            className="py-1 overflow-y-auto overflow-x-hidden max-h-64 scrollbar-thin"
          >
            {options.map((option, index) => {
              const isSelected = option.value === value;
              const isHighlighted = index === highlightedIndex;

              return (
                <Button
                  key={option.value}
                  type="button"
                  onClick={() => handleSelect(option.value)}
                  onMouseEnter={() => setHighlightedIndex(index)}
                  variant={isSelected ? 'primary' : 'ghost'}
                  textPosition="left"
                  className={`
                    w-full px-4 py-2.5 text-sm
                    flex items-center justify-between gap-2 rounded-none
                    transition-colors duration-150
                    ${isSelected 
                      ? 'font-medium' 
                      : isHighlighted
                        ? `${semantic.bgSubtle} ${semantic.textPrimary}`
                        : `${semantic.textPrimary} hover:${semantic.bgSubtle}`
                    }
                  `}
                  style={{
                    minWidth: menuMinWidth,
                  }}
                  role="option"
                  aria-selected={isSelected}
                  endIcon={
                    isSelected ? (
                      <Check className="w-4 h-4 animate-in zoom-in-50 duration-200 shrink-0" />
                    ) : undefined
                  }
                >
                  <span className="flex-1 min-w-0 overflow-hidden text-ellipsis whitespace-nowrap">{option.label}</span>
                </Button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}