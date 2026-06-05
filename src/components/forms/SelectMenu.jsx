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
          open ? "border-cyan/55 bg-white/[0.105] ring-4 ring-cyan/10" : ""
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
        <ChevronDown className={`shrink-0 text-white/42 transition ${open ? "rotate-180 text-cyan" : ""}`} size={17} />
      </button>

      {open ? (
        <div
          id={menuId}
          className="glass-reflect absolute left-0 right-0 top-[calc(100%+0.55rem)] z-[140] overflow-hidden rounded-lg border border-cyan/30 bg-ink-950/[0.985] p-1.5 shadow-[0_26px_90px_rgba(0,0,0,0.72),0_0_0_1px_rgba(103,232,249,0.12),0_0_34px_rgba(103,232,249,0.16),inset_0_1px_0_rgba(255,255,255,0.12)] backdrop-blur-[32px]"
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
                    ? "border-cyan/25 bg-cyan/15 text-cyan shadow-[inset_0_1px_0_rgba(255,255,255,0.08),0_0_18px_rgba(103,232,249,0.08)]"
                    : "border-transparent text-white/74 hover:border-white/[0.12] hover:bg-white/[0.085] hover:text-white"
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
