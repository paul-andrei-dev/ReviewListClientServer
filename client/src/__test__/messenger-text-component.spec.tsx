import '@testing-library/jest-dom';
import { render } from '@testing-library/react';
import { EMPTY_STATE } from '../constants.ts';
import { ReviewCard } from '../components/review-card.tsx';

describe('ReviewCard', () => {
  it('renders with only required props', () => {
    const { getByText } = render(<ReviewCard name="John Doe" />);
    expect(getByText('John Doe')).toBeInTheDocument();
    expect(getByText(EMPTY_STATE)).toBeInTheDocument();
  });

  it('displays all provided props correctly', () => {
    const props = {
      name: 'Jane Doe',
      description: 'Great product!',
      date: 1609459200000, // Equivalent to January 1, 2021
      timezone: 'UTC',
      rating: 5,
    };
    const { getByText } = render(<ReviewCard {...props} />);
    expect(getByText('Jane Doe')).toBeInTheDocument();
    expect(getByText('Great product!')).toBeInTheDocument();
    expect(getByText('Timezone: UTC')).toBeInTheDocument();
    expect(getByText('(5)')).toBeInTheDocument();
  });

  it('displays EMPTY_STATE when optional props are missing', () => {
    const { getByText } = render(<ReviewCard name="Jane Doe" />);
    expect(getByText(EMPTY_STATE)).toBeInTheDocument();
    expect(getByText('Date: ' + EMPTY_STATE)).toBeInTheDocument();
    expect(getByText('Timezone: ' + EMPTY_STATE)).toBeInTheDocument();
    expect(getByText('(' + EMPTY_STATE + ')')).toBeInTheDocument();
  });
});
