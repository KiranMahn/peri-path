import React from 'react';
import { render } from '@testing-library/react-native';
import Analysis from '../../app/(tabs)/analysis'; // Update with the correct path
import { NavigationContainer } from '@react-navigation/native';
import { SettingsContext } from '../../app/settings-context';

jest.mock('@react-navigation/native', () => ({
    useNavigation: () => ({
        navigate: jest.fn(),
    }),
}));

describe('Analysis Component', () => {
    it('renders correctly with default settings', () => {
        const mockSettings = { highContrast: false, largeText: false, largeIcons: false };
        
        const { getByTestId } = render(
            <SettingsContext.Provider value={{ settings: mockSettings, saveSettings: jest.fn() }}>
                {/* <NavigationContainer> */}
                    <Analysis />
                {/* </NavigationContainer> */}
            </SettingsContext.Provider>
        );

        expect(getByTestId('analysis-container')).toBeTruthy();
    });
});
