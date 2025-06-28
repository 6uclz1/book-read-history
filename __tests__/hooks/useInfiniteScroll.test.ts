import { renderHook, act } from '@testing-library/react';
import { useInfiniteScroll } from '../../hooks/useInfiniteScroll';
import { Book } from '../../types/book';

// 軽量なテストデータを生成（メモリ使用量を最小化）
const createMockBooks = (count: number): Book[] => {
  return Array.from({ length: count }, (_, index) => ({
    id: `${index + 1}`,
    title: `Book${index + 1}`,
    author: `Author${index + 1}`,
    publisher: `Pub${index + 1}`,
    isbn: `${index + 1}`,
    readDate: `2024/01/01`,
    thumnailImage: `img${index + 1}.jpg`,
  }));
};

// IntersectionObserverのモック
const mockObserve = jest.fn();
const mockUnobserve = jest.fn();
const mockDisconnect = jest.fn();

const mockIntersectionObserver = jest.fn();
mockIntersectionObserver.mockImplementation((callback) => ({
  observe: mockObserve,
  unobserve: mockUnobserve,
  disconnect: mockDisconnect,
  callback,
}));

beforeAll(() => {
  window.IntersectionObserver = mockIntersectionObserver;
});

describe('useInfiniteScroll', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
    jest.clearAllTimers();
  });

  it('初期状態では48冊の本が表示される', () => {
    const mockBooks = createMockBooks(60);
    const { result } = renderHook(() => useInfiniteScroll(mockBooks));

    expect(result.current.displayedBooks).toHaveLength(48);
    expect(result.current.hasMore).toBe(true);
    expect(result.current.isLoading).toBe(false);
  });

  it('48冊未満の場合は全ての本が表示される', () => {
    const mockBooks = createMockBooks(30);
    const { result } = renderHook(() => useInfiniteScroll(mockBooks));

    expect(result.current.displayedBooks).toHaveLength(30);
    expect(result.current.hasMore).toBe(false);
    expect(result.current.isLoading).toBe(false);
  });

  it('フィルターされた本が変更されると表示アイテムがリセットされる', () => {
    const initialBooks = createMockBooks(60);
    const { result, rerender } = renderHook(
      ({ books }) => useInfiniteScroll(books),
      { initialProps: { books: initialBooks } }
    );

    expect(result.current.displayedBooks).toHaveLength(48);

    // 異なる本のリストに変更
    const newBooks = createMockBooks(20);
    rerender({ books: newBooks });

    expect(result.current.displayedBooks).toHaveLength(20);
    expect(result.current.hasMore).toBe(false);
  });

  it('observerTargetのrefが正しく設定される', () => {
    const mockBooks = createMockBooks(60);
    const { result } = renderHook(() => useInfiniteScroll(mockBooks));

    expect(result.current.observerTarget).toBeDefined();
    expect(result.current.observerTarget.current).toBeNull();
  });

  it('IntersectionObserverが正しくセットアップされる', () => {
    const mockBooks = createMockBooks(60);
    renderHook(() => useInfiniteScroll(mockBooks));

    expect(mockIntersectionObserver).toHaveBeenCalledWith(
      expect.any(Function),
      { threshold: 1.0 }
    );
  });

  it('すべての本が表示されている場合はhasMoreがfalseになる', () => {
    const mockBooks = createMockBooks(48);
    const { result } = renderHook(() => useInfiniteScroll(mockBooks));

    expect(result.current.displayedBooks).toHaveLength(48);
    expect(result.current.hasMore).toBe(false);
  });

  it('空の配列が渡された場合も正しく動作する', () => {
    const { result } = renderHook(() => useInfiniteScroll([]));

    expect(result.current.displayedBooks).toHaveLength(0);
    expect(result.current.hasMore).toBe(false);
    expect(result.current.isLoading).toBe(false);
  });

  it('メモリリークが発生しないように適切にクリーンアップされる', () => {
    const mockBooks = createMockBooks(60);
    const { unmount } = renderHook(() => useInfiniteScroll(mockBooks));

    // アンマウント時にdisconnectが呼ばれることを確認
    unmount();
    expect(mockDisconnect).toHaveBeenCalled();
  });

  it('フィルター変更時にタイムアウトが適切にクリアされる', () => {
    const initialBooks = createMockBooks(60);
    const { result, rerender } = renderHook(
      ({ books }) => useInfiniteScroll(books),
      { initialProps: { books: initialBooks } }
    );

    // 初期状態の確認
    expect(result.current.isLoading).toBe(false);

    // フィルター変更
    const newBooks = createMockBooks(30);
    rerender({ books: newBooks });

    // ローディング状態がリセットされることを確認
    expect(result.current.isLoading).toBe(false);
    expect(result.current.displayedBooks).toHaveLength(30);
  });
});