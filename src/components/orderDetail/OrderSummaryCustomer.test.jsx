import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import OrderSummaryCustomer from "./OrderSummaryCustomer.jsx";

describe("Testing OrderSummaryCustomer", () => {
  it("CP-OrderSummaryCustomer1: Muestra los datos del cliente y valores por defecto", () => {
    render(
      <OrderSummaryCustomer
        customer="Ash Ketchum"
        customerEmail=""
        customerPhone=""
      />,
    );

    expect(screen.getByText("Ash Ketchum")).toBeInTheDocument();
    expect(screen.getAllByText("No registrado")).toHaveLength(2);
  });
});
