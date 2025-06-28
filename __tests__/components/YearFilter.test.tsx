import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import YearFilter from '../../components/YearFilter';

const mockOnYearChange = jest.fn();

const defaultProps = {
  selectedYear: '2024',
  onYearChange: mockOnYearChange,
  availableYears: ['All', '2024', '2023', '2022', '2021'],
};

describe('YearFilter', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('利用可能な年がすべて表示される', () => {
    render(<YearFilter {...defaultProps} />);

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
    expect(
      screen.getByRole('tab', { name: '2021年の本を表示' })
    ).toBeInTheDocument();
  });

  it('選択された年のボタンが選択状態になっている', () => {
    render(<YearFilter {...defaultProps} />);

    const selectedButton = screen.getByRole('tab', {
      name: '2024年の本を表示',
    });
    expect(selectedButton).toHaveAttribute('aria-selected', 'true');

    const unselectedButton = screen.getByRole('tab', {
      name: '2023年の本を表示',
    });
    expect(unselectedButton).toHaveAttribute('aria-selected', 'false');
  });

  it('年ボタンクリック時にonYearChangeが呼ばれる', async () => {
    const user = userEvent.setup();
    render(<YearFilter {...defaultProps} />);

    const button2023 = screen.getByRole('tab', { name: '2023年の本を表示' });
    await user.click(button2023);

    expect(mockOnYearChange).toHaveBeenCalledWith('2023');
    expect(mockOnYearChange).toHaveBeenCalledTimes(1);
  });

  it('Allボタンクリック時にonYearChangeが呼ばれる', async () => {
    const user = userEvent.setup();
    render(<YearFilter {...defaultProps} />);

    const allButton = screen.getByRole('tab', { name: 'すべての年の本を表示' });
    await user.click(allButton);

    expect(mockOnYearChange).toHaveBeenCalledWith('All');
    expect(mockOnYearChange).toHaveBeenCalledTimes(1);
  });

  it('適切なARIA属性が設定されている', () => {
    render(<YearFilter {...defaultProps} />);

    const filterRegion = screen.getByRole('region', { name: '年度フィルター' });
    expect(filterRegion).toBeInTheDocument();

    const tablist = screen.getByRole('tablist', { name: '読了年で絞り込み' });
    expect(tablist).toBeInTheDocument();

    const tabs = screen.getAllByRole('tab');
    expect(tabs).toHaveLength(5);
    tabs.forEach(tab => {
      expect(tab).toHaveAttribute('aria-selected');
    });
  });

  it('選択された年がAllの場合、適切にaria-selectedが設定される', () => {
    render(<YearFilter {...defaultProps} selectedYear="All" />);

    const allButton = screen.getByRole('tab', { name: 'すべての年の本を表示' });
    expect(allButton).toHaveAttribute('aria-selected', 'true');

    const otherButtons = screen
      .getAllByRole('tab')
      .filter(tab => tab !== allButton);
    otherButtons.forEach(button => {
      expect(button).toHaveAttribute('aria-selected', 'false');
    });
  });

  it('動的に生成された年リストに対応している', () => {
    const dynamicProps = {
      ...defaultProps,
      availableYears: ['All', '2025', '2024'],
    };
    render(<YearFilter {...dynamicProps} />);

    expect(
      screen.getByRole('tab', { name: 'すべての年の本を表示' })
    ).toBeInTheDocument();
    expect(
      screen.getByRole('tab', { name: '2025年の本を表示' })
    ).toBeInTheDocument();
    expect(
      screen.getByRole('tab', { name: '2024年の本を表示' })
    ).toBeInTheDocument();
    expect(
      screen.queryByRole('tab', { name: '2023年の本を表示' })
    ).not.toBeInTheDocument();
  });
});
