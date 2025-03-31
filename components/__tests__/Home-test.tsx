import React from 'react';
import { render, fireEvent, waitFor, act } from '@testing-library/react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Home from '../../app/(tabs)/home';
import { SettingsContext } from '../../app/settings-context';

jest.mock('@react-native-async-storage/async-storage', () => ({
    getItem: jest.fn(),
    setItem: jest.fn(),
}));

jest.mock('../../app/widgets/calendar/two-week', () => () => <></>);
jest.mock('../../app/widgets/analysis/last-period', () => () => <></>);
jest.mock('../../app/widgets/analysis/most-common-symptom', () => () => <></>);
jest.mock('../../app/widgets/analysis/symptom-chart', () => () => <></>);
jest.mock('../../app/widgets/analysis/period-chart', () => () => <></>);
jest.mock('../../app/widgets/nav', () => () => <></>);

describe('Home Component', () => {

    const renderComponent = (settings: { largeText: boolean; highContrast: boolean; largeIcons: boolean; }) => {
        return render(
          <SettingsContext.Provider value={{ settings, saveSettings: jest.fn() }}>
            <Home />
          </SettingsContext.Provider>
        );
      };
    

    it('renders correctly', async () => {
        const { getByText } = await renderComponent({
            largeText: false,
            highContrast: false,
            largeIcons: false,
        });
        expect(getByText('Symptoms')).toBeTruthy();
        expect(getByText('Period')).toBeTruthy();
    });

    
});
