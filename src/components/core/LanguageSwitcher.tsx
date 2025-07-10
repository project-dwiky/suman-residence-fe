"use client";

import React from 'react';
import { Button } from "@/components/ui/button";
import { Language } from '@/translations';
import { useRouter } from 'next/navigation';

interface LanguageSwitcherProps {
    currentLanguage: Language;
}

const LanguageSwitcher = ({ currentLanguage }: LanguageSwitcherProps) => {
    const router = useRouter();
    const setLanguage = (language: Language) => {
        // Set cookie
        document.cookie = `language=${language}; path=/; max-age=31536000`; // 1 year
        
        // Reload page to apply changes
        router.refresh();
    };

    return (
        <div className="flex items-center gap-2">
            <Button
                variant={currentLanguage === 'id' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setLanguage('id')}
                className="h-8 px-3"
            >
                ID
            </Button>
            <Button
                variant={currentLanguage === 'en' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setLanguage('en')}
                className="h-8 px-3"
            >
                EN
            </Button>
        </div>
    );
};

export default LanguageSwitcher; 