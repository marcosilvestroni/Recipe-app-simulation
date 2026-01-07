import { render, screen, act } from "@testing-library/react";
import { HistoryList } from "./index";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { STORAGE_KEY_HISTORY, HISTORY_UPDATED_EVENT } from "../../constants";
import type { HistoryItem } from "../../types";

describe("HistoryList", () => {
  const mockHistory: HistoryItem[] = [
    {
      id: "1",
      recipeId: "101",
      title: "Pasta",
      image: "http://example.com/pasta.jpg",
      timestamp: new Date("2024-01-01").getTime(),
      liked: true,
      preferences: { area: "Italian", categoryOrIngredient: "Pasta" },
    },
    {
      id: "2",
      recipeId: "102",
      title: "Sushi",
      image: "http://example.com/sushi.jpg",
      timestamp: new Date("2024-01-02").getTime(),
      liked: false,
      preferences: { area: "Japanese", categoryOrIngredient: "Fish" },
    },
  ];

  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  it("renders nothing when history is empty", () => {
    const { container } = render(<HistoryList />);
    expect(container).toBeEmptyDOMElement();
  });

  it("renders history items from localStorage", () => {
    localStorage.setItem(STORAGE_KEY_HISTORY, JSON.stringify(mockHistory));
    render(<HistoryList />);

    expect(screen.getByText("History")).toBeInTheDocument();
    expect(screen.getByText("Pasta")).toBeInTheDocument();
    expect(screen.getByText("Sushi")).toBeInTheDocument();
    expect(screen.getByText("Italian • Pasta")).toBeInTheDocument();
  });

  it("handles corrupted localStorage gracefully", () => {
    localStorage.setItem(STORAGE_KEY_HISTORY, "invalid-json");
    const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});

    const { container } = render(<HistoryList />);
    expect(container).toBeEmptyDOMElement();

    consoleSpy.mockRestore();
  });

  it("updates when HISTORY_UPDATED_EVENT is dispatched", () => {
    render(<HistoryList />);
    expect(screen.queryByText("History")).not.toBeInTheDocument();

    // Update localStorage and dispatch event
    localStorage.setItem(STORAGE_KEY_HISTORY, JSON.stringify(mockHistory));

    act(() => {
      window.dispatchEvent(new Event(HISTORY_UPDATED_EVENT));
    });

    expect(screen.getByText("History")).toBeInTheDocument();
    expect(screen.getByText("Pasta")).toBeInTheDocument();
  });

  it("cleans up event listener on unmount", () => {
    const { unmount } = render(<HistoryList />);
    const removeEventListenerSpy = vi.spyOn(window, "removeEventListener");

    unmount();

    expect(removeEventListenerSpy).toHaveBeenCalledWith(
      HISTORY_UPDATED_EVENT,
      expect.any(Function),
    );
  });
});
