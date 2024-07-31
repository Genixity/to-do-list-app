import { act } from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { I18nextProvider } from 'react-i18next';
import i18n from './i18n';
import App from './App';
import '@testing-library/jest-dom/extend-expect';
import 'jest-extended';
import axios from 'axios';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

beforeAll(() => {
  global.matchMedia = global.matchMedia || function () {
    return {
      matches: false,
      media: '',
      onchange: null,
      addListener: function () { },
      removeListener: function () { },
      addEventListener: function () { },
      removeEventListener: function () { },
      dispatchEvent: function () { }
    };
  };
});

beforeEach(() => {
  mockedAxios.get.mockClear();
  mockedAxios.post.mockClear();
});

const renderWithI18n = (component: React.ReactElement) => {
  return render(<I18nextProvider i18n={i18n}>{component}</I18nextProvider>);
};

describe('App Component', () => {
  test('renders todo lists header', () => {
    act(() => {
      renderWithI18n(<App />);
    });
    const headerElement = screen.getByText(/Todo Lists/i);
    expect(headerElement).toBeInTheDocument();
  });

  test('toggles theme on button click', () => {
    act(() => {
      renderWithI18n(<App />);
    });

    const toggleButton = screen.getByRole('button', { name: /toggle theme/i });
    fireEvent.click(toggleButton);

    expect(document.body.className).toBe('dark-mode');
  });

  test('renders empty state correctly', async () => {
    mockedAxios.get.mockResolvedValue({ data: [] });
    const { container } = renderWithI18n(<App />);

    const skeletons = container.querySelectorAll('.react-loading-skeleton');
    expect(skeletons.length).toBeGreaterThan(0);
  });

  test('adds a new todo list', async () => {
    mockedAxios.post.mockResolvedValue({ data: { id: 1, name: 'New List' } });
    mockedAxios.get.mockResolvedValue({ data: [] });
  
    await act(async () => {
      renderWithI18n(<App />);
    });
  
    await act(async () => {
      fireEvent.click(screen.getByRole('button', { name: /add new list/i }));
    });
  
    // Wait for the modal to open and the input field to appear
    const input = await waitFor(() => screen.getByPlaceholderText(/new list name/i));
  
    await act(async () => {
      fireEvent.change(input, { target: { value: 'New List' } });
    });
  
    const addButton = await waitFor(() =>
      screen.getAllByRole('button', { name: /add/i }).find(button => button.closest('.modal-content'))
    );
  
    await act(async () => {
      fireEvent.click(addButton!);
    });
  
    await waitFor(() => expect(screen.getByText('New List')).toBeInTheDocument());
  });  

  test('handles failed todo list fetch', async () => {
    mockedAxios.get.mockRejectedValueOnce(new Error('Failed to fetch'));

    await act(async () => {
      renderWithI18n(<App />);
    });

    expect(await screen.findByText(/failed to fetch/i)).toBeInTheDocument();
  });
});