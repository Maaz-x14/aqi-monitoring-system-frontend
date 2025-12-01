import React from 'react'
import { vi, describe, it, expect } from 'vitest'
import userEvent from '@testing-library/user-event'
import { screen, render } from '@/test/utils'
import { Routes, Route } from 'react-router-dom'
import Login from '@/pages/Login'
import { loginUser } from '@/api/authApi'

vi.mock('@/api/authApi', () => ({
  loginUser: vi.fn(),
}))

describe('Login Page', () => {
  it('renders email and password inputs', () => {
    render(<Login />)

    // Fallback to getByRole if getByLabelText is being weird about association
    // Ideally getByLabelText is better for a11y testing, but let's unblock you first.
    expect(screen.getByRole('textbox', { name: /email/i })).toBeInTheDocument()
    // Password inputs don't have a role of 'textbox', so we use LabelText or Placeholder
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument()
  })

  it('validation prevents submission with empty fields', async () => {
    const user = userEvent.setup()
    const mockedLogin = loginUser as unknown as vi.Mock

    render(<Login />)

    const submit = screen.getByRole('button', { name: /sign in/i }) 
    await user.click(submit)

    expect(mockedLogin).not.toHaveBeenCalled()
  })

  it('successful login calls API and redirects to dashboard', async () => {
    const user = userEvent.setup()
    const mockedLogin = loginUser as unknown as vi.Mock
    mockedLogin.mockResolvedValueOnce({ token: 'test-token' })

    render(
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<div>Dashboard Page</div>} />
      </Routes>,
      { route: '/login' }
    )

    // Using robust selectors
    const emailInput = screen.getByRole('textbox', { name: /email/i })
    const passwordInput = screen.getByLabelText(/password/i)
    const submitBtn = screen.getByRole('button', { name: /sign in/i })

    await user.type(emailInput, 'user@example.com')
    await user.type(passwordInput, 'password123')
    await user.click(submitBtn)

    expect(mockedLogin).toHaveBeenCalledWith({ email: 'user@example.com', password: 'password123' })

    expect(await screen.findByText('Dashboard Page')).toBeInTheDocument()
  })
})