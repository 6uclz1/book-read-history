import { render, screen } from '@testing-library/react';
import BookGrid from '../../components/BookGrid';
import { Book } from '../../types/book';

const mockBooks: Book[] = [
  {
    id: '1',
    title: 'テストブック1',
    author: 'テスト作者1',
    publisher: 'テスト出版社1',
    isbn: '9784123456789',
    readDate: '2024/01/01',
    thumnailImage: 'https://example.com/book1.jpg',
  },
  {
    id: '2',
    title: 'テストブック2',
    author: 'テスト作者2',
    publisher: 'テスト出版社2',
    isbn: '9784123456790',
    readDate: '2024/01/02',
    thumnailImage: 'https://example.com/book2.jpg',
  },
];

const mockOnCardClick = jest.fn();
const mockOnIsbnClick = jest.fn();

describe('BookGrid', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('本のリストが正しく表示される', () => {
    render(
      <BookGrid
        books={mockBooks}
        onCardClick={mockOnCardClick}
        onIsbnClick={mockOnIsbnClick}
      />
    );

    expect(screen.getByText('テストブック1')).toBeInTheDocument();
    expect(screen.getByText('テストブック2')).toBeInTheDocument();
    expect(screen.getByText('テスト作者1')).toBeInTheDocument();
    expect(screen.getByText('テスト作者2')).toBeInTheDocument();
  });

  it('適切なARIA属性が設定されている', () => {
    render(
      <BookGrid
        books={mockBooks}
        onCardClick={mockOnCardClick}
        onIsbnClick={mockOnIsbnClick}
      />
    );

    const grid = screen.getByRole('grid', { name: '2冊の本を表示中' });
    expect(grid).toBeInTheDocument();

    const gridcells = screen.getAllByRole('gridcell');
    expect(gridcells).toHaveLength(2);
  });

  it('本が0冊の場合も正しく表示される', () => {
    render(
      <BookGrid
        books={[]}
        onCardClick={mockOnCardClick}
        onIsbnClick={mockOnIsbnClick}
      />
    );

    const grid = screen.getByRole('grid', { name: '0冊の本を表示中' });
    expect(grid).toBeInTheDocument();

    const gridcells = screen.queryAllByRole('gridcell');
    expect(gridcells).toHaveLength(0);
  });

  it('hasMoreがtrueの場合、observer targetが表示される', () => {
    render(
      <BookGrid
        books={mockBooks}
        onCardClick={mockOnCardClick}
        onIsbnClick={mockOnIsbnClick}
        hasMore={true}
      />
    );

    // observer targetはスタイルクラスで確認
    const observerTarget = document.querySelector('.observerTarget');
    expect(observerTarget).toBeInTheDocument();
  });

  it('hasMoreがfalseの場合、observer targetが表示されない', () => {
    render(
      <BookGrid
        books={mockBooks}
        onCardClick={mockOnCardClick}
        onIsbnClick={mockOnIsbnClick}
        hasMore={false}
      />
    );

    const observerTarget = document.querySelector('.observerTarget');
    expect(observerTarget).not.toBeInTheDocument();
  });

  it('isLoadingがtrueの場合、読み込み中メッセージが表示される', () => {
    render(
      <BookGrid
        books={mockBooks}
        onCardClick={mockOnCardClick}
        onIsbnClick={mockOnIsbnClick}
        hasMore={true}
        isLoading={true}
      />
    );

    const loadingMessage = screen.getByLabelText('更に本を読み込み中');
    expect(loadingMessage).toBeInTheDocument();
    expect(loadingMessage).toHaveTextContent('読み込み中...');
  });

  it('isLoadingがfalseの場合、読み込み中メッセージが表示されない', () => {
    render(
      <BookGrid
        books={mockBooks}
        onCardClick={mockOnCardClick}
        onIsbnClick={mockOnIsbnClick}
        hasMore={true}
        isLoading={false}
      />
    );

    const loadingMessage = screen.queryByLabelText('更に本を読み込み中');
    expect(loadingMessage).not.toBeInTheDocument();
  });

  it('各BookCardが正しいpropsを受け取る', () => {
    render(
      <BookGrid
        books={[mockBooks[0]]}
        onCardClick={mockOnCardClick}
        onIsbnClick={mockOnIsbnClick}
      />
    );

    // BookCardのrole="button"を確認
    const card = screen.getByRole('button');
    expect(card).toHaveAttribute(
      'aria-label',
      'テストブック1の詳細を表示。著者: テスト作者1'
    );
  });

  it('読み込み中状態のaria-live属性が正しく設定される', () => {
    render(
      <BookGrid
        books={mockBooks}
        onCardClick={mockOnCardClick}
        onIsbnClick={mockOnIsbnClick}
        hasMore={true}
        isLoading={true}
      />
    );

    const loadingMessage = screen.getByLabelText('更に本を読み込み中');
    expect(loadingMessage).toHaveAttribute('aria-live', 'polite');
  });
});
