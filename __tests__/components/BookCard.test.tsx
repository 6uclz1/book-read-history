import { render, screen, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom'
import BookCard from '../../components/BookCard'
import { Book } from '../../types/book'

// Mock book data
const mockBook: Book = {
  id: 'test-book-id',
  title: 'テストブック',
  author: 'テスト著者',
  publisher: 'テスト出版社',
  isbn: '9781234567890',
  readDate: '2024-01-15',
  thumnailImage: '/test-image.jpg'
}

// Mock functions
const mockOnCardClick = jest.fn()
const mockOnIsbnClick = jest.fn()

describe('BookCard', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders book information correctly', () => {
    render(
      <BookCard
        book={mockBook}
        onCardClick={mockOnCardClick}
        onIsbnClick={mockOnIsbnClick}
      />
    )

    expect(screen.getByText('テストブック')).toBeInTheDocument()
    expect(screen.getByText('テスト著者')).toBeInTheDocument()
    expect(screen.getByText('テスト出版社')).toBeInTheDocument()
    expect(screen.getByText('9781234567890')).toBeInTheDocument()
    expect(screen.getByText('2024-01-15')).toBeInTheDocument()
  })

  it('renders image with correct attributes', () => {
    render(
      <BookCard
        book={mockBook}
        onCardClick={mockOnCardClick}
        onIsbnClick={mockOnIsbnClick}
      />
    )

    const image = screen.getByAltText('テストブックの表紙画像')
    expect(image).toBeInTheDocument()
    expect(image).toHaveAttribute('src', '/test-image.jpg')
    expect(image).toHaveAttribute('width', '200')
    expect(image).toHaveAttribute('height', '300')
  })

  it('has proper accessibility attributes', () => {
    render(
      <BookCard
        book={mockBook}
        onCardClick={mockOnCardClick}
        onIsbnClick={mockOnIsbnClick}
      />
    )

    const cardElement = screen.getByRole('button')
    expect(cardElement).toHaveAttribute('tabIndex', '0')
    expect(cardElement).toHaveAttribute('aria-label', 'テストブックの詳細を表示。著者: テスト著者')
  })

  it('calls onCardClick when card is clicked', () => {
    render(
      <BookCard
        book={mockBook}
        onCardClick={mockOnCardClick}
        onIsbnClick={mockOnIsbnClick}
      />
    )

    const cardElement = screen.getByRole('button')
    fireEvent.click(cardElement)

    expect(mockOnCardClick).toHaveBeenCalledTimes(1)
    expect(mockOnCardClick).toHaveBeenCalledWith('test-book-id')
  })

  it('calls onCardClick when Enter key is pressed', () => {
    render(
      <BookCard
        book={mockBook}
        onCardClick={mockOnCardClick}
        onIsbnClick={mockOnIsbnClick}
      />
    )

    const cardElement = screen.getByRole('button')
    fireEvent.keyDown(cardElement, { key: 'Enter' })

    expect(mockOnCardClick).toHaveBeenCalledTimes(1)
    expect(mockOnCardClick).toHaveBeenCalledWith('test-book-id')
  })

  it('calls onCardClick when Space key is pressed', () => {
    render(
      <BookCard
        book={mockBook}
        onCardClick={mockOnCardClick}
        onIsbnClick={mockOnIsbnClick}
      />
    )

    const cardElement = screen.getByRole('button')
    fireEvent.keyDown(cardElement, { key: ' ' })

    expect(mockOnCardClick).toHaveBeenCalledTimes(1)
    expect(mockOnCardClick).toHaveBeenCalledWith('test-book-id')
  })

  it('does not call onCardClick when other keys are pressed', () => {
    render(
      <BookCard
        book={mockBook}
        onCardClick={mockOnCardClick}
        onIsbnClick={mockOnIsbnClick}
      />
    )

    const cardElement = screen.getByRole('button')
    fireEvent.keyDown(cardElement, { key: 'Tab' })

    expect(mockOnCardClick).not.toHaveBeenCalled()
  })

  it('renders ISBN link with correct attributes', () => {
    render(
      <BookCard
        book={mockBook}
        onCardClick={mockOnCardClick}
        onIsbnClick={mockOnIsbnClick}
      />
    )

    const isbnLink = screen.getByRole('link', { name: '9781234567890' })
    expect(isbnLink).toHaveAttribute('href', 'https://www.books.or.jp/book-details/9781234567890')
    expect(isbnLink).toHaveAttribute('target', '_blank')
    expect(isbnLink).toHaveAttribute('rel', 'noopener noreferrer')
  })

  it('calls onIsbnClick when ISBN link is clicked', () => {
    render(
      <BookCard
        book={mockBook}
        onCardClick={mockOnCardClick}
        onIsbnClick={mockOnIsbnClick}
      />
    )

    const isbnLink = screen.getByRole('link', { name: '9781234567890' })
    fireEvent.click(isbnLink)

    expect(mockOnIsbnClick).toHaveBeenCalledTimes(1)
    expect(mockOnIsbnClick).toHaveBeenCalledWith(expect.any(Object), '9781234567890')
  })

  it('displays all section labels', () => {
    render(
      <BookCard
        book={mockBook}
        onCardClick={mockOnCardClick}
        onIsbnClick={mockOnIsbnClick}
      />
    )

    expect(screen.getByText('著者')).toBeInTheDocument()
    expect(screen.getByText('出版社')).toBeInTheDocument()
    expect(screen.getByText('ISBN')).toBeInTheDocument()
    expect(screen.getByText('読了日')).toBeInTheDocument()
  })
})