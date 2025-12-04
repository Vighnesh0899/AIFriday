import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import FileUpload from '../components/FileUpload';

describe('FileUpload Component', () => {
  it('renders upload area correctly', () => {
    render(<FileUpload onDataLoaded={vi.fn()} onError={vi.fn()} />);
    
    expect(screen.getByText(/Drop your file here or click to browse/i)).toBeInTheDocument();
    expect(screen.getByText(/Supports CSV and JSON formats/i)).toBeInTheDocument();
  });

  it('shows error for invalid file type', async () => {
    const onError = vi.fn();
    render(<FileUpload onDataLoaded={vi.fn()} onError={onError} />);
    
    const file = new File(['test content'], 'test.txt', { type: 'text/plain' });
    const input = screen.getByLabelText('File upload input');
    
    fireEvent.change(input, { target: { files: [file] } });
    
    await waitFor(() => {
      expect(onError).toHaveBeenCalledWith(
        expect.stringContaining('Invalid file type')
      );
    });
  });

  it('accepts CSV files', async () => {
    const onDataLoaded = vi.fn();
    render(<FileUpload onDataLoaded={onDataLoaded} onError={vi.fn()} />);
    
    const csvContent = 'id,customer_name,lat,lng,address\n1,Test Customer,40.7128,-74.0060,123 Main St';
    const file = new File([csvContent], 'test.csv', { type: 'text/csv' });
    const input = screen.getByLabelText('File upload input');
    
    fireEvent.change(input, { target: { files: [file] } });
    
    await waitFor(() => {
      expect(onDataLoaded).toHaveBeenCalled();
    });
  });

  it('shows processing state while parsing file', async () => {
    render(<FileUpload onDataLoaded={vi.fn()} onError={vi.fn()} />);
    
    const csvContent = 'id,customer_name,lat,lng,address\n1,Test,40.7128,-74.0060,Address';
    const file = new File([csvContent], 'test.csv', { type: 'text/csv' });
    const input = screen.getByLabelText('File upload input');
    
    fireEvent.change(input, { target: { files: [file] } });
    
    expect(screen.getByText(/Processing file.../i)).toBeInTheDocument();
  });

  it('displays success message after successful upload', async () => {
    render(<FileUpload onDataLoaded={vi.fn()} onError={vi.fn()} />);
    
    const csvContent = 'id,customer_name,lat,lng,address\n1,Test,40.7128,-74.0060,Address';
    const file = new File([csvContent], 'test.csv', { type: 'text/csv' });
    const input = screen.getByLabelText('File upload input');
    
    fireEvent.change(input, { target: { files: [file] } });
    
    await waitFor(() => {
      expect(screen.getByText(/File uploaded successfully!/i)).toBeInTheDocument();
    });
  });

  it('validates required fields in data', async () => {
    const onError = vi.fn();
    render(<FileUpload onDataLoaded={vi.fn()} onError={onError} />);
    
    // Missing required field 'address'
    const csvContent = 'id,customer_name,lat,lng\n1,Test,40.7128,-74.0060';
    const file = new File([csvContent], 'test.csv', { type: 'text/csv' });
    const input = screen.getByLabelText('File upload input');
    
    fireEvent.change(input, { target: { files: [file] } });
    
    await waitFor(() => {
      expect(onError).toHaveBeenCalledWith(
        expect.stringContaining('Validation failed')
      );
    });
  });
});
