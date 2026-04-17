import { useProtectedRouter } from "@hooks/useProtectedRouter";
import { act, renderHook } from "@testing-library/react-hooks";

const mockPush = jest.fn();
const mockReplace = jest.fn();
const mockBack = jest.fn();

jest.mock("expo-router", () => ({
  useRouter: () => ({
    push: mockPush,
    replace: mockReplace,
    back: mockBack
  })
}));

beforeEach(() => {
  jest.clearAllMocks();
  jest.useFakeTimers();
});

afterEach(() => {
  jest.useRealTimers();
});

describe("useProtectedRouter", () => {
  it("calls push on first invocation", () => {
    const { result } = renderHook(() => useProtectedRouter());
    act(() => {
      result.current.push("/some-route" as never);
    });
    expect(mockPush).toHaveBeenCalledTimes(1);
    expect(mockPush).toHaveBeenCalledWith("/some-route");
  });

  it("blocks second push within 500ms", () => {
    const { result } = renderHook(() => useProtectedRouter());
    act(() => {
      result.current.push("/route-a" as never);
      result.current.push("/route-b" as never);
    });
    expect(mockPush).toHaveBeenCalledTimes(1);
    expect(mockPush).toHaveBeenCalledWith("/route-a");
  });

  it("allows push again after 500ms", () => {
    const { result } = renderHook(() => useProtectedRouter());
    act(() => {
      result.current.push("/route-a" as never);
    });
    act(() => {
      jest.advanceTimersByTime(500);
    });
    act(() => {
      result.current.push("/route-b" as never);
    });
    expect(mockPush).toHaveBeenCalledTimes(2);
    expect(mockPush).toHaveBeenNthCalledWith(1, "/route-a");
    expect(mockPush).toHaveBeenNthCalledWith(2, "/route-b");
  });

  it("blocks second replace within 500ms", () => {
    const { result } = renderHook(() => useProtectedRouter());
    act(() => {
      result.current.replace("/route-a" as never);
      result.current.replace("/route-b" as never);
    });
    expect(mockReplace).toHaveBeenCalledTimes(1);
  });

  it("always passes back() through without guarding", () => {
    const { result } = renderHook(() => useProtectedRouter());
    act(() => {
      result.current.back();
      result.current.back();
    });
    expect(mockBack).toHaveBeenCalledTimes(2);
  });
});
