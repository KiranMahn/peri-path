import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import Track from '../../app/(tabs)/track';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SettingsContext } from '../../app/settings-context';
import { NavigationContainer } from '@react-navigation/native';

jest.mock('@react-native-async-storage/async-storage', () => ({
    setItem: jest.fn(),
    getItem: jest.fn(() => Promise.resolve(null)),
}));

jest.mock('@react-navigation/native', () => ({
    useNavigation: jest.fn(() => ({ navigate: jest.fn() })),
}));

describe('Track Component', () => {
    const mockSettings = { highContrast: false, largeText: false, largeIcons: false };

    it('renders correctly', () => {
        const { getByText } = render(
            <SettingsContext.Provider value={{ settings: mockSettings, saveSettings: jest.fn() }}>
                    <Track route={{ params: { date: new Date().toISOString() } }} />
            </SettingsContext.Provider>
        );

        expect(getByText('Period')).toBeTruthy();
        expect(getByText('Quick Add')).toBeTruthy();
        expect(getByText('Symptoms')).toBeTruthy();
    });

    it('updates selected period state when a period button is pressed', () => {
        const { getByText } = render(
            <SettingsContext.Provider value={{ settings: mockSettings, saveSettings: jest.fn() }}>
                <Track route={{ params: { date: new Date().toISOString() } }} />
            </SettingsContext.Provider>
        );

        const lightPeriodButton = getByText('Light');
        fireEvent.press(lightPeriodButton);
        
        expect(lightPeriodButton).toBeTruthy();
    });

    it('saves data when the save button is pressed', async () => {

        const { getByText } = render(
            <SettingsContext.Provider value={{ settings: mockSettings, saveSettings: jest.fn() }}>
                    <Track route={{ params: { date: new Date().toISOString() } }} />
            </SettingsContext.Provider>
        );

        fireEvent.press(getByText('Save'));

        await waitFor(() => {
            expect(AsyncStorage.setItem).toHaveBeenCalled();
        });
    });
});
