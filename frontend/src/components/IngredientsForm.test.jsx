// FILEPATH: /home/dawigg/paws-and-pans/frontend/src/components/IngredientsForm.test.jsx
import { render, fireEvent, waitFor } from '@testing-library/react';
import IngredientsForm from './IngredientsForm';

describe('IngredientsForm', () => {
  const mockGenerateRecipe = jest.fn();

  beforeEach(() => {
    mockGenerateRecipe.mockClear();
  });

  test('renders without crashing', () => {
    render(<IngredientsForm generateRecipe={mockGenerateRecipe} />);
  });

  test('adds a new ingredient input field when "Add Another" button is clicked', () => {
    const { getAllByPlaceholderText, getByText } = render(<IngredientsForm generateRecipe={mockGenerateRecipe} />);
    fireEvent.click(getByText('Add Another'));
    expect(getAllByPlaceholderText('ingredient')).toHaveLength(2);
  });

  test('calls generateRecipe with correct parameters when "Generate!" button is clicked', async () => {
    const { getByText, getByPlaceholderText } = render(<IngredientsForm generateRecipe={mockGenerateRecipe} />);
    fireEvent.change(getByPlaceholderText('ingredient'), { target: { value: 'test ingredient' } });
    fireEvent.click(getByText('Generate!'));
    await waitFor(() => expect(mockGenerateRecipe).toHaveBeenCalledWith({ ingredients: ['test ingredient'] }));
  });

  test('displays recipe after "Generate!" button is clicked', async () => {
    mockGenerateRecipe.mockResolvedValue('Test recipe');
    const { getByText, getByPlaceholderText } = render(<IngredientsForm generateRecipe={mockGenerateRecipe} />);
    fireEvent.change(getByPlaceholderText('ingredient'), { target: { value: 'test ingredient' } });
    fireEvent.click(getByText('Generate!'));
    await waitFor(() => expect(getByText('Test recipe')).toBeInTheDocument());
  });
});