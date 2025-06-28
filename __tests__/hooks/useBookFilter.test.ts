import { renderHook, act } from '@testing-library/react';
import { useBookFilter } from '../../hooks/useBookFilter';
import { Book } from '../../types/book';

const mockBooks: Book[] = [
  {
    id: '1',
    title: 'テストブック2024',
    author: 'テスト作者1',
    publisher: 'テスト出版社1',
    isbn: '9784123456789',
    readDate: '2024/01/01',
    thumnailImage: 'https://example.com/book1.jpg',
  },
  {
    id: '2',
    title: 'テストブック2023',
    author: 'テスト作者2',
    publisher: 'テスト出版社2',
    isbn: '9784123456790',
    readDate: '2023/12/31',
    thumnailImage: 'https://example.com/book2.jpg',
  },
  {
    id: '3',
    title: 'テストブック2023-2',
    author: 'テスト作者3',
    publisher: 'テスト出版社3',
    isbn: '9784123456791',
    readDate: '2023/06/15',
    thumnailImage: 'https://example.com/book3.jpg',
  },
  {
    id: '4',
    title: 'テストブック2022',
    author: 'テスト作者4',
    publisher: 'テスト出版社4',
    isbn: '9784123456792',
    readDate: '2022/03/10',
    thumnailImage: 'https://example.com/book4.jpg',
  },
];

describe('useBookFilter', () => {
  it('初期状態では"All"が選択され、すべての本が表示される', () => {
    const { result } = renderHook(() => useBookFilter(mockBooks));

    expect(result.current.selectedYear).toBe('All');
    expect(result.current.filteredBooks).toEqual(mockBooks);
    expect(result.current.filteredBooks).toHaveLength(4);
  });

  it('利用可能な年が正しく生成される', () => {
    const { result } = renderHook(() => useBookFilter(mockBooks));

    expect(result.current.availableYears).toEqual([
      'All',
      '2024',
      '2023',
      '2022',
    ]);
  });

  it('年が降順でソートされる', () => {
    const { result } = renderHook(() => useBookFilter(mockBooks));

    const yearsWithoutAll = result.current.availableYears.slice(1); // "All"を除く
    const sortedYears = [...yearsWithoutAll].sort((a, b) => b.localeCompare(a));
    expect(yearsWithoutAll).toEqual(sortedYears);
  });

  it('2024年を選択すると2024年の本のみ表示される', () => {
    const { result } = renderHook(() => useBookFilter(mockBooks));

    act(() => {
      result.current.setSelectedYear('2024');
    });

    expect(result.current.selectedYear).toBe('2024');
    expect(result.current.filteredBooks).toHaveLength(1);
    expect(result.current.filteredBooks[0].title).toBe('テストブック2024');
  });

  it('2023年を選択すると2023年の本のみ表示される', () => {
    const { result } = renderHook(() => useBookFilter(mockBooks));

    act(() => {
      result.current.setSelectedYear('2023');
    });

    expect(result.current.selectedYear).toBe('2023');
    expect(result.current.filteredBooks).toHaveLength(2);
    expect(result.current.filteredBooks.map(book => book.title)).toEqual([
      'テストブック2023',
      'テストブック2023-2',
    ]);
  });

  it('存在しない年を選択すると空の配列が返される', () => {
    const { result } = renderHook(() => useBookFilter(mockBooks));

    act(() => {
      result.current.setSelectedYear('2021');
    });

    expect(result.current.selectedYear).toBe('2021');
    expect(result.current.filteredBooks).toHaveLength(0);
  });

  it('年選択後に"All"に戻すとすべての本が表示される', () => {
    const { result } = renderHook(() => useBookFilter(mockBooks));

    // まず特定の年を選択
    act(() => {
      result.current.setSelectedYear('2023');
    });
    expect(result.current.filteredBooks).toHaveLength(2);

    // "All"に戻す
    act(() => {
      result.current.setSelectedYear('All');
    });

    expect(result.current.selectedYear).toBe('All');
    expect(result.current.filteredBooks).toEqual(mockBooks);
    expect(result.current.filteredBooks).toHaveLength(4);
  });

  it('空の本リストでも正しく動作する', () => {
    const { result } = renderHook(() => useBookFilter([]));

    expect(result.current.selectedYear).toBe('All');
    expect(result.current.filteredBooks).toEqual([]);
    expect(result.current.availableYears).toEqual(['All']);
  });

  it('本のデータが変更されると利用可能な年も更新される', () => {
    const initialBooks = mockBooks.slice(0, 2); // 2024, 2023のみ
    const { result, rerender } = renderHook(
      ({ books }) => useBookFilter(books),
      { initialProps: { books: initialBooks } }
    );

    expect(result.current.availableYears).toEqual(['All', '2024', '2023']);

    // すべての本を含むように変更
    rerender({ books: mockBooks });

    expect(result.current.availableYears).toEqual([
      'All',
      '2024',
      '2023',
      '2022',
    ]);
  });

  it('同じ年の本が複数あっても年は重複しない', () => {
    const booksWithDuplicateYears: Book[] = [
      ...mockBooks,
      {
        id: '5',
        title: 'もう一つの2024年の本',
        author: 'テスト作者5',
        publisher: 'テスト出版社5',
        isbn: '9784123456793',
        readDate: '2024/06/01',
        thumnailImage: 'https://example.com/book5.jpg',
      },
    ];

    const { result } = renderHook(() => useBookFilter(booksWithDuplicateYears));

    expect(result.current.availableYears).toEqual([
      'All',
      '2024',
      '2023',
      '2022',
    ]);
    // 重複していないことを確認
    const uniqueYears = [...new Set(result.current.availableYears)];
    expect(result.current.availableYears).toEqual(uniqueYears);
  });
});
