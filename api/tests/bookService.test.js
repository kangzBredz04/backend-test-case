import { borrowBook } from "../domain/services/borrowBookService.js";
import { Book } from "../models/book.js";
import { Member } from "../models/member.js";

jest.mock("../models/book");
jest.mock("../models/member");

describe("borrowBook", () => {
  test("Should borrow book successfully", async () => {
    Member.findOne.mockResolvedValue({
      code: "M001",
      borrowedBooks: [],
      save: jest.fn(),
    });
    Book.findOne.mockResolvedValue({
      code: "B001",
      borrowedBy: null,
      save: jest.fn(),
    });

    const result = await borrowBook("M001", "B001");
    expect(result.success).toBe(true);
  });

  test("Should fail if member is under penalty", async () => {
    Member.findOne.mockResolvedValue({
      code: "M001",
      penalty: true,
      borrowedBooks: [],
    });
    await expect(borrowBook("M001", "B001")).rejects.toThrow(
      "Member is under penalty"
    );
  });
});
