import { Check, ChevronDown } from "lucide-react";
import { useEffect, useId, useRef, useState } from "react";

export default function SelectMenu({ value, onChange, options = [], icon: Icon, label = "Select option", className = "" }) {
  const [open, setOpen] = useState(false);
  const menuId = useId();
  const rootRef = useRef(null);
  const selectedIndex = Math.max(0, options.findIndex((option) => option === value));
  const selectedOptionId = `${menuId}-${selectedIndex}`;

  useEffect(() => {
    function handleClick(event) {
      if (!rootRef.current?.contains(event.target)) {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  function selectOption(option) {
    onChange(option);
    setOpen(false);
  }

  function moveSelection(delta) {
    if (!options.length) return;
    const nextIndex = (selectedIndex + delta + options.length) % options.length;
    onChange(options[nextIndex]);
    setOpen(true);
  }

  function handleKeyDown(event) {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      setOpen((current) => !current);
    }

    if (event.key === "ArrowDown") {
      event.preventDefault();
      moveSelection(1);
    }

    if (event.key === "ArrowUp") {
      event.preventDefault();
      moveSelection(-1);
    }

    if (event.key === "Escape") {
      setOpen(false);
    }
  }

  return (
    <div className={`relative z-[90] min-w-0 ${className}`} ref={rootRef}>
      <button
        type="button"
        className={`input flex items-center justify-between gap-3 text-left ${
          open ? "border-white/[0.14] bg-white/[0.025]" : ""
        } ${Icon ? "pl-10" : ""}`}
        aria-controls={menuId}
        aria-expanded={open}
        aria-haspopup="listbox"
        aria-label={label}
        aria-activedescendant={open ? selectedOptionId : undefined}
        role="combobox"
        onClick={() => setOpen((current) => !current)}
        onKeyDown={handleKeyDown}
      >
        {Icon ? <Icon className="pointer-events-none absolute left-3 top-3.5 text-white/35" size={18} /> : null}
        <span className="min-w-0 truncate">{value}</span>
        <ChevronDown className={`shrink-0 text-white/42 transition ${open ? "rotate-180 text-white" : ""}`} size={17} />
      </button>

      {open ? (
        <div
          id={menuId}
          className="absolute left-0 right-0 top-[calc(100%+0.55rem)] z-[140] overflow-hidden rounded-xl border border-line bg-ink-800 p-1.5"
          role="listbox"
          aria-label={`${label} options`}
        >
          {options.map((option, index) => {
            const selected = option === value;
            return (
              <button
                type="button"
                id={`${menuId}-${index}`}
                className={`flex w-full items-center justify-between gap-3 rounded-md border px-3 py-2.5 text-left text-sm transition duration-150 ${
                  selected
                    ? "border-white/[0.08] bg-white/[0.035] text-white"
                    : "border-transparent text-white/68 hover:border-white/[0.08] hover:bg-white/[0.025] hover:text-white"
                }`}
                key={option}
                role="option"
                aria-selected={selected}
                onClick={() => selectOption(option)}
              >
                <span className="min-w-0 truncate">{option}</span>
                {selected ? <Check size={15} /> : null}
              </button>
            );
          })}
        </div>
      ) : null}
    </div>
  );
}
