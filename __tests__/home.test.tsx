import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import Home from "@/app/page";

vi.mock("@/components/image-tabs", () => ({
  default: () => <div data-testid="image-tabs-mock">Interactive Preview Tabs</div>,
}));

describe("Landing Page UI & Accessibility - Home", () => {
  it("renders the primary hero heading and value proposition", () => {
    render(<Home />);

    const heading = screen.getByRole("heading", {
      level: 1,
      name: /A better way to track your job applications/i,
    });
    expect(heading).toBeInTheDocument();
  });

  it("renders an accessible primary call-to-action link to sign up", () => {
    render(<Home />);

    const ctaLink = screen.getByRole("link", { name: /Start for free/i });
    expect(ctaLink).toBeInTheDocument();
    expect(ctaLink).toHaveAttribute("href", "/sign-up");
  });

  it("renders all three core feature cards", () => {
    render(<Home />);

    expect(screen.getByText("Organize Applications")).toBeInTheDocument();
    expect(screen.getByText("Track Progress")).toBeInTheDocument();
    expect(screen.getByText("Stay Organized")).toBeInTheDocument();
  });
});
