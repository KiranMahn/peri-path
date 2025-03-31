import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import Calendar from '../../app/(tabs)/calendar';
import { SettingsContext } from '../../app/settings-context';
import { NavigationContainer } from '@react-navigation/native';

const mockSettings = {
  highContrast: false,
  largeText: false,
  largeIcons: false,
};

describe('Calendar Component', () => {
  it('renders correctly', async () => {
    const { getByText } = render(
      <SettingsContext.Provider value={{ settings: mockSettings, saveSettings: jest.fn() }}>
        <NavigationContainer>
          <Calendar />
        </NavigationContainer>
      </SettingsContext.Provider>
    );

    const currentMonthYear = new Date();
    const expectedText = `${currentMonthYear.getMonth() + 1}/${currentMonthYear.getFullYear()}`;

    // Wait for the component to render and check the expected text
    await waitFor(() => expect(getByText(expectedText)).toBeTruthy());
  });

  it('navigates to the previous month when left button is pressed', async () => {
    const { getByText } = render(
      <SettingsContext.Provider value={{ settings: mockSettings, saveSettings: jest.fn() }}>
        <NavigationContainer>
          <Calendar />
        </NavigationContainer>
      </SettingsContext.Provider>
    );

    const leftButton = getByText('<');
    fireEvent.press(leftButton);

    const newDate = new Date();
    newDate.setMonth(newDate.getMonth() - 1);
    const expectedText = `${newDate.getMonth()}/${newDate.getFullYear()}`;

    // Wait for the state update and check the expected text
    await waitFor(() => expect(getByText(expectedText)).toBeTruthy());
  });

  it('navigates to the next month when right button is pressed', async () => {
    const { getByText } = render(
      <SettingsContext.Provider value={{ settings: mockSettings, saveSettings: jest.fn() }}>
        <NavigationContainer>
          <Calendar />
        </NavigationContainer>
      </SettingsContext.Provider>
    );

    const rightButton = getByText('>');
    fireEvent.press(rightButton);

    const newDate = new Date();
    newDate.setMonth(newDate.getMonth() + 1);
    const expectedText = `${newDate.getMonth()}/${newDate.getFullYear()}`;

    // Wait for the state update and check the expected text
    await waitFor(() => expect(getByText(expectedText)).toBeTruthy());
  });
});