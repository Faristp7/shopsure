import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import SellerLayout from "./layout";

vi.mock("@/components/seller/SellerDashboardLayout", () => ({
  __esModule: true,
  default: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="seller-dashboard-layout">{children}</div>
  ),
}));

describe("SellerLayout", () => {
  it("wraps children with seller dashboard layout", () => {
    render(
      <SellerLayout>
        <span>Seller content</span>
      </SellerLayout>,
    );

    expect(
      screen.getByTestId("seller-dashboard-layout"),
    ).toBeInTheDocument();
    expect(screen.getByText("Seller content")).toBeInTheDocument();
  });
});

