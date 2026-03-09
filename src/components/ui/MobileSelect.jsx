import React, { useState } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle } from '@/components/ui/drawer';
import { Check, ChevronDown } from 'lucide-react';

function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState(() => window.innerWidth < 640);
  React.useEffect(() => {
    const handler = () => setIsMobile(window.innerWidth < 640);
    window.addEventListener('resize', handler);
    return () => window.removeEventListener('resize', handler);
  }, []);
  return isMobile;
}

/**
 * On mobile: renders a styled button that opens a vaul Drawer bottom sheet.
 * On desktop: renders the standard shadcn Select popover.
 *
 * Props:
 *  value           - current value
 *  onValueChange   - callback(newValue)
 *  options         - [{ value, label }]
 *  placeholder     - string shown when no value selected
 *  className       - applied to SelectTrigger (desktop) and trigger button (mobile)
 */
export default function MobileSelect({ value, onValueChange, options, placeholder, className = '' }) {
  const isMobile = useIsMobile();
  const [open, setOpen] = useState(false);
  const selectedLabel = options.find(o => o.value === value)?.label;

  if (!isMobile) {
    return (
      <Select value={value} onValueChange={onValueChange}>
        <SelectTrigger className={className}>
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          {options.map(o => (
            <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>
          ))}
        </SelectContent>
      </Select>
    );
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className={`flex h-9 w-full items-center justify-between rounded-xl border border-gray-100 bg-gray-50 px-3 py-2 text-sm shadow-sm focus:outline-none ${className}`}
      >
        <span className={selectedLabel ? 'text-gray-900' : 'text-gray-400'}>
          {selectedLabel || placeholder}
        </span>
        <ChevronDown className="h-4 w-4 text-gray-400 shrink-0 ml-2" />
      </button>

      <Drawer open={open} onOpenChange={setOpen}>
        <DrawerContent>
          <DrawerHeader className="pb-2">
            <DrawerTitle className="text-base">{placeholder}</DrawerTitle>
          </DrawerHeader>
          <div
            className="px-4 overflow-y-auto"
            style={{ maxHeight: '55vh', paddingBottom: 'max(1.25rem, env(safe-area-inset-bottom))' }}
          >
            {options.map(o => (
              <button
                key={o.value}
                type="button"
                onClick={() => { onValueChange(o.value); setOpen(false); }}
                className={`w-full flex items-center justify-between px-4 py-3.5 rounded-xl text-sm font-medium transition-colors mb-0.5 ${
                  value === o.value
                    ? 'bg-[#1B4332] text-white'
                    : 'text-gray-700 active:bg-gray-100'
                }`}
              >
                {o.label}
                {value === o.value && <Check className="w-4 h-4 shrink-0" />}
              </button>
            ))}
          </div>
        </DrawerContent>
      </Drawer>
    </>
  );
}