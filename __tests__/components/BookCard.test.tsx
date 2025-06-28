import { render, screen, fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import BookCard from '../../components/BookCard'
import { Book } from '../../types/book'

const mockBook: Book = {
  id: '1',
  title: 'テストブック',
  author: 'テスト作者',
  publisher: 'テスト出版社',
  isbn: '9784123456789',
  readDate: '2024/01/01',
  thumnailImage: 'https://example.com/book.jpg',
}

const mockOnCardClick = jest.fn()
const mockOnIsbnClick = jest.fn()

describe('BookCard', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('本の情報が正しく表示される', () => {
    render(
      <BookCard
        book={mockBook}
        onCardClick={mockOnCardClick}
        onIsbnClick={mockOnIsbnClick}
      />
    )

    expect(screen.getByText('テストブック')).toBeInTheDocument()
    expect(screen.getByText('テスト作者')).toBeInTheDocument()
    expect(screen.getByText('テスト出版社')).toBeInTheDocument()
    expect(screen.getByText('9784123456789')).toBeInTheDocument()
    expect(screen.getByText('2024/01/01')).toBeInTheDocument()
  })

  it('適切なalt属性を持つ画像が表示される', () => {
    render(
      <BookCard
        book={mockBook}
        onCardClick={mockOnCardClick}
        onIsbnClick={mockOnIsbnClick}
      />
    )

    const image = screen.getByAltText('テストブックの表紙画像')
    expect(image).toBeInTheDocument()
    expect(image).toHaveAttribute('src', mockBook.thumnailImage)
  })

  it('カードクリック時にonCardClickが呼ばれる', async () => {
    const user = userEvent.setup()
    render(
      <BookCard
        book={mockBook}
        onCardClick={mockOnCardClick}
        onIsbnClick={mockOnIsbnClick}
      />
    )

    const card = screen.getByRole('button')
    await user.click(card)

    expect(mockOnCardClick).toHaveBeenCalledWith('1')
    expect(mockOnCardClick).toHaveBeenCalledTimes(1)
  })

  it('Enterキー押下時にonCardClickが呼ばれる', async () => {
    const user = userEvent.setup()
    render(
      <BookCard
        book={mockBook}
        onCardClick={mockOnCardClick}
        onIsbnClick={mockOnIsbnClick}
      />
    )

    const card = screen.getByRole('button')
    card.focus()
    await user.keyboard('{Enter}')

    expect(mockOnCardClick).toHaveBeenCalledWith('1')
    expect(mockOnCardClick).toHaveBeenCalledTimes(1)
  })

  it('Spaceキー押下時にonCardClickが呼ばれる', async () => {
    const user = userEvent.setup()
    render(
      <BookCard
        book={mockBook}
        onCardClick={mockOnCardClick}
        onIsbnClick={mockOnIsbnClick}
      />
    )

    const card = screen.getByRole('button')
    card.focus()
    await user.keyboard(' ')

    expect(mockOnCardClick).toHaveBeenCalledWith('1')
    expect(mockOnCardClick).toHaveBeenCalledTimes(1)
  })

  it('ISBNリンククリック時にonIsbnClickが呼ばれる', async () => {
    const user = userEvent.setup()
    render(
      <BookCard
        book={mockBook}
        onCardClick={mockOnCardClick}
        onIsbnClick={mockOnIsbnClick}
      />
    )

    const isbnLink = screen.getByRole('link', { name: '9784123456789' })
    await user.click(isbnLink)

    expect(mockOnIsbnClick).toHaveBeenCalledTimes(1)
    expect(mockOnCardClick).not.toHaveBeenCalled()
  })

  it('適切なARIA属性が設定されている', () => {
    render(
      <BookCard
        book={mockBook}
        onCardClick={mockOnCardClick}
        onIsbnClick={mockOnIsbnClick}
      />
    )

    const card = screen.getByRole('button')
    expect(card).toHaveAttribute('aria-label', 'テストブックの詳細を表示。著者: テスト作者')
    expect(card).toHaveAttribute('tabIndex', '0')
  })

  it('ISBNリンクが正しいURLを持つ', () => {
    render(
      <BookCard
        book={mockBook}
        onCardClick={mockOnCardClick}
        onIsbnClick={mockOnIsbnClick}
      />
    )

    const isbnLink = screen.getByRole('link', { name: '9784123456789' })
    expect(isbnLink).toHaveAttribute('href', 'https://www.books.or.jp/book-details/9784123456789')
    expect(isbnLink).toHaveAttribute('target', '_blank')
    expect(isbnLink).toHaveAttribute('rel', 'noopener noreferrer')
  })
})