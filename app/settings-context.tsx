import React, { createContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface Settings {
    largeIcons: boolean;
    largeText: boolean;
    highContrast: boolean;
}

interface SettingsContextType {
    settings: Settings;
    saveSettings: (newSettings: Settings) => void;
}

export const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

interface SettingsProviderProps {
    children: ReactNode;
}

export const SettingsProvider: React.FC<SettingsProviderProps> = ({ children }) => {
    const [settings, setSettings] = useState<Settings>({
        largeIcons: false,
        largeText: false,
        highContrast: false,
    });

    useEffect(() => {
        const loadSettings = async () => {
            try {
                const savedSettings = await AsyncStorage.getItem('settings');
                if (savedSettings) {
                    setSettings(JSON.parse(savedSettings));
                }
            } catch (error) {
                console.error('Failed to load settings:', error);
            }
        };
        loadSettings();
    }, []);

    const saveSettings = async (newSettings: Settings) => {
        try {
            setSettings(newSettings);
            await AsyncStorage.setItem('settings', JSON.stringify(newSettings));
        } catch (error) {
            console.error('Failed to save settings:', error);
        }
    };

    return (
        <SettingsContext.Provider value={{ settings, saveSettings }}>
            {children}
        </SettingsContext.Provider>
    );
};
