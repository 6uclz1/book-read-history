import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Home from '../../pages/index';

// books.tsのモック
jest.mock('../../public/books', () => ({
  books: [
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
      title: 'テストブック2022',
      author: 'テスト作者3',
      publisher: 'テスト出版社3',
      isbn: '9784123456791',
      readDate: '2022/06/15',
      thumnailImage: 'https://example.com/book3.jpg',
    },
  ],
}));

// Next.js routerのモック
const mockPush = jest.fn();
jest.mock('next/router', () => ({
  useRouter: () => ({
    push: mockPush,
    route: '/',
    pathname: '/',
    query: {},
    asPath: '/',
  }),
}));

describe('Home Page', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('ヘッダーが正しく表示される', () => {
    render(<Home />);

    expect(screen.getByRole('banner')).toHaveTextContent('読書管理');
  });

  it('年フィルターが表示される', () => {
    render(<Home />);

    expect(
      screen.getByRole('region', { name: '年度フィルター' })
    ).toBeInTheDocument();
    expect(
      screen.getByRole('tab', { name: 'すべての年の本を表示' })
    ).toBeInTheDocument();
    expect(
      screen.getByRole('tab', { name: '2024年の本を表示' })
    ).toBeInTheDocument();
    expect(
      screen.getByRole('tab', { name: '2023年の本を表示' })
    ).toBeInTheDocument();
    expect(
      screen.getByRole('tab', { name: '2022年の本を表示' })
    ).toBeInTheDocument();
  });

  it('初期状態ですべての本が表示される', () => {
    render(<Home />);

    expect(screen.getByText('テストブック2024')).toBeInTheDocument();
    expect(screen.getByText('テストブック2023')).toBeInTheDocument();
    expect(screen.getByText('テストブック2022')).toBeInTheDocument();
  });

  it('BookGridが適切なARIA属性を持つ', () => {
    render(<Home />);

    const grid = screen.getByRole('grid', { name: '3冊の本を表示中' });
    expect(grid).toBeInTheDocument();
  });

  it('年フィルターをクリックすると該当する年の本のみ表示される', async () => {
    const user = userEvent.setup();
    render(<Home />);

    // 初期状態：すべての本が表示
    expect(screen.getByText('テストブック2024')).toBeInTheDocument();
    expect(screen.getByText('テストブック2023')).toBeInTheDocument();
    expect(screen.getByText('テストブック2022')).toBeInTheDocument();

    // 2024年フィルターをクリック
    const button2024 = screen.getByRole('tab', { name: '2024年の本を表示' });
    await user.click(button2024);

    // 2024年の本のみ表示
    expect(screen.getByText('テストブック2024')).toBeInTheDocument();
    expect(screen.queryByText('テストブック2023')).not.toBeInTheDocument();
    expect(screen.queryByText('テストブック2022')).not.toBeInTheDocument();

    // グリッドのaria-labelも更新される
    await waitFor(() => {
      expect(
        screen.getByRole('grid', { name: '1冊の本を表示中' })
      ).toBeInTheDocument();
    });
  });

  it('Allフィルターをクリックするとすべての本が表示される', async () => {
    const user = userEvent.setup();
    render(<Home />);

    // まず特定の年でフィルタリング
    const button2024 = screen.getByRole('tab', { name: '2024年の本を表示' });
    await user.click(button2024);

    expect(screen.queryByText('テストブック2023')).not.toBeInTheDocument();

    // Allボタンをクリック
    const allButton = screen.getByRole('tab', { name: 'すべての年の本を表示' });
    await user.click(allButton);

    // すべての本が再表示される
    await waitFor(() => {
      expect(screen.getByText('テストブック2024')).toBeInTheDocument();
      expect(screen.getByText('テストブック2023')).toBeInTheDocument();
      expect(screen.getByText('テストブック2022')).toBeInTheDocument();
    });
  });

  it('本のカードをクリックすると詳細ページに遷移する', async () => {
    const user = userEvent.setup();
    render(<Home />);

    const bookCard = screen.getByRole('button', {
      name: 'テストブック2024の詳細を表示。著者: テスト作者1',
    });
    await user.click(bookCard);

    expect(mockPush).toHaveBeenCalledWith('/items/1');
  });

  it('本のカードにキーボードフォーカスができる', async () => {
    const user = userEvent.setup();
    render(<Home />);

    const bookCard = screen.getByRole('button', {
      name: 'テストブック2024の詳細を表示。著者: テスト作者1',
    });

    // 複数回Tabキーを押してブックカードまでフォーカス移動
    await user.tab(); // All button
    await user.tab(); // 2024 button
    await user.tab(); // 2023 button  
    await user.tab(); // 2022 button
    await user.tab(); // Book card
    
    expect(bookCard).toHaveFocus();
  });

  it('キーボードで本のカードを選択できる', async () => {
    const user = userEvent.setup();
    render(<Home />);

    const bookCard = screen.getByRole('button', {
      name: 'テストブック2024の詳細を表示。著者: テスト作者1',
    });

    bookCard.focus();
    await user.keyboard('{Enter}');

    expect(mockPush).toHaveBeenCalledWith('/items/1');
  });

  it('ISBNリンクをクリックしても本の詳細ページには遷移しない', async () => {
    const user = userEvent.setup();
    render(<Home />);

    const isbnLink = screen.getByRole('link', { name: '9784123456789' });
    await user.click(isbnLink);

    // 本の詳細ページには遷移しない
    expect(mockPush).not.toHaveBeenCalled();
  });

  it('フッターが表示される', () => {
    render(<Home />);

    const footer = screen.getByRole('contentinfo');
    expect(footer).toBeInTheDocument();
    expect(footer).toHaveTextContent('© 2024 読書管理. All rights reserved.');
  });

  it('年フィルターボタンの選択状態が正しく反映される', async () => {
    const user = userEvent.setup();
    render(<Home />);

    // 初期状態：Allが選択されている
    const allButton = screen.getByRole('tab', { name: 'すべての年の本を表示' });
    expect(allButton).toHaveAttribute('aria-selected', 'true');

    const button2024 = screen.getByRole('tab', { name: '2024年の本を表示' });
    expect(button2024).toHaveAttribute('aria-selected', 'false');

    // 2024年を選択
    await user.click(button2024);

    expect(button2024).toHaveAttribute('aria-selected', 'true');
    expect(allButton).toHaveAttribute('aria-selected', 'false');
  });

  it('画像のalt属性が適切に設定されている', () => {
    render(<Home />);

    const bookImage = screen.getByAltText('テストブック2024の表紙画像');
    expect(bookImage).toBeInTheDocument();
    expect(bookImage).toHaveAttribute('src', 'https://example.com/book1.jpg');
  });
});
