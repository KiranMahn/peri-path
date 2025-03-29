import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import PeriodSquare from '../../app/widgets/track/PeriodSquare';
import { SettingsContext } from '../../app/settings-context'; // Import SettingsContext

describe('PeriodSquare Component', () => {
  const mockOnTrack = jest.fn(); // Mock function for onTrack

  const renderComponent = (props: React.JSX.IntrinsicAttributes & { level: any; onTrack: any; selected: any; }, settings: { largeText: boolean; highContrast: boolean; largeIcons: boolean}) => {
    return render(
      <SettingsContext.Provider value={{ settings, saveSettings: jest.fn() }}>
        <PeriodSquare {...props} />
      </SettingsContext.Provider>
    );
  };


  it('renders correctly with default settings', () => {
    const { getByText } = renderComponent(
      { level: 'Light', onTrack: mockOnTrack, selected: false },
      { largeText: false, highContrast: false, largeIcons: false }
    );

    const textElement = getByText('Light');
    expect(textElement).toBeTruthy();
    expect(textElement.props.style).toEqual(
      expect.arrayContaining([{ fontSize: 15, color: '#009668' }])
    );
  });

  it('renders correctly when selected', () => {
    const { getByText } = renderComponent(
      { level: 'Medium', onTrack: mockOnTrack, selected: true },
      { largeText: false, highContrast: false, largeIcons: false }
    );

    const textElement = getByText('Medium');
    expect(textElement).toBeTruthy();
    expect(textElement.props.style).toEqual(
      expect.arrayContaining([{ color: 'white' }])
    );
  });

  it('calls onTrack when pressed', () => {
    const { getByText } = renderComponent(
      { level: 'Light', onTrack: mockOnTrack, selected: false },
      { largeText: false, highContrast: false, largeIcons: false }
    );

    const button = getByText('Light');
    fireEvent.press(button);

    expect(mockOnTrack).toHaveBeenCalledWith('Light');
  });
});