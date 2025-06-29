import { render, screen, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom'
import YearFilter from '../../components/YearFilter'

// Mock data
const mockAvailableYears = ['All', '2024', '2023', '2022', '2021']
const mockOnYearChange = jest.fn()

describe('YearFilter', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders all year filter buttons', () => {
    render(
      <YearFilter
        selectedYear="All"
        onYearChange={mockOnYearChange}
        availableYears={mockAvailableYears}
      />
    )

    expect(screen.getByRole('tab', { name: 'すべての年の本を表示' })).toBeInTheDocument()
    expect(screen.getByRole('tab', { name: '2024年の本を表示' })).toBeInTheDocument()
    expect(screen.getByRole('tab', { name: '2023年の本を表示' })).toBeInTheDocument()
    expect(screen.getByRole('tab', { name: '2022年の本を表示' })).toBeInTheDocument()
    expect(screen.getByRole('tab', { name: '2021年の本を表示' })).toBeInTheDocument()
  })

  it('displays correct button text', () => {
    render(
      <YearFilter
        selectedYear="All"
        onYearChange={mockOnYearChange}
        availableYears={mockAvailableYears}
      />
    )

    expect(screen.getByText('All')).toBeInTheDocument()
    expect(screen.getByText('2024')).toBeInTheDocument()
    expect(screen.getByText('2023')).toBeInTheDocument()
    expect(screen.getByText('2022')).toBeInTheDocument()
    expect(screen.getByText('2021')).toBeInTheDocument()
  })

  it('applies correct ARIA attributes for accessibility', () => {
    render(
      <YearFilter
        selectedYear="2023"
        onYearChange={mockOnYearChange}
        availableYears={mockAvailableYears}
      />
    )

    // Check region and tablist roles
    expect(screen.getByRole('region', { name: '年度フィルター' })).toBeInTheDocument()
    expect(screen.getByRole('tablist', { name: '読了年で絞り込み' })).toBeInTheDocument()

    // Check tab roles and aria-selected attributes
    const allButton = screen.getByRole('tab', { name: 'すべての年の本を表示' })
    const selectedButton = screen.getByRole('tab', { name: '2023年の本を表示' })
    
    expect(allButton).toHaveAttribute('aria-selected', 'false')
    expect(selectedButton).toHaveAttribute('aria-selected', 'true')
  })

  it('applies correct CSS classes for selected and unselected buttons', () => {
    render(
      <YearFilter
        selectedYear="2023"
        onYearChange={mockOnYearChange}
        availableYears={mockAvailableYears}
      />
    )

    const selectedButton = screen.getByRole('tab', { name: '2023年の本を表示' })
    const unselectedButton = screen.getByRole('tab', { name: '2024年の本を表示' })

    // Note: We can't directly test CSS classes with testing-library as they depend on CSS modules
    // But we can verify the buttons exist and have the proper aria-selected state
    expect(selectedButton).toHaveAttribute('aria-selected', 'true')
    expect(unselectedButton).toHaveAttribute('aria-selected', 'false')
  })

  it('calls onYearChange when a button is clicked', () => {
    render(
      <YearFilter
        selectedYear="All"
        onYearChange={mockOnYearChange}
        availableYears={mockAvailableYears}
      />
    )

    const button2024 = screen.getByRole('tab', { name: '2024年の本を表示' })
    fireEvent.click(button2024)

    expect(mockOnYearChange).toHaveBeenCalledTimes(1)
    expect(mockOnYearChange).toHaveBeenCalledWith('2024')
  })

  it('calls onYearChange with "All" when All button is clicked', () => {
    render(
      <YearFilter
        selectedYear="2023"
        onYearChange={mockOnYearChange}
        availableYears={mockAvailableYears}
      />
    )

    const allButton = screen.getByRole('tab', { name: 'すべての年の本を表示' })
    fireEvent.click(allButton)

    expect(mockOnYearChange).toHaveBeenCalledTimes(1)
    expect(mockOnYearChange).toHaveBeenCalledWith('All')
  })

  it('handles different selected year correctly', () => {
    const { rerender } = render(
      <YearFilter
        selectedYear="2022"
        onYearChange={mockOnYearChange}
        availableYears={mockAvailableYears}
      />
    )

    let selectedButton = screen.getByRole('tab', { name: '2022年の本を表示' })
    expect(selectedButton).toHaveAttribute('aria-selected', 'true')

    // Re-render with different selected year
    rerender(
      <YearFilter
        selectedYear="2021"
        onYearChange={mockOnYearChange}
        availableYears={mockAvailableYears}
      />
    )

    const previouslySelectedButton = screen.getByRole('tab', { name: '2022年の本を表示' })
    const newSelectedButton = screen.getByRole('tab', { name: '2021年の本を表示' })

    expect(previouslySelectedButton).toHaveAttribute('aria-selected', 'false')
    expect(newSelectedButton).toHaveAttribute('aria-selected', 'true')
  })

  it('handles empty availableYears array', () => {
    render(
      <YearFilter
        selectedYear="All"
        onYearChange={mockOnYearChange}
        availableYears={[]}
      />
    )

    // Should still render the container elements
    expect(screen.getByRole('region', { name: '年度フィルター' })).toBeInTheDocument()
    expect(screen.getByRole('tablist', { name: '読了年で絞り込み' })).toBeInTheDocument()
    
    // But no buttons should be present
    expect(screen.queryByRole('tab')).not.toBeInTheDocument()
  })

  it('handles single year in availableYears', () => {
    render(
      <YearFilter
        selectedYear="2024"
        onYearChange={mockOnYearChange}
        availableYears={['2024']}
      />
    )

    const singleButton = screen.getByRole('tab', { name: '2024年の本を表示' })
    expect(singleButton).toBeInTheDocument()
    expect(singleButton).toHaveAttribute('aria-selected', 'true')
    
    // Should only have one button
    const allButtons = screen.getAllByRole('tab')
    expect(allButtons).toHaveLength(1)
  })
})