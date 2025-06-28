import { renderHook, act } from '@testing-library/react';
import { useInfiniteScroll } from '../../hooks/useInfiniteScroll';
import { Book } from '../../types/book';

// 大量のテストデータを生成
const createMockBooks = (count: number): Book[] => {
  return Array.from({ length: count }, (_, index) => ({
    id: `${index + 1}`,
    title: `テストブック${index + 1}`,
    author: `テスト作者${index + 1}`,
    publisher: `テスト出版社${index + 1}`,
    isbn: `978412345678${index.toString().padStart(1, '0')}`,
    readDate: `2024/01/${((index % 30) + 1).toString().padStart(2, '0')}`,
    thumnailImage: `https://example.com/book${index + 1}.jpg`,
  }));
};

// IntersectionObserverのモック
const mockIntersectionObserver = jest.fn();
mockIntersectionObserver.mockReturnValue({
  observe: () => null,
  unobserve: () => null,
  disconnect: () => null,
});

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
    const initialBooks = createMockBooks(60); // メモリ使用量削減
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
    expect(result.current.observerTarget.current).toBeNull(); // まだDOMに接続されていない
  });

  it('IntersectionObserverが正しくセットアップされる', () => {
    const mockBooks = createMockBooks(60);
    renderHook(() => useInfiniteScroll(mockBooks));

    expect(mockIntersectionObserver).toHaveBeenCalledWith(
      expect.any(Function),
      { threshold: 1.0 }
    );
  });

  it('loadMore関数が呼ばれるとisLoadingがtrueになる', () => {
    const mockBooks = createMockBooks(60);
    const { result } = renderHook(() => useInfiniteScroll(mockBooks));

    // IntersectionObserverのコールバックを取得
    const observerCallback = mockIntersectionObserver.mock.calls[0][0];

    act(() => {
      // IntersectionObserverが発火したかのように動作
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

  it('すべての本が表示されている場合はhasMoreがfalseになる', () => {
    const mockBooks = createMockBooks(48); // ちょうど48冊
    const { result } = renderHook(() => useInfiniteScroll(mockBooks));

    expect(result.current.displayedBooks).toHaveLength(48);
    expect(result.current.hasMore).toBe(false);
  });

  it('96冊表示後にさらに読み込むと144冊表示される', () => {
    const mockBooks = createMockBooks(150);
    const { result } = renderHook(() => useInfiniteScroll(mockBooks));

    expect(result.current.displayedBooks).toHaveLength(48);

    // 1回目の読み込み
    const observerCallback = mockIntersectionObserver.mock.calls[0][0];
    act(() => {
      observerCallback([{ isIntersecting: true }]);
    });
    act(() => {
      jest.advanceTimersByTime(100);
    });

    expect(result.current.displayedBooks).toHaveLength(96);

    // 2回目の読み込み
    act(() => {
      observerCallback([{ isIntersecting: true }]);
    });
    act(() => {
      jest.advanceTimersByTime(100);
    });

    expect(result.current.displayedBooks).toHaveLength(144);
  });

  it('最後のページまで読み込むとhasMoreがfalseになる', () => {
    const mockBooks = createMockBooks(50); // 48 + 2冊
    const { result } = renderHook(() => useInfiniteScroll(mockBooks));

    expect(result.current.displayedBooks).toHaveLength(48);
    expect(result.current.hasMore).toBe(true);

    // 読み込み実行
    const observerCallback = mockIntersectionObserver.mock.calls[0][0];
    act(() => {
      observerCallback([{ isIntersecting: true }]);
    });
    act(() => {
      jest.advanceTimersByTime(100);
    });

    expect(result.current.displayedBooks).toHaveLength(50);
    expect(result.current.hasMore).toBe(false);
  });

  it('空の配列が渡された場合も正しく動作する', () => {
    const { result } = renderHook(() => useInfiniteScroll([]));

    expect(result.current.displayedBooks).toHaveLength(0);
    expect(result.current.hasMore).toBe(false);
    expect(result.current.isLoading).toBe(false);
  });

  it('読み込み中に複数回呼ばれても重複して処理されない', () => {
    const mockBooks = createMockBooks(60);
    const { result } = renderHook(() => useInfiniteScroll(mockBooks));

    const observerCallback = mockIntersectionObserver.mock.calls[0][0];

    // 連続して呼び出し
    act(() => {
      observerCallback([{ isIntersecting: true }]);
      observerCallback([{ isIntersecting: true }]);
      observerCallback([{ isIntersecting: true }]);
    });

    expect(result.current.isLoading).toBe(true);

    act(() => {
      jest.advanceTimersByTime(100);
    });

    // 一度だけ読み込まれている
    expect(result.current.displayedBooks).toHaveLength(96);
  });
});
