/**
 * Tests for useDashboardData hook
 * Testing TanStack Query integration and computed values
 */

import React from "react";
import { renderHook, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useDashboardData } from "./useDashboardData";
import * as dashboardRepo from "@/repositories/dashboard/dashboard";
import * as settingsRepo from "@/repositories/settings/settings";
import * as clientsRepo from "@/repositories/clients/clients";
import type { DashboardStats } from "@/repositories/dashboard/types";
import type { Client, ClientCompany } from "@/repositories/clients/types";
import type { Settings } from "@/repositories/settings/types";

// Mock the repositories
jest.mock("@/repositories/dashboard/dashboard");
jest.mock("@/repositories/settings/settings");
jest.mock("@/repositories/clients/clients");

describe("useDashboardData", () => {
  let queryClient: QueryClient;

  const mockStats: DashboardStats = {
    totalClients: 150,
    totalTransactions: 500,
    totalPointsIssued: 15000,
    recentTransactions: [],
  };

  const mockSettings: Settings = {
    _id: "settings-1",
    companyId: "company-1",
    pointsConfig: [{ productName: "Café", pointsValue: 10, isActive: true }],
    rewards: [
      {
        _id: "r1",
        name: "Café Gratis",
        pointsCost: 100,
        stock: null,
        isActive: true,
      },
    ],
    isActive: true,
    campaignStartDate: "2026-01-01T00:00:00Z",
    campaignEndDate: "2026-12-31T23:59:59Z",
  };

  const mockClients: ClientCompany[] = [
    {
      _id: "cc1",
      companyId: "company-1",
      currentPoints: 100,
      totalAccumulated: 500,
      createdAt: "2026-01-01T00:00:00Z",
      clientId: {
        _id: "c1",
        dni: "11111111",
        name: "Client 1",
        status: "ACTIVE",
      },
    },
    {
      _id: "cc2",
      companyId: "company-1",
      currentPoints: 50,
      totalAccumulated: 200,
      createdAt: "2026-01-01T00:00:00Z",
      clientId: {
        _id: "c2",
        dni: "22222222",
        name: "Client 2",
        status: "ACTIVE",
      },
    },
    {
      _id: "cc3",
      companyId: "company-1",
      currentPoints: 0,
      totalAccumulated: 0,
      createdAt: "2026-01-01T00:00:00Z",
      clientId: {
        _id: "c3",
        dni: "33333333",
        name: "Client 3",
        status: "PENDING",
      },
    },
    {
      _id: "cc4",
      companyId: "company-1",
      currentPoints: 200,
      totalAccumulated: 800,
      createdAt: "2026-01-01T00:00:00Z",
      clientId: {
        _id: "c4",
        dni: "44444444",
        name: "Client 4",
        status: "ACTIVE",
      },
    },
    {
      _id: "cc5",
      companyId: "company-1",
      currentPoints: 0,
      totalAccumulated: 0,
      createdAt: "2026-01-01T00:00:00Z",
      clientId: {
        _id: "c5",
        dni: "55555555",
        name: "Client 5",
        status: "PENDING",
      },
    },
  ];

  beforeEach(() => {
    queryClient = new QueryClient({
      defaultOptions: {
        queries: { retry: false },
      },
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  const wrapper = ({ children }: { children: React.ReactNode }) =>
    React.createElement(QueryClientProvider, { client: queryClient }, children);

  it("should fetch all dashboard data successfully", async () => {
    (dashboardRepo.getDashboardStats as jest.Mock).mockResolvedValue(mockStats);
    (settingsRepo.getSettings as jest.Mock).mockResolvedValue(mockSettings);
    (clientsRepo.getClients as jest.Mock).mockResolvedValue(mockClients);

    const { result } = renderHook(() => useDashboardData(), { wrapper });

    expect(result.current.isLoading).toBe(true);

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.stats).toEqual(mockStats);
    expect(result.current.settings).toEqual(mockSettings);
    expect(result.current.clients).toHaveLength(5);
    expect(result.current.clients[0].status).toBe("ACTIVE");
  });

  it("should compute activeClients correctly", async () => {
    (dashboardRepo.getDashboardStats as jest.Mock).mockResolvedValue(mockStats);
    (settingsRepo.getSettings as jest.Mock).mockResolvedValue(mockSettings);
    (clientsRepo.getClients as jest.Mock).mockResolvedValue(mockClients);

    const { result } = renderHook(() => useDashboardData(), { wrapper });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.activeClients).toBe(3);
  });

  it("should compute shadowClients correctly", async () => {
    (dashboardRepo.getDashboardStats as jest.Mock).mockResolvedValue(mockStats);
    (settingsRepo.getSettings as jest.Mock).mockResolvedValue(mockSettings);
    (clientsRepo.getClients as jest.Mock).mockResolvedValue(mockClients);

    const { result } = renderHook(() => useDashboardData(), { wrapper });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.shadowClients).toBe(2);
  });

  it("should compute conversionRate correctly", async () => {
    (dashboardRepo.getDashboardStats as jest.Mock).mockResolvedValue(mockStats);
    (settingsRepo.getSettings as jest.Mock).mockResolvedValue(mockSettings);
    (clientsRepo.getClients as jest.Mock).mockResolvedValue(mockClients);

    const { result } = renderHook(() => useDashboardData(), { wrapper });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    // 3 active / 5 total = 60%
    expect(result.current.conversionRate).toBe(60);
  });

  it("should handle empty clients list", async () => {
    (dashboardRepo.getDashboardStats as jest.Mock).mockResolvedValue(mockStats);
    (settingsRepo.getSettings as jest.Mock).mockResolvedValue(mockSettings);
    (clientsRepo.getClients as jest.Mock).mockResolvedValue([]);

    const { result } = renderHook(() => useDashboardData(), { wrapper });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.activeClients).toBe(0);
    expect(result.current.shadowClients).toBe(0);
    expect(result.current.conversionRate).toBe(0);
  });

  it("should set error when stats fetch fails", async () => {
    (dashboardRepo.getDashboardStats as jest.Mock).mockRejectedValue(
      new Error("Failed to fetch stats"),
    );
    (settingsRepo.getSettings as jest.Mock).mockResolvedValue(mockSettings);
    (clientsRepo.getClients as jest.Mock).mockResolvedValue(mockClients);

    const { result } = renderHook(() => useDashboardData(), { wrapper });

    await waitFor(() => {
      expect(result.current.error).toBeDefined();
    });

    expect(result.current.stats).toBeNull();
  });

  it("should set error when settings fetch fails", async () => {
    (dashboardRepo.getDashboardStats as jest.Mock).mockResolvedValue(mockStats);
    (settingsRepo.getSettings as jest.Mock).mockRejectedValue(
      new Error("Failed to fetch settings"),
    );
    (clientsRepo.getClients as jest.Mock).mockResolvedValue(mockClients);

    const { result } = renderHook(() => useDashboardData(), { wrapper });

    await waitFor(() => {
      expect(result.current.error).toBeDefined();
    });

    expect(result.current.settings).toBeNull();
  });

  it("should use correct query keys", () => {
    (dashboardRepo.getDashboardStats as jest.Mock).mockResolvedValue(mockStats);
    (settingsRepo.getSettings as jest.Mock).mockResolvedValue(mockSettings);
    (clientsRepo.getClients as jest.Mock).mockResolvedValue(mockClients);

    renderHook(() => useDashboardData(), { wrapper });

    expect(
      queryClient.getQueryState(["admin", "dashboard", "stats"]),
    ).toBeDefined();
    expect(queryClient.getQueryState(["admin", "settings"])).toBeDefined();
    expect(queryClient.getQueryState(["admin", "clients"])).toBeDefined();
  });
});
