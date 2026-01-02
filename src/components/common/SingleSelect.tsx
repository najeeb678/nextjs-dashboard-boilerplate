import { useState, useEffect, useRef } from "react";
import { useTheme } from "@/components/ui/ThemeProvider";
import { getToken } from "@/lib/theme";

interface SingleSelectProps {
  options: { id: string | number; label: string; value: string | number }[];
  selectedValue: string | number | null;
  onChange: (value: string | number | null) => void;
  placeholder?: string;
  label?: string;
  required?: boolean;
  emptyMessage?: string;
  searchable?: boolean;
}

export default function SingleSelect({
  options,
  selectedValue,
  onChange,
  placeholder = "Select option",
  label,
  required = false,
  emptyMessage = "No data available",
  searchable,
}: SingleSelectProps) {
  const { theme } = useTheme();
  const t = (key: keyof typeof import("@/data/vibebrux-color-tokens.json").lightMode.mode1) =>
    getToken(theme, key);

  const labelColor = t("colorsHeadingsSubtext");
  const inputBg = t("colorsInputFieldBackground");
  const inputBorder = t("colorsInputFieldsStroke");
  const textColor = t("colorsInputFieldText");
  const errorColor = t("colorsRedStroke");

  const effectiveSearchable = searchable !== undefined ? searchable : options.length > 6;
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const selectedOption = options.find((option) => option.value === selectedValue);

  // Material UI approach: Show all options but sort matching ones to top
  const getSortedOptions = () => {
    if (!searchable || !inputValue) {
      return options;
    }

    const searchTerm = inputValue.toLowerCase();
    const matched = options.filter((option) => option.label.toLowerCase().includes(searchTerm));
    const unmatched = options.filter((option) => !option.label.toLowerCase().includes(searchTerm));

    return [...matched, ...unmatched];
  };

  const allFilteredOptions = getSortedOptions();

  // Update input value when selected option changes
  useEffect(() => {
    if (selectedOption) {
      setInputValue(selectedOption.label);
    } else {
      setInputValue("");
    }
  }, [selectedOption]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (isOpen && !(event.target as Element).closest(".single-select-container")) {
        setIsOpen(false);
        // Reset input to selected value if no valid selection
        if (selectedOption) {
          setInputValue(selectedOption.label);
        } else {
          setInputValue("");
        }
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen, selectedOption]);

  // Handle input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInputValue(value);
    if (!isOpen && effectiveSearchable) {
      setIsOpen(true);
    }
  };

  // Handle input focus
  const handleInputFocus = () => {
    if (effectiveSearchable) {
      setIsOpen(true);
    }
  };

  // Handle option selection
  const handleSelect = (value: string | number) => {
    onChange(value);
    setIsOpen(false);
  };

  // Handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      setIsOpen(false);
      if (selectedOption) {
        setInputValue(selectedOption.label);
      } else {
        setInputValue("");
      }
    } else if (e.key === "Enter" && allFilteredOptions.length === 1) {
      // Auto-select if only one option matches
      handleSelect(allFilteredOptions[0].value);
    } else if (e.key === "ArrowDown" && !isOpen) {
      setIsOpen(true);
    }
  };

  // Handle toggle button click
  const handleToggle = () => {
    setIsOpen(!isOpen);
    if (!isOpen && searchable) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 0);
    }
  };

  return (
    <div className="relative single-select-container">
      {label && (
        <label className="block text-sm mb-1" style={{ color: labelColor }}>
          {label} {required && <span style={{ color: errorColor }}>*</span>}
        </label>
      )}
      <div className="mt-1 relative">
        <div
          className={`w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 flex items-center transition-colors cursor-pointer ${
            isOpen ? "ring-2 ring-blue-500" : ""
          }`}
          style={{
            backgroundColor: inputBg,
            borderColor: inputBorder,
            color: textColor,
          }}
          onClick={() => {
            if (!isOpen) {
              setIsOpen(true);
              if (effectiveSearchable) {
                setTimeout(() => inputRef.current?.focus(), 0);
              }
            }
          }}
        >
          <input
            ref={inputRef}
            type="text"
            className="flex-1 h-full bg-transparent font-normal text-[16px] leading-normal focus:outline-none placeholder:text-gray-400 border-none"
            style={{ color: textColor }}
            placeholder={placeholder}
            value={inputValue}
            onChange={handleInputChange}
            onFocus={handleInputFocus}
            onKeyDown={handleKeyDown}
            readOnly={!effectiveSearchable}
          />
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              handleToggle();
            }}
            className="px-3 py-[2.5px] flex items-center justify-center hover:bg-gray-50 rounded-r-lg"
          >
            <svg
              className={`h-5 w-5 text-gray-400 transform transition-transform ${
                isOpen ? "rotate-180" : ""
              }`}
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        </div>

        {isOpen && (
          <div
            className="absolute z-50 mt-1 w-full shadow-lg max-h-60 rounded-lg py-1 text-base overflow-auto focus:outline-none custom-scrollbar"
            style={{
              backgroundColor: inputBg,
              borderColor: inputBorder,
              color: textColor,
            }}
          >
            {allFilteredOptions.length === 0 ? (
              <div className="px-4 py-3 text-sm text-center" style={{ color: textColor }}>
                {inputValue && searchable ? "No matching options" : emptyMessage}
              </div>
            ) : (
              allFilteredOptions.map((option) => (
                <div
                  key={option.id}
                  className={`cursor-pointer select-none relative py-2.5 px-4 transition-colors ${
                    selectedValue === option.value
                      ? "bg-gradient-to-r from-[#8B5CF6] to-[#3B82F6] text-white"
                      : "hover:bg-[#08091b]"
                  }`}
                  style={{
                    color: selectedValue === option.value ? "white" : textColor,
                  }}
                  onMouseDown={(e) => {
                    e.preventDefault();
                    handleSelect(option.value);
                  }}
                >
                  <span
                    className={`block truncate text-sm ${
                      selectedValue === option.value ? "font-medium" : "font-normal"
                    }`}
                  >
                    {option.label}
                  </span>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}
