import React from 'react';
import renderer from 'react-test-renderer';
import TabButton from '../../app/widgets/TabButton';

test('renders correctly', () => {
  const tree = renderer.create(<TabButton text={undefined} isSelected={undefined} />).toJSON();
  expect(tree).toMatchSnapshot();
});