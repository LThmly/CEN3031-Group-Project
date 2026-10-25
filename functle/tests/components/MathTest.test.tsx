// Example tests for the math logic
import { render, screen, fireEvent, within } from "@testing-library/react";
import MathTest from "@/app/math-test/page";

describe("MathTest Component", () => {
  // Run the component's tests before each assertion
  beforeEach(() => {
    render(<MathTest />);

    fireEvent.click(
      screen.getByRole("button", { name: "Run tests" })
    );
  });

  // Test 1: Arithmetic and order of operations
  test("evaluates arithmetic expressions correctly", () => {
    const row = screen.getByText("2 + 3 * 4").closest("tr");

    expect(row).not.toBeNull();
    expect(within(row!).getByText("14")).toBeInTheDocument();
  });

  // Test 2: Variables and algebraic expressions
  test("evaluates expressions containing variables", () => {
    const row = screen.getByText("x^2 + 2*x - 3").closest("tr");

    expect(row).not.toBeNull();
    expect(within(row!).getByText("5")).toBeInTheDocument();
  });

  // Test 3: Mathematical functions
  test("evaluates trigonometric functions", () => {
    const row = screen.getByText("sin(pi / 2)").closest("tr");

    expect(row).not.toBeNull();
    expect(within(row!).getByText("1")).toBeInTheDocument();
  });

  // Test 4: Invalid expression handling
  test("displays an error for invalid expressions", () => {
    const row = screen.getByText("x +").closest("tr");

    expect(row).not.toBeNull();

    const output = within(row!).getAllByRole("cell")[2];

    expect(output).toHaveTextContent(/^Error:/);
  });
});
