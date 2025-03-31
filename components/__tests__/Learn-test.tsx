import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import Learn from '../../app/(tabs)/learn';
import { SettingsContext } from '../../app/settings-context';
import articles from '../../articles.json';
import { Linking } from 'react-native';

jest.mock('react-native/Libraries/Linking/Linking', () => ({
  openURL: jest.fn(),
}));
jest.mock('@react-navigation/native', () => ({
    useNavigation: jest.fn(() => ({ navigate: jest.fn() })),
}));
type Article = {
    Title: string;
    Author: string;
    Date: string;
    URL: string;
    keywords: string[];
};

describe('Learn Component', () => {
  const mockSettings = {
    highContrast: false,
    largeText: false,
    largeIcons: false,
  };

  const renderComponent = (settings = mockSettings) => {
    return render(
      <SettingsContext.Provider value={{ settings, saveSettings: jest.fn() }}>
        <Learn />
      </SettingsContext.Provider>
    );
  };

  test('renders correctly', () => {
    const { getByText } = renderComponent();
    expect(getByText('For You')).toBeTruthy();
    expect(getByText('Recent')).toBeTruthy();
    expect(getByText('Symptom Relief')).toBeTruthy();
    expect(getByText('All Articles')).toBeTruthy();
  });

  test('switches tabs when a tab is pressed', () => {
    const { getByText } = renderComponent();
    fireEvent.press(getByText('Recent'));
    expect(getByText('Recent').props.style.fontWeight).toBe('bolder');
  });

  test('displays articles based on selected tab', () => {
    const { getByText } = renderComponent();
    fireEvent.press(getByText('Symptom Relief'));
    const filteredArticles = (Object.values(articles) as Article[]).filter(article => article.keywords.includes('symptoms'));
    expect(getByText(filteredArticles[0].Title)).toBeTruthy();
  });

  test('opens article URL when an article is pressed', () => {
    const { getByText } = renderComponent();
    const firstArticle = (Object.values(articles) as Article[])[0];
    fireEvent.press(getByText(firstArticle.Title));
    expect(Linking.openURL).toHaveBeenCalledWith(firstArticle.URL);
  });
});