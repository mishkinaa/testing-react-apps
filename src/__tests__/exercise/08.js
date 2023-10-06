// testing custom hooks
// http://localhost:3000/counter-hook

import * as React from 'react'
import {act, renderHook} from '@testing-library/react'
import useCounter from '../../components/use-counter'

test('exposes the count and increment/decrement functions', () => {
  const {result} = renderHook(() => useCounter())

  expect(result.current.count).toEqual(0)
  act(() => result.current.increment())
  expect(result.current.count).toEqual(1)
  act(() => result.current.decrement())
  expect(result.current.count).toEqual(0)
})

test('allows customization of the initial count', () => {
  const initialCount = 10
  const {result} = renderHook(useCounter, {initialProps: {initialCount}})

  expect(result.current.count).toEqual(initialCount)
})

test('allows customization of the step', () => {
  const step = 5
  const {result} = renderHook(useCounter, {initialProps: {step}})

  expect(result.current.count).toEqual(0)
  act(() => result.current.increment())
  expect(result.current.count).toEqual(step)
  act(() => result.current.decrement())
  expect(result.current.count).toEqual(0)
})
