import '@testing-library/jest-dom'
import { vi } from 'vitest'

// Mock GSAP
vi.mock('gsap', () => ({
  gsap: {
    set: vi.fn(),
    to: vi.fn(),
    from: vi.fn(),
    fromTo: vi.fn(),
    timeline: vi.fn(() => ({
      to: vi.fn(),
      from: vi.fn(),
      set: vi.fn(),
      play: vi.fn(),
      pause: vi.fn(),
      reverse: vi.fn(),
    })),
  },
}))

// Mock @dfinity modules
vi.mock('@dfinity/agent', () => ({
  HttpAgent: vi.fn(),
  Actor: {
    createActor: vi.fn(),
  },
}))

vi.mock('@dfinity/auth-client', () => ({
  AuthClient: {
    create: vi.fn(),
  },
}))

vi.mock('@dfinity/principal', () => ({
  Principal: {
    fromText: vi.fn(),
    anonymous: vi.fn(),
  },
}))

// Mock environment variables
Object.defineProperty(window, 'process', {
  value: {
    env: {
      NODE_ENV: 'test',
    },
  },
})

// Mock ResizeObserver
global.ResizeObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}))

// Mock IntersectionObserver
global.IntersectionObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}))
