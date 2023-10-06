// mocking HTTP requests
// http://localhost:3000/login-submission

import * as React from 'react'
import {render, screen, waitForElementToBeRemoved} from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import {build, fake} from '@jackfranklin/test-data-bot'
import Login from '../../components/login-submission'
import {setupServer} from 'msw/node'
import {handlers} from '../../test/server-handlers'
import {rest} from 'msw'

const buildLoginForm = build({
  fields: {
    username: fake(f => f.internet.userName()),
    password: fake(f => f.internet.password()),
  },
})

const server = setupServer(...handlers)

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers())
afterAll(() => server.close());

test(`logging in displays the user's username`, async () => {
  render(<Login />)
  const {username, password} = buildLoginForm()

  await userEvent.type(screen.getByLabelText(/username/i), username)
  await userEvent.type(screen.getByLabelText(/password/i), password)
  await userEvent.click(screen.getByRole('button', {  name: /submit/i}))

  await waitForElementToBeRemoved(screen.getByLabelText(/loading/i))

  expect(screen.getByText(/welcome/i)).toHaveTextContent(username)
  expect(screen.getByText(username)).toBeInTheDocument()
})

test(`error message displays if user doesn't enter password`, async () => {
  render(<Login />)
  const {username} = buildLoginForm()

  await userEvent.type(screen.getByLabelText(/username/i), username)
  // skip type in the password
  await userEvent.click(screen.getByRole('button', {  name: /submit/i}))

  await waitForElementToBeRemoved(screen.getByLabelText(/loading/i))

  expect(screen.getByRole('alert').textContent).toMatchInlineSnapshot(
    `"password required"`,
  )
})

test(`error message displays if server sent 500`, async () => {
  const serverErrorMsg = 'sorry, I\'m down :('
  server.use(
    rest.post(
      'https://auth-provider.example.com/api/login',
      async (req, res, ctx) => {
        return res(
          ctx.status(500),
          ctx.json({message: serverErrorMsg}))
      },
    ),
  )

  render(<Login />)
  await userEvent.click(screen.getByRole('button', {  name: /submit/i}))

  await waitForElementToBeRemoved(screen.getByLabelText(/loading/i))

  expect(screen.getByRole('alert')).toHaveTextContent(serverErrorMsg)
})
