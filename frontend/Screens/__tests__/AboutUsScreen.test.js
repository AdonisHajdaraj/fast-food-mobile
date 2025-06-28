import React from 'react';
import { render } from '@testing-library/react-native';
import AboutUsScreen from '../user/AboutUs';

test('renders About Us text', () => {
  const { getByText } = render(<AboutUsScreen />);
  expect(getByText('About Us')).toBeTruthy();
});
