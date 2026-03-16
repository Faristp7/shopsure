import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import type { UseMutationResult, UseQueryResult } from "@tanstack/react-query";
import SellersClient from "./client";
import { SellerStatus } from "@/types/seller";

// Mock react-query hooks used in the component
vi.mock("@tanstack/react-query", async () => {
  const actual = await vi.importActual<typeof import("@tanstack/react-query")>(
    "@tanstack/react-query",
  );
  return {
    ...actual,
    useQuery: vi.fn(),
    useMutation: vi.fn(),
    useQueryClient: () => new QueryClient(),
  };
});

// Mock SellerDetailsModal to avoid depending on its internal data fetching
vi.mock("./seller-details-modal", () => ({
  __esModule: true,
  SellerDetailsModal: () => null,
}));

const mockedUseQuery = vi.mocked(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (await import("@tanstack/react-query")).useQuery as any,
);
const mockedUseMutation = vi.mocked(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (await import("@tanstack/react-query")).useMutation as any,
);

function renderWithClient(ui: React.ReactNode) {
  const queryClient = new QueryClient();
  return render(
    <QueryClientProvider client={queryClient}>{ui}</QueryClientProvider>,
  );
}

describe("SellersClient", () => {
  beforeEach(() => {
    vi.clearAllMocks();

    mockedUseQuery.mockReturnValue({
      data: { items: [] },
      isLoading: false,
      isError: false,
    } as unknown as UseQueryResult);

    mockedUseMutation.mockReturnValue({
      mutate: vi.fn(),
      isPending: false,
    } as unknown as UseMutationResult);
  });

  it("renders heading and description", () => {
    renderWithClient(<SellersClient />);

    expect(
      screen.getByRole("heading", { name: /sellers/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByText(/manage and monitor seller accounts/i),
    ).toBeInTheDocument();
  });

  it("shows empty state when there are no sellers", () => {
    renderWithClient(<SellersClient />);

    expect(screen.getByText(/no sellers found/i)).toBeInTheDocument();
  });

  it("renders status combobox", () => {
    renderWithClient(<SellersClient />);

    expect(screen.getByRole("combobox")).toBeInTheDocument();
  });

  it("uses PENDING_ADMIN_APPROVAL as initial status", () => {
    renderWithClient(<SellersClient />);

    // The default query key should contain the pending admin approval status
    expect(mockedUseQuery).toHaveBeenCalledWith(
      expect.objectContaining({
        queryKey: expect.arrayContaining([
          "admin-sellers",
          SellerStatus.PENDING_ADMIN_APPROVAL,
        ]),
      }),
    );
  });
});

