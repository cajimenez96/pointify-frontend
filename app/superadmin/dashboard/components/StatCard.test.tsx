/**
 * Tests for StatCard component
 */

import { render, screen } from "@testing-library/react";
import { StatCard } from "./StatCard";

describe("StatCard", () => {
  const defaultProps = {
    title: "Total Companies",
    value: 10,
    icon: "🏢",
    color: "from-blue-500 to-blue-600",
  };

  it("should render with required props", () => {
    render(<StatCard {...defaultProps} />);

    expect(screen.getByText("Total Companies")).toBeInTheDocument();
    expect(screen.getByText("10")).toBeInTheDocument();
    expect(screen.getByText("🏢")).toBeInTheDocument();
  });

  it("should render string values", () => {
    render(<StatCard {...defaultProps} value="150" />);

    expect(screen.getByText("150")).toBeInTheDocument();
  });

  it("should render numeric values", () => {
    render(<StatCard {...defaultProps} value={250} />);

    expect(screen.getByText("250")).toBeInTheDocument();
  });

  it("should render subtitle when provided", () => {
    render(<StatCard {...defaultProps} subtitle="+5 this month" />);

    expect(screen.getByText("+5 this month")).toBeInTheDocument();
  });

  it("should not render subtitle when not provided", () => {
    render(<StatCard {...defaultProps} />);

    expect(screen.queryByText(/this month/i)).not.toBeInTheDocument();
  });

  it("should apply correct color classes", () => {
    const { container } = render(<StatCard {...defaultProps} />);

    const iconContainer = container.querySelector(".bg-gradient-to-br");
    expect(iconContainer).toHaveClass("from-blue-500");
    expect(iconContainer).toHaveClass("to-blue-600");
  });

  it("should render with different colors", () => {
    const { container } = render(
      <StatCard {...defaultProps} color="from-green-500 to-green-600" />,
    );

    const iconContainer = container.querySelector(".bg-gradient-to-br");
    expect(iconContainer).toHaveClass("from-green-500");
    expect(iconContainer).toHaveClass("to-green-600");
  });

  it("should have correct styling classes", () => {
    const { container } = render(<StatCard {...defaultProps} />);

    // Check main card styling
    expect(container.querySelector(".bg-slate-800")).toBeInTheDocument();
    expect(container.querySelector(".border-slate-700")).toBeInTheDocument();

    // Check title styling
    const title = screen.getByText("Total Companies");
    expect(title).toHaveClass("text-slate-400", "text-sm");

    // Check value styling
    const value = screen.getByText("10");
    expect(value).toHaveClass("text-3xl", "font-bold", "text-white");
  });

  it("should render icon in correct container", () => {
    render(<StatCard {...defaultProps} />);

    const icon = screen.getByText("🏢");
    const iconContainer = icon.closest(".w-14");

    expect(iconContainer).toHaveClass(
      "w-14",
      "h-14",
      "rounded-lg",
      "flex",
      "items-center",
      "justify-center",
    );
  });
});
