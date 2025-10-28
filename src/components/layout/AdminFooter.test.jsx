import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import AdminFooter from "./AdminFooter.jsx";

describe("Testing AdminFooter", () => {
  it("CP-AdminFooter1: Muestra el año actual y el mensaje", () => {
    const yearSpy = vi.spyOn(Date.prototype, "getFullYear").mockReturnValue(2025);

    render(<AdminFooter />);
    expect(
      screen.getByText(/Poké Mart © 2025/, { exact: false }),
    ).toBeInTheDocument();

    yearSpy.mockRestore();
  });
});
