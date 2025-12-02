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

    // Use role for email to be precise
    expect(screen.getByRole('textbox', { name: /email/i })).toBeInTheDocument()
    
    // FIX: Add { selector: 'input' } to ignore the "Show password" button
    expect(screen.getByLabelText(/password/i, { selector: 'input' })).toBeInTheDocument()
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

    const emailInput = screen.getByRole('textbox', { name: /email/i })
    
    // FIX: Specific selector here too
    const passwordInput = screen.getByLabelText(/password/i, { selector: 'input' })
    
    const submitBtn = screen.getByRole('button', { name: /sign in/i })

    await user.type(emailInput, 'user@example.com')
    await user.type(passwordInput, 'password123')
    await user.click(submitBtn)

    expect(mockedLogin).toHaveBeenCalledWith({ email: 'user@example.com', password: 'password123' })

    expect(await screen.findByText('Dashboard Page')).toBeInTheDocument()
  })
})