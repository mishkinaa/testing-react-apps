// simple test with ReactDOM
// http://localhost:3000/counter

import * as React from 'react'
import {act} from 'react-dom/test-utils'
import {createRoot} from 'react-dom/client'
import Counter from '../../components/counter'

// NOTE: this is a new requirement in React 18
// https://react.dev/blog/2022/03/08/react-18-upgrade-guide#configuring-your-testing-environment
// Luckily, it's handled for you by React Testing Library :)
global.IS_REACT_ACT_ENVIRONMENT = true

beforeEach(() => {
  document.body.innerHTML = ''
})

test('counter increments and decrements when the buttons are clicked', () => {
  const container = document.createElement('div');
  document.body.append(container);

  const root = createRoot(container);
  act(() => root.render(<Counter/>));

  const [decrementBtn, incrementBtn] = container.querySelectorAll('button');
  const messageDiv = container.firstChild.querySelector('div');
  const click = new MouseEvent('click', {
    bubbles: true,
    cancelable: true,
    button: 0 //left button
  });

  expect(messageDiv.textContent).toBe('Current count: 0');
  act(() => incrementBtn.dispatchEvent(click));
  expect(messageDiv.textContent).toBe('Current count: 1');
  act(() => decrementBtn.dispatchEvent(click));
  expect(messageDiv.textContent).toBe('Current count: 0');
})
