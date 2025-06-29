import { renderHook, act } from '@testing-library/react'
import { useBookFilter } from '../../hooks/useBookFilter'
import { Book } from '../../types/book'

// Mock book data
const mockBooks: Book[] = [
  {
    id: '1',
    title: 'Book 1',
    author: 'Author 1',
    publisher: 'Publisher 1',
    isbn: '1111111111',
    readDate: '2024/01/15',
    thumnailImage: '/image1.jpg'
  },
  {
    id: '2',
    title: 'Book 2',
    author: 'Author 2',
    publisher: 'Publisher 2',
    isbn: '2222222222',
    readDate: '2023/06/20',
    thumnailImage: '/image2.jpg'
  },
  {
    id: '3',
    title: 'Book 3',
    author: 'Author 3',
    publisher: 'Publisher 3',
    isbn: '3333333333',
    readDate: '2024/12/01',
    thumnailImage: '/image3.jpg'
  },
  {
    id: '4',
    title: 'Book 4',
    author: 'Author 4',
    publisher: 'Publisher 4',
    isbn: '4444444444',
    readDate: '2022/08/10',
    thumnailImage: '/image4.jpg'
  }
]

describe('useBookFilter', () => {
  it('initializes with correct default values', () => {
    const { result } = renderHook(() => useBookFilter(mockBooks))

    expect(result.current.selectedYear).toBe('All')
    expect(result.current.filteredBooks).toEqual(mockBooks)
    expect(result.current.availableYears).toEqual(['All', '2024', '2023', '2022'])
  })

  it('generates available years correctly from book data', () => {
    const { result } = renderHook(() => useBookFilter(mockBooks))

    // Years should be sorted in descending order with 'All' first
    expect(result.current.availableYears).toEqual(['All', '2024', '2023', '2022'])
  })

  it('filters books by selected year', () => {
    const { result } = renderHook(() => useBookFilter(mockBooks))

    act(() => {
      result.current.setSelectedYear('2024')
    })

    expect(result.current.selectedYear).toBe('2024')
    expect(result.current.filteredBooks).toHaveLength(2)
    expect(result.current.filteredBooks.every(book => book.readDate.startsWith('2024'))).toBe(true)
  })

  it('shows all books when "All" is selected', () => {
    const { result } = renderHook(() => useBookFilter(mockBooks))

    // First select a specific year
    act(() => {
      result.current.setSelectedYear('2023')
    })

    expect(result.current.filteredBooks).toHaveLength(1)

    // Then select "All"
    act(() => {
      result.current.setSelectedYear('All')
    })

    expect(result.current.selectedYear).toBe('All')
    expect(result.current.filteredBooks).toEqual(mockBooks)
  })

  it('handles year change correctly', () => {
    const { result } = renderHook(() => useBookFilter(mockBooks))

    act(() => {
      result.current.setSelectedYear('2022')
    })

    expect(result.current.selectedYear).toBe('2022')
    expect(result.current.filteredBooks).toHaveLength(1)
    expect(result.current.filteredBooks[0].id).toBe('4')
  })

  it('handles empty book array', () => {
    const { result } = renderHook(() => useBookFilter([]))

    expect(result.current.selectedYear).toBe('All')
    expect(result.current.filteredBooks).toEqual([])
    expect(result.current.availableYears).toEqual(['All'])
  })

  it('handles books with duplicate years', () => {
    const booksWithDuplicateYears: Book[] = [
      ...mockBooks,
      {
        id: '5',
        title: 'Book 5',
        author: 'Author 5',
        publisher: 'Publisher 5',
        isbn: '5555555555',
        readDate: '2024/03/15',
        thumnailImage: '/image5.jpg'
      }
    ]

    const { result } = renderHook(() => useBookFilter(booksWithDuplicateYears))

    // Should not have duplicate years in availableYears
    expect(result.current.availableYears).toEqual(['All', '2024', '2023', '2022'])
    
    act(() => {
      result.current.setSelectedYear('2024')
    })

    // Should filter all books from 2024
    expect(result.current.filteredBooks).toHaveLength(3)
  })

  it('updates filtered books when books prop changes', () => {
    const { result, rerender } = renderHook(
      ({ books }) => useBookFilter(books),
      { initialProps: { books: mockBooks } }
    )

    expect(result.current.filteredBooks).toHaveLength(4)

    // Update with fewer books
    const fewerBooks = mockBooks.slice(0, 2)
    rerender({ books: fewerBooks })

    expect(result.current.filteredBooks).toHaveLength(2)
    expect(result.current.availableYears).toEqual(['All', '2024', '2023'])
  })

  it('maintains filter when books prop changes', () => {
    const { result, rerender } = renderHook(
      ({ books }) => useBookFilter(books),
      { initialProps: { books: mockBooks } }
    )

    // Select a specific year
    act(() => {
      result.current.setSelectedYear('2024')
    })

    expect(result.current.filteredBooks).toHaveLength(2)

    // Update books but keep the same filter
    const newBooks: Book[] = [
      ...mockBooks,
      {
        id: '6',
        title: 'Book 6',
        author: 'Author 6',
        publisher: 'Publisher 6',
        isbn: '6666666666',
        readDate: '2024/05/01',
        thumnailImage: '/image6.jpg'
      }
    ]

    rerender({ books: newBooks })

    // Should still be filtered by 2024, but now with 3 books
    expect(result.current.selectedYear).toBe('2024')
    expect(result.current.filteredBooks).toHaveLength(3)
  })
})