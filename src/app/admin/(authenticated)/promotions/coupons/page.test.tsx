import { beforeEach, describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import type { UseMutationResult, UseQueryResult } from "@tanstack/react-query";
import AdminCouponsPage from "./page";

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

vi.mock("@/hooks/use-toast", () => ({
  useToast: () => ({
    toast: vi.fn(),
  }),
}));

const mockedUseQuery = vi.mocked(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (await import("@tanstack/react-query")).useQuery as any,
);
const mockedUseMutation = vi.mocked(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (await import("@tanstack/react-query")).useMutation as any,
);

function renderWithClient() {
  const queryClient = new QueryClient();
  return render(
    <QueryClientProvider client={queryClient}>
      <AdminCouponsPage />
    </QueryClientProvider>,
  );
}

describe("AdminCouponsPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();

    mockedUseQuery.mockReturnValue({
      data: {
        items: [
          {
            id: "coupon-1",
            code: "WELCOME10",
            name: "Welcome Offer",
            description: "For first-time orders",
            type: "PERCENTAGE",
            value: 10,
            minimumOrderValue: 1000,
            usageLimit: 100,
            usedCount: 5,
            startsAt: null,
            expiresAt: null,
            isActive: true,
            status: "ACTIVE",
            orderCount: 5,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            deletedAt: null,
          },
        ],
        meta: { total: 1, page: 1, limit: 50, totalPages: 1 },
      },
      isLoading: false,
    } as unknown as UseQueryResult);

    mockedUseMutation.mockReturnValue({
      mutate: vi.fn(),
      isPending: false,
    } as unknown as UseMutationResult);
  });

  it("renders the coupon management table", () => {
    renderWithClient();

    expect(screen.getByRole("heading", { name: /coupons/i })).toBeInTheDocument();
    expect(screen.getByText(/welcome10/i)).toBeInTheDocument();
    expect(screen.getByText(/manage coupons/i)).toBeInTheDocument();
  });

  it("opens the create dialog", () => {
    renderWithClient();

    fireEvent.click(screen.getByRole("button", { name: /new coupon/i }));

    expect(screen.getByRole("dialog")).toBeInTheDocument();
    expect(screen.getByText(/validation preview/i)).toBeInTheDocument();
  });
});
