import { act, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { HeroCarousel } from "./HeroCarousel.jsx";

const bootstrapMock = vi.hoisted(() => ({
  getOrCreateInstance: vi.fn(() => ({
    dispose: vi.fn(),
  })),
}));

vi.mock("bootstrap/js/dist/carousel", () => ({
  __esModule: true,
  default: {
    getOrCreateInstance: (...args) => bootstrapMock.getOrCreateInstance(...args),
  },
}));

describe("Testing HeroCarousel", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    bootstrapMock.getOrCreateInstance.mockClear();
  });

  it("CP-HeroCarousel1: Renderiza slides y activa bootstrap cuando hay elementos", () => {
    const slides = [
      { src: "/img/1.png", alt: "Slide 1" },
      { src: "/img/2.png", alt: "Slide 2" },
    ];

    render(<HeroCarousel slides={slides} interval={2000} />);

    expect(screen.getByAltText("Slide 1")).toBeInTheDocument();
    expect(screen.getByAltText("Slide 2")).toBeInTheDocument();
    expect(bootstrapMock.getOrCreateInstance).toHaveBeenCalledTimes(1);
    expect(bootstrapMock.getOrCreateInstance).toHaveBeenCalledWith(
      expect.any(HTMLElement),
      expect.objectContaining({ interval: 2000, ride: "carousel" }),
    );
  });

  it("CP-HeroCarousel2: Omite inicialización si no hay slides", () => {
    render(<HeroCarousel slides={[]} />);

    expect(bootstrapMock.getOrCreateInstance).not.toHaveBeenCalled();
  });

  it("CP-HeroCarousel3: Limpia la instancia al desmontar", () => {
    const slides = [{ src: "/img/1.png", alt: "Slide 1" }];
    const dispose = vi.fn();
    bootstrapMock.getOrCreateInstance.mockReturnValueOnce({ dispose });

    const { unmount } = render(<HeroCarousel slides={slides} />);

    expect(bootstrapMock.getOrCreateInstance).toHaveBeenCalledTimes(1);

    act(() => {
      unmount();
    });

    expect(dispose).toHaveBeenCalledTimes(1);
  });
});
