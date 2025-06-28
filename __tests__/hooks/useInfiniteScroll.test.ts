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
mockIntersectionObserver.mockImplementation(callback => ({
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

  it('loadMore関数が呼ばれるとisLoadingがtrueになり、タイムアウト後にfalseになる', () => {
    const mockBooks = createMockBooks(100);
    const { result } = renderHook(() => useInfiniteScroll(mockBooks));

    // IntersectionObserverのコールバックを取得
    const observerCallback = mockIntersectionObserver.mock.calls[0][0];

    act(() => {
      observerCallback([{ isIntersecting: true }]);
    });

    expect(result.current.isLoading).toBe(true);

    // タイマーを進める
    act(() => {
      jest.advanceTimersByTime(100);
    });

    expect(result.current.isLoading).toBe(false);
    expect(result.current.displayedBooks).toHaveLength(96); // 48 + 48
  });

  it('isLoading中はloadMoreが重複実行されない', () => {
    const mockBooks = createMockBooks(100);
    const { result } = renderHook(() => useInfiniteScroll(mockBooks));

    const observerCallback = mockIntersectionObserver.mock.calls[0][0];

    act(() => {
      observerCallback([{ isIntersecting: true }]);
      // 2回目の呼び出し（isLoading中）
      observerCallback([{ isIntersecting: true }]);
    });

    expect(result.current.isLoading).toBe(true);

    act(() => {
      jest.advanceTimersByTime(100);
    });

    // 一度だけ読み込まれている
    expect(result.current.displayedBooks).toHaveLength(96);
  });

  it('すべてのアイテムが表示されている場合はloadMoreしない', () => {
    const mockBooks = createMockBooks(100);
    const { result } = renderHook(() => useInfiniteScroll(mockBooks));

    // 初期の48冊表示後、全て表示するまでloadMoreを実行
    const observerCallback = mockIntersectionObserver.mock.calls[0][0];

    act(() => {
      observerCallback([{ isIntersecting: true }]);
    });
    act(() => {
      jest.advanceTimersByTime(100);
    });

    expect(result.current.displayedBooks).toHaveLength(96);

    // さらにloadMoreを実行
    act(() => {
      observerCallback([{ isIntersecting: true }]);
    });
    act(() => {
      jest.advanceTimersByTime(100);
    });

    expect(result.current.displayedBooks).toHaveLength(100);
    expect(result.current.hasMore).toBe(false);

    // 全て表示済みの場合は追加のloadMoreは何もしない
    act(() => {
      observerCallback([{ isIntersecting: true }]);
    });
    act(() => {
      jest.advanceTimersByTime(100);
    });

    expect(result.current.displayedBooks).toHaveLength(100);
  });

  it('isIntersectingがfalseの場合はloadMoreが呼ばれない', () => {
    const mockBooks = createMockBooks(100);
    const { result } = renderHook(() => useInfiniteScroll(mockBooks));

    const observerCallback = mockIntersectionObserver.mock.calls[0][0];

    act(() => {
      observerCallback([{ isIntersecting: false }]);
    });

    // ローディング状態にならない
    expect(result.current.isLoading).toBe(false);
    expect(result.current.displayedBooks).toHaveLength(48); // 初期の48冊のまま
  });
});
