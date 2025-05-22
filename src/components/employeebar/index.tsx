'use client';
import React, { useEffect, useState } from 'react';
import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useThemeMode } from '@/hooks/settings/use-settings';

const EmployeeBar = () => {
  const [mounted, setMounted] = useState(false);
  const { setTheme, theme } = useThemeMode();

  useEffect(() => {
    setMounted(true);
  }, []);

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  if (!mounted) {
    // Render a placeholder during SSR that matches the button's dimensions
    return (
      <div className="flex w-full justify-between items-center py-1 mb-8">
        <div className="flex gap-3 items-center mb-13">
          <Button 
            variant="outline" 
            size="icon"
            aria-label="Toggle theme"
            disabled
          >
            <div className="h-[1.2rem] w-[1.2rem]" />
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex w-full justify-between items-center py-1 mb-8">
      <div className="flex gap-3 items-center mb-13">
        <Button 
          variant="outline" 
          size="icon"
          onClick={toggleTheme}
          aria-label="Toggle theme"
        >
          {theme === 'dark' ? (
            <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all" />
          ) : (
            <Moon className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all" />
          )}
        </Button>
      </div>
    </div>
  );
};

export default EmployeeBar;