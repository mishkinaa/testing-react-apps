// mocking Browser APIs and modules
// http://localhost:3000/location

import * as React from 'react'
import {render, screen, act} from '@testing-library/react'
import Location from '../../examples/location'
import {useCurrentPosition} from 'react-use-geolocation'
import {useState} from 'react'

jest.mock('react-use-geolocation')
let setMockState
function useMockCurrentPosition() {
  const state = useState([])
  setMockState = state[1]
  return state[0]
}

beforeEach(() => useCurrentPosition.mockImplementation(useMockCurrentPosition))

test('displays the users current location', () => {
  const fakePosition = { coords : { latitude: 100, longitude: 100}}

  render(<Location/>)
  expect(screen.getByLabelText(/loading/i)).toBeInTheDocument()

  act(() => setMockState([fakePosition]))

  expect(screen.queryByLabelText(/loading/i)).not.toBeInTheDocument()
  expect(screen.getByText(/latitude/i)).toHaveTextContent(
    `Latitude: ${fakePosition.coords.latitude}`,
  )
  expect(screen.getByText(/longitude/i)).toHaveTextContent(
    `Longitude: ${fakePosition.coords.longitude}`,
  )
})

test('displays the error message', () => {
  const fakeError = new Error(
    'Geolocation is not supported or permission denied',
  )
  render(<Location/>)
  expect(screen.getByLabelText(/loading/i)).toBeInTheDocument()

  act(() => setMockState([,fakeError]))

  expect(screen.queryByLabelText(/loading/i)).not.toBeInTheDocument()
  expect(screen.getByRole('alert')).toHaveTextContent(fakeError.message)
})
