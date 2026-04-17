import { api } from "@services/api/apiClient";
import { subscriptionService } from "@services/api/subscriptionService";

jest.mock("@services/api/apiClient", () => ({
  api: {
    get: jest.fn(),
    post: jest.fn()
  }
}));

const mockApi = api as jest.Mocked<typeof api>;

describe("subscriptionService", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("getSubscription", () => {
    it("calls GET /api/v1/subscription and returns data", async () => {
      const mockData = {
        tier: "premium",
        expires_at: "2027-01-01",
        quota: {
          transactions_used: 10,
          transactions_limit: null,
          scans_used: 5,
          scans_limit: null
        }
      };
      mockApi.get.mockResolvedValueOnce(mockData);

      const result = await subscriptionService.getSubscription();

      expect(mockApi.get).toHaveBeenCalledWith("/api/v1/subscription");
      expect(result).toEqual(mockData);
    });

    it("throws on API error", async () => {
      mockApi.get.mockRejectedValueOnce(new Error("Network error"));
      await expect(subscriptionService.getSubscription()).rejects.toThrow(
        "Network error"
      );
    });
  });

  describe("createInvoice", () => {
    it("calls POST /api/v1/payments/create-invoice with plan", async () => {
      const mockData = {
        payment_url: "https://checkout.xendit.co/abc",
        invoice_id: "cashlens-abc-123",
        expires_at: "2026-04-20"
      };
      mockApi.post.mockResolvedValueOnce(mockData);

      const result = await subscriptionService.createInvoice("annual");

      expect(mockApi.post).toHaveBeenCalledWith(
        "/api/v1/payments/create-invoice",
        { plan: "annual" }
      );
      expect(result).toEqual(mockData);
    });

    it("sends correct plan for monthly", async () => {
      mockApi.post.mockResolvedValueOnce({});
      await subscriptionService.createInvoice("monthly");
      expect(mockApi.post).toHaveBeenCalledWith(
        "/api/v1/payments/create-invoice",
        { plan: "monthly" }
      );
    });
  });

  describe("verifySubscription", () => {
    it("calls POST /api/v1/subscription/verify with invoice_id", async () => {
      mockApi.post.mockResolvedValueOnce({});

      await subscriptionService.verifySubscription("cashlens-abc-123");

      expect(mockApi.post).toHaveBeenCalledWith("/api/v1/subscription/verify", {
        invoice_id: "cashlens-abc-123"
      });
    });

    it("throws on verify error", async () => {
      mockApi.post.mockRejectedValueOnce(
        new Error("payment status is PENDING")
      );
      await expect(
        subscriptionService.verifySubscription("cashlens-abc-123")
      ).rejects.toThrow("payment status is PENDING");
    });
  });
});
