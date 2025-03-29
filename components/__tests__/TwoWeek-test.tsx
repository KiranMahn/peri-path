import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import TwoWeek from '../../app/widgets/calendar/two-week';
import { SettingsContext } from '../../app/settings-context'; // Import SettingsContext
import { NavigationContainer } from '@react-navigation/native';

jest.mock('@react-navigation/native', () => {
  const actualNav = jest.requireActual('@react-navigation/native');
  return {
    ...actualNav,
    useNavigation: () => ({
      navigate: jest.fn(),
    }),
  };
});

describe('TwoWeek Component', () => {
  const mockNavigation = require('@react-navigation/native').useNavigation();


  const renderComponent = (props: React.JSX.IntrinsicAttributes & { level: any; onTrack: any; selected: any; sliderText?: string; value?: number; onChange?: (value: number) => void; }, settings: { largeText: boolean; highContrast: boolean; largeIcons: boolean}) => {
    return render(
      <SettingsContext.Provider value={{ settings, saveSettings: jest.fn() }}>
        <NavigationContainer>
          <TwoWeek/>
        </NavigationContainer>      
    </SettingsContext.Provider>
    );
  };

  it('renders correctly with default settings', () => {
    const { getByText } = renderComponent(
      { level: 'Medium', onTrack: jest.fn(), selected: false },
      { largeText: false, highContrast: false, largeIcons: false }
    );

    // Check if the header is rendered
    expect(getByText(/to/)).toBeTruthy(); // Date range header (e.g., "Mar 01 to Mar 14")
  });

  it('renders day boxes correctly', () => {
    const { getAllByText } = renderComponent(
      { level: 'Medium', onTrack: jest.fn(), selected: false },
      { largeText: false, highContrast: false, largeIcons: false }
    );

    // Check if all 14 days are rendered
    const dayBoxes = getAllByText('dayBox'); // Assuming each day box has a testID="day-box"
    expect(dayBoxes.length).toBe(14);
  });

  it('applies high contrast styles when enabled', () => {
    const { getByText } = renderComponent(
      { level: 'Medium', onTrack: jest.fn(), selected: false },
      { largeText: false, highContrast: true, largeIcons: false }
    );

    const header = getByText(/to/); // Date range header
    const style = Array.isArray(header.props.style)
      ? Object.assign({}, ...header.props.style) // Flatten the array of styles
      : header.props.style;

    expect(style).toMatchObject({ color: '#fff' }); // High contrast text color
  });

  it('applies large text styles when enabled', () => {
    const { getByText } = renderComponent(
      { level: 'Medium', onTrack: jest.fn(), selected: false },
      { largeText: true, highContrast: false, largeIcons: false }
    );

    const header = getByText(/to/); // Date range header
    const style = Array.isArray(header.props.style)
      ? Object.assign({}, ...header.props.style) // Flatten the array of styles
      : header.props.style;

    expect(style).toMatchObject({ fontSize: 23 }); // Large text font size
  });

    expect(mockNavigation.navigate).toHaveBeenCalledWith('Calendar'); // Ensure navigation is mocked
    const { getAllByText } = renderComponent(
      { level: 'Medium', onTrack: jest.fn(), selected: false },
      { largeText: false, highContrast: false, largeIcons: false }
    );

    const dayBoxes = getAllByText('day-box'); // Assuming each day box has a testID="day-box"

    // Simulate pressing the first day box
    fireEvent.press(dayBoxes[0]);

    expect(mockNavigation.navigate).toHaveBeenCalledWith('Calendar');
  });
