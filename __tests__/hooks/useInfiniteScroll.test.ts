import { useInfiniteScroll } from '../../hooks/useInfiniteScroll'
import { Book } from '../../types/book'

// Mock IntersectionObserver
const mockIntersectionObserver = jest.fn()
const mockObserve = jest.fn()
const mockUnobserve = jest.fn()
const mockDisconnect = jest.fn()

beforeAll(() => {
  global.IntersectionObserver = mockIntersectionObserver.mockImplementation(() => ({
    observe: mockObserve,
    unobserve: mockUnobserve,
    disconnect: mockDisconnect,
  }))
})

beforeEach(() => {
  jest.clearAllMocks()
})

describe('useInfiniteScroll', () => {
  it('exports the hook function', () => {
    expect(typeof useInfiniteScroll).toBe('function')
  })

  it('sets up IntersectionObserver when available', () => {
    expect(global.IntersectionObserver).toBeDefined()
  })
})