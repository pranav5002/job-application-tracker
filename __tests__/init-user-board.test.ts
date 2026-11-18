import { describe, it, expect, vi, beforeEach } from "vitest";
import { initializeUserBoard } from "@/lib/init-user-board";
import connectDB from "@/lib/db";
import { Board, Column } from "@/lib/models";

vi.mock("@/lib/db", () => ({
  default: vi.fn().mockResolvedValue(true),
}));

vi.mock("@/lib/models", () => ({
  Board: {
    findOne: vi.fn(),
    create: vi.fn(),
  },
  Column: {
    create: vi.fn(),
  },
}));

describe("Board Initialization Logic - initializeUserBoard()", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns existing 'Job Hunt' board without duplicating columns", async () => {
    const mockExistingBoard = { _id: "board_123", name: "Job Hunt", userId: "user_1" };
    vi.mocked(Board.findOne).mockResolvedValue(mockExistingBoard as any);

    const result = await initializeUserBoard("user_1");

    expect(connectDB).toHaveBeenCalledTimes(1);
    expect(Board.findOne).toHaveBeenCalledWith({ userId: "user_1", name: "Job Hunt" });
    expect(Board.create).not.toHaveBeenCalled();
    expect(result).toEqual(mockExistingBoard);
  });

  it("creates a new 'Job Hunt' board with all 5 default Kanban columns for new users", async () => {
    vi.mocked(Board.findOne).mockResolvedValue(null);

    const mockSave = vi.fn().mockResolvedValue(true);
    const mockNewBoard = {
      _id: "board_new",
      name: "Job Hunt",
      userId: "user_2",
      columns: [],
      save: mockSave,
    };
    vi.mocked(Board.create).mockResolvedValue(mockNewBoard as any);

    vi.mocked(Column.create).mockImplementation(async (data: any) => ({
      _id: `col_${data.order}`,
      ...data,
    }) as any);

    const result = await initializeUserBoard("user_2");

    expect(Board.create).toHaveBeenCalledWith({
      name: "Job Hunt",
      userId: "user_2",
      columns: [],
    });
    expect(Column.create).toHaveBeenCalledTimes(5);
    expect(Column.create).toHaveBeenNthCalledWith(1, expect.objectContaining({ name: "Wish List", order: 0 }));
    expect(Column.create).toHaveBeenNthCalledWith(2, expect.objectContaining({ name: "Applied", order: 1 }));
    expect(Column.create).toHaveBeenNthCalledWith(3, expect.objectContaining({ name: "Interviewing", order: 2 }));
    expect(Column.create).toHaveBeenNthCalledWith(4, expect.objectContaining({ name: "Offer", order: 3 }));
    expect(Column.create).toHaveBeenNthCalledWith(5, expect.objectContaining({ name: "Rejected", order: 4 }));
    expect(mockSave).toHaveBeenCalledTimes(1);
    expect(result.columns).toHaveLength(5);
  });

  it("propagates database connection errors safely", async () => {
    vi.mocked(connectDB).mockRejectedValueOnce(new Error("Database connection failed"));

    await expect(initializeUserBoard("user_err")).rejects.toThrow("Database connection failed");
  });
});
