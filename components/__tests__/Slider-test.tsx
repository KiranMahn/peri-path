import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import Slider from '../../app/widgets/track/Slider';
import { SettingsContext } from '../../app/settings-context'; // Import SettingsContext and its type

describe('Slider Component', () => {
  const mockOnChange = jest.fn(); // Mock function for onChange

    const renderComponent = (props: React.JSX.IntrinsicAttributes & { level: any; onTrack: any; selected: any; sliderText?: string; value?: number; onChange?: (value: number) => void; }, settings: { largeText: boolean; highContrast: boolean; largeIcons: boolean}) => {
    return render(
      <SettingsContext.Provider value={{ settings, saveSettings: jest.fn() }}>
        <Slider sliderText={undefined} onChange={undefined} value={undefined} {...props} />
      </SettingsContext.Provider>
    );
  };

  it('renders correctly with default settings', () => {
    const { getByText } = renderComponent(
      {
          sliderText: 'Test Slider', onChange: mockOnChange, value: 50,
          level: undefined,
          onTrack: undefined,
          selected: undefined
      },
      {
          largeText: false, highContrast: false,
          largeIcons: false
      }
    );

    const sliderText = getByText('Test Slider');
    expect(sliderText).toBeTruthy();
  });

  it('renders correctly with large text enabled', () => {
    const { getByText } = renderComponent(
      {
        sliderText: 'Test Slider',
        onChange: mockOnChange,
        value: 50,
        level: undefined,
        onTrack: undefined,
        selected: undefined,
      },
      {
        largeText: true,
        highContrast: false,
        largeIcons: false,
      }
    );
  
    const sliderText = getByText('Test Slider');
    const style = Array.isArray(sliderText.props.style)
      ? Object.assign({}, ...sliderText.props.style) // Flatten the array of styles
      : sliderText.props.style;
  
    expect(style).toMatchObject({ fontSize: 17 }); // Check for the specific style property
  });

  it('renders correctly with high contrast mode enabled', () => {
    const { getByText } = renderComponent(
      {
        sliderText: 'Test Slider',
        onChange: mockOnChange,
        value: 50,
        level: undefined,
        onTrack: undefined,
        selected: undefined,
      },
      {
        largeText: false,
        highContrast: true,
        largeIcons: false,
      }
    );
  
    const sliderText = getByText('Test Slider');
    const style = Array.isArray(sliderText.props.style)
      ? Object.assign({}, ...sliderText.props.style) // Flatten the array of styles
      : sliderText.props.style;
  
    expect(style).toMatchObject({ color: 'white' }); // Check for the specific style property
  });

  it('calls onChange when slider value changes', () => {
    const { getByTestId } = renderComponent(
      {
          sliderText: 'Test Slider', onChange: mockOnChange, value: 50,
          level: undefined,
          onTrack: undefined,
          selected: undefined
      },
      {
          largeText: false, highContrast: false,
          largeIcons: false
      }
    );

    const slider = getByTestId('slider'); // Assuming the slider has a testID="slider"
    fireEvent(slider, 'valueChange', 75); // Simulate slider value change

    expect(mockOnChange).toHaveBeenCalledWith(75);
  });

  it('renders correctly with a specific value', () => {
    const { getByTestId } = renderComponent(
      {
          sliderText: 'Test Slider', onChange: mockOnChange, value: 2,
          level: undefined,
          onTrack: undefined,
          selected: undefined
      },
      {
          largeText: false, highContrast: false,
          largeIcons: false
      }
    );

    const slider = getByTestId('slider');
    expect(slider.props.value).toBe(2);
  });
});