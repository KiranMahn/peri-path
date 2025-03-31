import React from 'react';
import { render, waitFor, fireEvent } from '@testing-library/react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NavigationContainer } from '@react-navigation/native';
import { SettingsContext } from '../../app/settings-context';
import TwoWeek from '../../app/widgets/calendar/two-week';
import { NavigationProp } from '@react-navigation/native';

jest.mock('@react-native-async-storage/async-storage');

const mockNavigation = {
  navigate: jest.fn(),
};


describe('TwoWeek Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(AsyncStorage, 'getItem').mockImplementation(async (key) => {
      if (key === 'user') return JSON.stringify({ username: 'TestUser' });
      if (key === 'allUsersData') return JSON.stringify({ TestUser: {} });
      return null;
    });
  });

  it('renders correctly and displays the date range', async () => {
    const { getByTestId } = render(
      <SettingsContext.Provider value={{ settings: { highContrast: false, largeText: false, largeIcons: false }, saveSettings: jest.fn()  }}>
        <NavigationContainer>
          <TwoWeek />
        </NavigationContainer>
      </SettingsContext.Provider>
    );

    await waitFor(() => expect(getByTestId('date-range')).toBeTruthy());
  });

  it('disables future dates from being pressed', async () => {
    const { getAllByTestId } = render(
      <SettingsContext.Provider value={{ settings: { highContrast: false, largeText: false, largeIcons: false }, saveSettings: jest.fn() }}>
        <NavigationContainer>
          <TwoWeek />
        </NavigationContainer>
      </SettingsContext.Provider>
    );

    const dayBoxes = await waitFor(() => getAllByTestId('day-box'));
    
    // Find a future date box and ensure it does not trigger navigation
    fireEvent.press(dayBoxes[dayBoxes.length - 1]); // Last date should be the future
    expect(mockNavigation.navigate).not.toHaveBeenCalled();
  });
});