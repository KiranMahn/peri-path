import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import MostCommon from '../../app/widgets/track/MostCommon';
import { SettingsContext } from '../../app/settings-context'; // Import SettingsContext

describe('MostCommon Component', () => {
  const mockOnTrack = jest.fn(); // Mock function for onTrack
  const mockSliderValues = {
    anxiety: 2, // Medium
    brainfog: 3, // High
    hotflushes: 1, // Low
    headaches: 2, // Medium
    fatigue: 3, // High
    moodswings: 1, // Low
  };

  const renderComponent = (settings: { largeText: boolean; highContrast: boolean; largeIcons: boolean; }) => {
    return render(
      <SettingsContext.Provider value={{ settings, saveSettings: jest.fn() }}>
        <MostCommon onTrack={mockOnTrack} sliderValues={mockSliderValues} />
      </SettingsContext.Provider>
    );
  };

  it('renders correctly with default settings', () => {
    const { getByText } = renderComponent({
      largeText: false,
      highContrast: false,
      largeIcons: false,
    });

    // Check if all common symptoms are rendered
    expect(getByText('Medium Anxiety')).toBeTruthy();
    expect(getByText('High Brain Fog')).toBeTruthy();
    expect(getByText('Low Hot Flushes')).toBeTruthy();
    expect(getByText('Medium Headaches')).toBeTruthy();
    expect(getByText('High Fatigue')).toBeTruthy();
    expect(getByText('Low Mood Swings')).toBeTruthy();
  });
  
})