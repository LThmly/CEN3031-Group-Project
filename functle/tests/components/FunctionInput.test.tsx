
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";

import FunctionInput from "@/components/FunctionInput";

describe("FunctionInput Component", () => {
  const mockSubmit = jest.fn();

  beforeEach(() => {
    mockSubmit.mockClear();

    // Prevent animation callbacks from interfering with
    // cursor-related tests in JSDOM.
    jest.spyOn(window, "requestAnimationFrame")
      .mockImplementation(() => 1);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  test("renders the input and calculator buttons", () => {
    render(<FunctionInput onSubmit={mockSubmit} />);

    expect(
      screen.getByRole("textbox", { name: "Function" })
    ).toBeInTheDocument();

    expect(
      screen.getByRole("button", { name: "Enter" })
    ).toBeInTheDocument();

    expect(
      screen.getByRole("button", { name: "Clear" })
    ).toBeInTheDocument();

    expect(
      screen.getByRole("button", { name: "Backspace" })
    ).toBeInTheDocument();
  });

  test("allows typing mathematical expressions", () => {
    render(<FunctionInput onSubmit={mockSubmit} />);

    const input = screen.getByRole("textbox", {
      name: "Function",
    });

    fireEvent.change(input, {
      target: { value: "x^2 + 3*x" },
    });

    expect(input).toHaveValue("x^2 + 3*x");
  });

  test("submits expression when Enter button is clicked", () => {
    render(<FunctionInput onSubmit={mockSubmit} />);

    const input = screen.getByRole("textbox", {
      name: "Function",
    });

    fireEvent.change(input, {
      target: { value: "x^2 + 3" },
    });

    fireEvent.click(
      screen.getByRole("button", { name: "Enter" })
    );

    expect(mockSubmit).toHaveBeenCalledTimes(1);
    expect(mockSubmit).toHaveBeenCalledWith("x^2 + 3");
  });

  test("submits expression when keyboard Enter is pressed", () => {
    render(<FunctionInput onSubmit={mockSubmit} />);

    const input = screen.getByRole("textbox", {
      name: "Function",
    });

    fireEvent.change(input, {
      target: { value: "sin(x)" },
    });

    fireEvent.keyDown(input, {
      key: "Enter",
      code: "Enter",
    });

    expect(mockSubmit).toHaveBeenCalledTimes(1);
    expect(mockSubmit).toHaveBeenCalledWith("sin(x)");
  });

  test("does not submit when another key is pressed", () => {
    render(<FunctionInput onSubmit={mockSubmit} />);

    const input = screen.getByRole("textbox", {
      name: "Function",
    });

    fireEvent.change(input, {
      target: { value: "x^2" },
    });

    fireEvent.keyDown(input, {
      key: "a",
      code: "KeyA",
    });

    expect(mockSubmit).not.toHaveBeenCalled();
  });

  test("does not submit while typing", () => {
    render(<FunctionInput onSubmit={mockSubmit} />);

    fireEvent.change(
      screen.getByRole("textbox", { name: "Function" }),
      { target: { value: "x^3" } }
    );

    expect(mockSubmit).not.toHaveBeenCalled();
  });

  test("calculator buttons insert characters", () => {
    render(<FunctionInput onSubmit={mockSubmit} />);

    const input = screen.getByRole("textbox", {
      name: "Function",
    }) as HTMLInputElement;

    input.focus();

    fireEvent.click(
      screen.getByRole("button", { name: "7" })
    );

    expect(input).toHaveValue("7");
  });

  test("calculator buttons insert at cursor position", () => {
    render(<FunctionInput onSubmit={mockSubmit} />);

    const input = screen.getByRole("textbox", {
      name: "Function",
    }) as HTMLInputElement;

    fireEvent.change(input, {
      target: { value: "x+2" },
    });

    input.focus();
    input.setSelectionRange(2, 2);

    fireEvent.click(
      screen.getByRole("button", { name: "3" })
    );

    expect(input).toHaveValue("x+32");
  });

  test("calculator buttons replace selected text", () => {
    render(<FunctionInput onSubmit={mockSubmit} />);

    const input = screen.getByRole("textbox", {
      name: "Function",
    }) as HTMLInputElement;

    fireEvent.change(input, {
      target: { value: "x+5" },
    });

    input.focus();
    input.setSelectionRange(2, 3);

    fireEvent.click(
      screen.getByRole("button", { name: "7" })
    );

    expect(input).toHaveValue("x+7");
  });

  test("backspace removes character before cursor", () => {
    render(<FunctionInput onSubmit={mockSubmit} />);

    const input = screen.getByRole("textbox", {
      name: "Function",
    }) as HTMLInputElement;

    fireEvent.change(input, {
      target: { value: "x+3" },
    });

    input.focus();
    input.setSelectionRange(3, 3);

    fireEvent.click(
      screen.getByRole("button", { name: "Backspace" })
    );

    expect(input).toHaveValue("x+");
  });

  test("clear button empties the input", () => {
    render(<FunctionInput onSubmit={mockSubmit} />);

    const input = screen.getByRole("textbox", {
      name: "Function",
    });

    fireEvent.change(input, {
      target: { value: "x^2 + 5" },
    });

    fireEvent.click(
      screen.getByRole("button", { name: "Clear" })
    );

    expect(input).toHaveValue("");
  });
});
