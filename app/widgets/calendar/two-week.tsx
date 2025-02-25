import React, { createContext, useState, useEffect, ReactNode, useContext } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Define the shape of the settings state
type SettingsState = {
    largeIcons: boolean;
    largeText: boolean;
    highContrast: boolean;
};

// Define the context type
type SettingsContextType = {
    settings: SettingsState;
    saveSettings: (newSettings: SettingsState) => Promise<void>;
};

// Create the context with an initial undefined value
const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

// Define provider props
type SettingsProviderProps = {
    children: ReactNode;
};

export const SettingsProvider: React.FC<SettingsProviderProps> = ({ children }) => {
    const [settings, setSettings] = useState<SettingsState>({
        largeIcons: false,
        largeText: false,
        highContrast: false,
    });

    // Load settings from AsyncStorage
    useEffect(() => {
        const loadSettings = async () => {
            try {
                const savedSettings = await AsyncStorage.getItem('settings');
                if (savedSettings) {
                    setSettings(JSON.parse(savedSettings));
                }
            } catch (error) {
                console.error('Failed to load settings', error);
            }
        };
        loadSettings();
    }, []);

    // Save settings to AsyncStorage
    const saveSettings = async (newSettings: SettingsState) => {
        try {
            setSettings(newSettings);
            await AsyncStorage.setItem('settings', JSON.stringify(newSettings));
        } catch (error) {
            console.error('Failed to save settings', error);
        }
    };

    return (
        <SettingsContext.Provider value={{ settings, saveSettings }}>
            {children}
        </SettingsContext.Provider>
    );
};

// Custom hook for using SettingsContext
export const useSettings = (): SettingsContextType => {
    const context = useContext(SettingsContext);
    if (!context) {
        throw new Error('useSettings must be used within a SettingsProvider');
    }
    return context;
};

export default SettingsContext;
