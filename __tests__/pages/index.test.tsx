import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import '@testing-library/jest-dom'
import Home from '../../pages/index'
import { useRouter } from 'next/router'
import { books } from '../../public/books'

// Mock Next.js router
const mockPush = jest.fn()
jest.mock('next/router', () => ({
  useRouter: () => ({
    push: mockPush,
    replace: jest.fn(),
    prefetch: jest.fn(),
    back: jest.fn(),
    pathname: '/',
    query: {},
    asPath: '/',
    route: '/',
    isReady: true,
  }),
}))

// Mock books data for testing
jest.mock('../../public/books', () => ({
  books: [
    {
      id: 'book1',
      title: 'テストブック1',
      author: 'テスト著者1',
      publisher: 'テスト出版社1',
      isbn: '1111111111',
      readDate: '2024/01/15',
      thumnailImage: '/test1.jpg'
    },
    {
      id: 'book2',
      title: 'テストブック2',
      author: 'テスト著者2',
      publisher: 'テスト出版社2',
      isbn: '2222222222',
      readDate: '2023/06/20',
      thumnailImage: '/test2.jpg'
    },
    {
      id: 'book3',
      title: 'テストブック3',
      author: 'テスト著者3',
      publisher: 'テスト出版社3',
      isbn: '3333333333',
      readDate: '2024/12/01',
      thumnailImage: '/test3.jpg'
    },
    {
      id: 'book4',
      title: 'テストブック4',
      author: 'テスト著者4',
      publisher: 'テスト出版社4',
      isbn: '4444444444',
      readDate: '2022/08/10',
      thumnailImage: '/test4.jpg'
    }
  ]
}))

describe('Home Page Integration', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders page with correct title and header', () => {
    render(<Home />)

    // Check that the header is rendered correctly
    expect(screen.getByText('読書管理')).toBeInTheDocument()
  })

  it('renders year filter with correct options', () => {
    render(<Home />)

    expect(screen.getByRole('tab', { name: 'すべての年の本を表示' })).toBeInTheDocument()
    expect(screen.getByRole('tab', { name: '2024年の本を表示' })).toBeInTheDocument()
    expect(screen.getByRole('tab', { name: '2023年の本を表示' })).toBeInTheDocument()
    expect(screen.getByRole('tab', { name: '2022年の本を表示' })).toBeInTheDocument()
  })

  it('displays all books initially', () => {
    render(<Home />)

    expect(screen.getByText('テストブック1')).toBeInTheDocument()
    expect(screen.getByText('テストブック2')).toBeInTheDocument()
    expect(screen.getByText('テストブック3')).toBeInTheDocument()
    expect(screen.getByText('テストブック4')).toBeInTheDocument()
  })

  it('filters books by year when year filter is clicked', () => {
    render(<Home />)

    // Click on 2024 filter
    const button2024 = screen.getByRole('tab', { name: '2024年の本を表示' })
    fireEvent.click(button2024)

    // Should show only 2024 books
    expect(screen.getByText('テストブック1')).toBeInTheDocument()
    expect(screen.getByText('テストブック3')).toBeInTheDocument()
    expect(screen.queryByText('テストブック2')).not.toBeInTheDocument()
    expect(screen.queryByText('テストブック4')).not.toBeInTheDocument()
  })

  it('shows all books when "All" filter is selected after filtering', () => {
    render(<Home />)

    // First filter by 2023
    const button2023 = screen.getByRole('tab', { name: '2023年の本を表示' })
    fireEvent.click(button2023)

    expect(screen.getByText('テストブック2')).toBeInTheDocument()
    expect(screen.queryByText('テストブック1')).not.toBeInTheDocument()

    // Then click "All"
    const buttonAll = screen.getByRole('tab', { name: 'すべての年の本を表示' })
    fireEvent.click(buttonAll)

    // Should show all books again
    expect(screen.getByText('テストブック1')).toBeInTheDocument()
    expect(screen.getByText('テストブック2')).toBeInTheDocument()
    expect(screen.getByText('テストブック3')).toBeInTheDocument()
    expect(screen.getByText('テストブック4')).toBeInTheDocument()
  })

  it('navigates to book detail page when card is clicked', () => {
    render(<Home />)

    const bookCard = screen.getByRole('button', { name: 'テストブック1の詳細を表示。著者: テスト著者1' })
    fireEvent.click(bookCard)

    expect(mockPush).toHaveBeenCalledWith('/items/book1')
  })

  it('handles ISBN link clicks without navigating', () => {
    render(<Home />)

    const isbnLink = screen.getByRole('link', { name: '1111111111' })
    fireEvent.click(isbnLink)

    // Should not call router.push for ISBN links
    expect(mockPush).not.toHaveBeenCalled()
  })

  it('shows correct accessibility attributes', () => {
    render(<Home />)

    // Check main landmark
    expect(screen.getByRole('main')).toBeInTheDocument()

    // Year filter should have proper ARIA attributes
    expect(screen.getByRole('region', { name: '年度フィルター' })).toBeInTheDocument()
    expect(screen.getByRole('tablist', { name: '読了年で絞り込み' })).toBeInTheDocument()

    // Book grid should have proper ARIA attributes
    expect(screen.getByRole('grid')).toBeInTheDocument()
    expect(screen.getByRole('grid')).toHaveAttribute('aria-label', '4冊の本を表示中')
  })

  it('updates book grid aria-label when filtered', () => {
    render(<Home />)

    // Filter by 2024
    const button2024 = screen.getByRole('tab', { name: '2024年の本を表示' })
    fireEvent.click(button2024)

    // Should update the aria-label to show filtered count
    expect(screen.getByRole('grid')).toHaveAttribute('aria-label', '2冊の本を表示中')
  })

  it('renders footer with copyright', () => {
    render(<Home />)

    expect(screen.getByText('© 2024 読書管理. All rights reserved.')).toBeInTheDocument()
  })

  it('handles keyboard navigation on book cards', () => {
    render(<Home />)

    const bookCard = screen.getByRole('button', { name: 'テストブック1の詳細を表示。著者: テスト著者1' })
    
    // Test Enter key
    fireEvent.keyDown(bookCard, { key: 'Enter' })
    expect(mockPush).toHaveBeenCalledWith('/items/book1')

    mockPush.mockClear()

    // Test Space key
    fireEvent.keyDown(bookCard, { key: ' ' })
    expect(mockPush).toHaveBeenCalledWith('/items/book1')
  })

  it('shows year filter buttons with correct selected state', () => {
    render(<Home />)

    // Initially "All" should be selected
    const allButton = screen.getByRole('tab', { name: 'すべての年の本を表示' })
    expect(allButton).toHaveAttribute('aria-selected', 'true')

    // Other buttons should not be selected
    const button2024 = screen.getByRole('tab', { name: '2024年の本を表示' })
    expect(button2024).toHaveAttribute('aria-selected', 'false')

    // Click 2024 button
    fireEvent.click(button2024)

    // Now 2024 should be selected
    expect(button2024).toHaveAttribute('aria-selected', 'true')
    expect(allButton).toHaveAttribute('aria-selected', 'false')
  })
})