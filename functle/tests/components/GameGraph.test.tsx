    import { render, screen } from "@testing-library/react";
    import "@testing-library/jest-dom";
    import { Children, isValidElement } from "react";
    import type { Graphics } from "pixi.js";

    import GameGraph from "@/components/GameGraph";

    const mockApplication = jest.fn();
    interface GraphicsLayerProps {
    draw: (graphics: Graphics) => void;
    }



    // Mock PixiJS to avoid ESM dependency errors
    jest.mock("pixi.js", () => ({
    Graphics: class MockGraphics {},
    Text: class MockText {},
    }));

    // Capture the Application's children without rendering them
    jest.mock("@pixi/react", () => ({
    Application: (props: { children: React.ReactNode }) => {
        mockApplication(props);

        return <div data-testid="pixi-application" />;
    },
    extend: jest.fn(),
    }));


    describe("GameGraph Component", () => {
        beforeEach(() => {
            mockApplication.mockClear();
        });

    test("renders PixiJS application", () => {
        render(<GameGraph />);

        expect(
        screen.getByTestId("pixi-application")
        ).toBeInTheDocument();
    });

    test("renders the graph container", () => {
        const { container } = render(<GameGraph />);

        expect(
        container.querySelector(".game-graph")
        ).toBeInTheDocument();
    });

    test("creates three graphics layers", () => {
        render(<GameGraph />);

        expect(mockApplication).toHaveBeenCalled();

        const props = mockApplication.mock.calls.at(-1)![0];

        const layers = Children.toArray(props.children);

        expect(layers).toHaveLength(3);

        // Verify all three are PixiJS graphics elements
        layers.forEach((layer) => {
            expect(isValidElement(layer)).toBe(true);

            if (isValidElement(layer)) {
            expect(layer.type).toBe("pixiGraphics");
            }
        });
    });

    test("renders without points or obstacles", () => {
        expect(() =>
        render(<GameGraph points={[]} obstacles={[]} />)
        ).not.toThrow();
    });

    test("updates drawing callback when graph points change", () => {
    const { rerender } = render(
        <GameGraph points={[]} obstacles={[]} />
    );

    // Get the initial line-drawing callback
    const initialProps = mockApplication.mock.calls.at(-1)![0];
    const initialLayers = Children.toArray(initialProps.children);

    const initialLineLayer = initialLayers[1];

    expect(isValidElement(initialLineLayer)).toBe(true);

    if (!isValidElement<GraphicsLayerProps>(initialLineLayer)) {
        throw new Error("Invalid graphics layer");
    }

    const initialDraw = initialLineLayer.props.draw;

    const points = [
        { x: 100, y: 200 },
        { x: 150, y: 250 },
    ];

    rerender(
        <GameGraph points={points} obstacles={[]} />
    );

    // Get the updated line-drawing callback
    const updatedProps = mockApplication.mock.calls.at(-1)![0];
    const updatedLayers = Children.toArray(updatedProps.children);

    const updatedLineLayer = updatedLayers[1];

        if (!isValidElement<GraphicsLayerProps>(updatedLineLayer)) {
        throw new Error("Invalid graphics layer");
        }

    const updatedDraw = updatedLineLayer.props.draw;

    // A new points array should create a new callback
    expect(updatedDraw).not.toBe(initialDraw);
    });
    });
