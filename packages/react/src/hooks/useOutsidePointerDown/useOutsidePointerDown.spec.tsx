import { describe, it, expect, vi } from 'vitest';
import { screen } from '@testing-library/react';
import { useOutsidePointerDown } from '.';
import { renderSetup } from '../../utils/test/renderSetup';

const TestComponent = ({ onAction }: { onAction: () => void }) => {
  const targetRef = useOutsidePointerDown<HTMLDivElement>(onAction);

  return (
    <div role="outside-box">
      outside
      <div ref={targetRef} role="inner-box">
        inner
      </div>
    </div>
  );
};

describe('useOutsidePointerDown', () => {
  it('should call the callback function when clicking on an element outside of the target element', async () => {
    const mockFn = vi.fn();
    const { user } = renderSetup(<TestComponent onAction={mockFn} />);

    const outsideBox = screen.getByRole('outside-box');
    const innerBox = screen.getByRole('inner-box');

    await user.click(innerBox);
    expect(mockFn).toBeCalledTimes(0);

    await user.click(outsideBox);
    expect(mockFn).toBeCalledTimes(1);

    await user.click(innerBox);
    expect(mockFn).toBeCalledTimes(1);
  });
});
