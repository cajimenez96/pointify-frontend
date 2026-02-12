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
      { _id: "1", name: "Client 1", dni: "123", status: "ACTIVE" },
      { _id: "2", name: "Client 2", dni: "456", status: "PENDING" },
    ];

    (getClients as jest.Mock).mockResolvedValue(mockClients);

    const { result } = renderHook(() => useClients(), {
      wrapper: createWrapper(),
    });

    // Initial state
    expect(result.current.isLoading).toBe(true);

    // Wait for data
    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(result.current.clients).toEqual(mockClients);
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
