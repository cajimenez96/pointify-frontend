/**
 * Integration test: Company Create Form
 * Tests CompanyFormDialog in create mode with form validation
 */

import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { CompanyFormDialog } from '@/app/superadmin/companies/components/CompanyFormDialog';
import * as companiesRepo from '@/repositories/superadmin/companies/companies';

// Mock repositories
jest.mock('@/repositories/superadmin/companies/companies');

// Mock sonner
jest.mock('sonner', () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
  },
}));

import { toast } from 'sonner';

describe('CompanyFormDialog - Create Mode', () => {
  let queryClient: QueryClient;
  const mockOnOpenChange = jest.fn();
  const mockOnSuccess = jest.fn();

  beforeEach(() => {
    queryClient = new QueryClient({
      defaultOptions: {
        queries: { retry: false },
        mutations: { retry: false },
      },
    });
    jest.clearAllMocks();
  });

  function renderDialog(open = true) {
    return render(
      <QueryClientProvider client={queryClient}>
        <CompanyFormDialog
          mode="create"
          open={open}
          onOpenChange={mockOnOpenChange}
          onSuccess={mockOnSuccess}
        />
      </QueryClientProvider>
    );
  }

  it('should render create dialog with title', () => {
    renderDialog();

    expect(screen.getByText('Crear Nueva Empresa')).toBeInTheDocument();
  });

  it('should render all form fields', () => {
    renderDialog();

    expect(screen.getByLabelText(/Código de Empresa/)).toBeInTheDocument();
    expect(screen.getByLabelText(/CUIT\/CUIL/)).toBeInTheDocument();
    expect(screen.getByLabelText(/Razón Social/)).toBeInTheDocument();
    expect(screen.getByLabelText(/Dirección/)).toBeInTheDocument();
    expect(screen.getByLabelText(/Nombre del Contacto/)).toBeInTheDocument();
    expect(screen.getByLabelText(/Teléfono/)).toBeInTheDocument();
    expect(screen.getByLabelText(/Email/)).toBeInTheDocument();
  });

  it('should show validation errors on empty submit', async () => {
    const user = userEvent.setup();
    renderDialog();

    await user.click(screen.getByRole('button', { name: 'Crear Empresa' }));

    await waitFor(() => {
      // Zod validation should kick in for required fields
      const errorMessages = screen.getAllByText(
        /obligatorio|requerido|caracteres|dígitos/i
      );
      expect(errorMessages.length).toBeGreaterThan(0);
    });
  });

  it('should call createCompany on valid submit', async () => {
    const mockCompany = {
      _id: 'new-id',
      companyCode: 'TEST01',
      businessName: 'Test Company',
      cuitCuil: '20123456789',
      isActive: true,
    };
    (companiesRepo.createCompany as jest.Mock).mockResolvedValue(mockCompany);

    const user = userEvent.setup();
    renderDialog();

    // Fill required fields
    await user.type(screen.getByLabelText(/Código de Empresa/), 'TEST01');
    await user.type(screen.getByLabelText(/CUIT\/CUIL/), '20123456789');
    await user.type(screen.getByLabelText(/Razón Social/), 'Test Company S.A.');
    await user.type(screen.getByLabelText(/Nombre del Contacto/), 'Juan Test');
    await user.type(screen.getByLabelText(/Teléfono/), '1234567890');
    await user.type(screen.getByLabelText(/Email/), 'test@test.com');

    await user.click(screen.getByRole('button', { name: 'Crear Empresa' }));

    await waitFor(() => {
      expect(companiesRepo.createCompany).toHaveBeenCalledWith(
        expect.objectContaining({
          companyCode: 'TEST01',
          businessName: 'Test Company S.A.',
          cuitCuil: '20123456789',
          contactInfo: expect.objectContaining({
            name: 'Juan Test',
            phone: '1234567890',
            email: 'test@test.com',
          }),
        })
      );
    });
  });

  it('should close dialog on cancel', async () => {
    const user = userEvent.setup();
    renderDialog();

    await user.click(screen.getByRole('button', { name: 'Cancelar' }));

    expect(mockOnOpenChange).toHaveBeenCalledWith(false);
  });

  it('should not render when closed', () => {
    renderDialog(false);

    expect(screen.queryByText('Crear Nueva Empresa')).not.toBeInTheDocument();
  });

  it('should have companyCode field enabled in create mode', () => {
    renderDialog();

    expect(screen.getByLabelText(/Código de Empresa/)).not.toBeDisabled();
  });
});
