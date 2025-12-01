import React from 'react'
import { vi, describe, it, expect } from 'vitest'
import { screen, render } from '@/test/utils'

// Mock the APIs used by Dashboard
vi.mock('@/api/userApi', () => ({
  fetchProfile: vi.fn(),
  fetchCurrentUser: vi.fn(),
}))

vi.mock('@/api/aqiApi', () => ({
  fetchCurrentAqi: vi.fn(),
  fetchRecommendation: vi.fn(),
  fetchForecast: vi.fn(),
}))

import Dashboard from '@/pages/Dashboard'
import { fetchCurrentAqi } from '@/api/aqiApi'
import { fetchCurrentUser } from '@/api/userApi'

describe('Dashboard', () => {
  it('shows loading while data is being fetched', async () => { // Make async
    const userMock = fetchCurrentUser as unknown as vi.Mock
    const aqiMock = fetchCurrentAqi as unknown as vi.Mock

    // user already available with city Lahore
    userMock.mockResolvedValue({ id: 1, email: 'u@e.com', city: 'Lahore' })

    // make AQI promise unresolved so component stays in loading state for AQI
    aqiMock.mockImplementation(() => new Promise(() => {}))

    render(<Dashboard />)

    // FIX: Use findByText to wait for the user data to load and the text to appear
    expect(await screen.findByText(/Loading data for Lahore/i)).toBeInTheDocument()
  })

  it('displays city and AQI when data is loaded', async () => {
    const userMock = fetchCurrentUser as unknown as vi.Mock
    const aqiMock = fetchCurrentAqi as unknown as vi.Mock

    userMock.mockResolvedValue({ id: 1, email: 'u@e.com', city: 'Lahore' })

    aqiMock.mockResolvedValue({ 
        city: 'Lahore', 
        aqiValue: 150, 
        pm25: 55, 
        pm10: 30, 
        o3: 20, 
        healthAdvice: 'Take care', 
        timestamp: new Date().toISOString() 
    })

    render(<Dashboard />)

    // Wait for City to appear
    expect(await screen.findByText(/Lahore/)).toBeInTheDocument()

    // FIX: "150" appears multiple times. Use findAllByText and check length > 0
    const aqiValues = await screen.findAllByText(/150/)
    expect(aqiValues.length).toBeGreaterThan(0)
  })
})