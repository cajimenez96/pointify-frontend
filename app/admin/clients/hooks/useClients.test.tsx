import { renderHook, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useClients } from "./useClients";
import { getClients } from "@/repositories/clients/clients";

// Mock repository
jest.mock("@/repositories/clients/clients", () => ({
  getClients: jest.fn(),
}));

// Wrapper for TanStack Query
const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });
  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

describe("useClients Hook", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should return clients data on success", async () => {
    const mockClients = [
      {
        _id: "cc1",
        companyId: "company-1",
        currentPoints: 100,
        totalAccumulated: 200,
        createdAt: "2026-01-01T00:00:00Z",
        clientId: {
          _id: "1",
          dni: "123",
          name: "Client 1",
          status: "ACTIVE",
        },
      },
      {
        _id: "cc2",
        companyId: "company-1",
        currentPoints: 0,
        totalAccumulated: 0,
        createdAt: "2026-01-01T00:00:00Z",
        clientId: {
          _id: "2",
          dni: "456",
          name: "Client 2",
          status: "PENDING",
        },
      },
    ];

    (getClients as jest.Mock).mockResolvedValue(mockClients);

    const { result } = renderHook(() => useClients(), {
      wrapper: createWrapper(),
    });

    // Initial state
    expect(result.current.isLoading).toBe(true);

    // Wait for data
    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(result.current.clients).toEqual([
      {
        _id: "1",
        companyId: "company-1",
        dni: "123",
        name: "Client 1",
        email: undefined,
        phone: undefined,
        currentPoints: 100,
        totalAccumulated: 200,
        status: "ACTIVE",
        isActive: true,
        createdAt: "2026-01-01T00:00:00Z",
        updatedAt: undefined,
      },
      {
        _id: "2",
        companyId: "company-1",
        dni: "456",
        name: "Client 2",
        email: undefined,
        phone: undefined,
        currentPoints: 0,
        totalAccumulated: 0,
        status: "PENDING",
        isActive: false,
        createdAt: "2026-01-01T00:00:00Z",
        updatedAt: undefined,
      },
    ]);
    expect(result.current.error).toBeNull();
  });

  it("should handle errors", async () => {
    const mockError = new Error("Failed to fetch");
    (getClients as jest.Mock).mockRejectedValue(mockError);

    const { result } = renderHook(() => useClients(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(result.current.error).toBeDefined();
    expect(result.current.clients).toEqual([]);
  });
});
