import { ApiError } from "../../utils/api-error";

// -- Configuration --
function getChapaConfig() {
  const secretKey = process.env.CHAPA_SECRET_KEY;
  const baseUrl = process.env.CHAPA_BASE_URL || "https://api.chapa.co/v1";
  const isConfigured = !!secretKey;
  return { secretKey, baseUrl, isConfigured };
}

export function assertChapaConfigured() {
  const { isConfigured } = getChapaConfig();
  if (!isConfigured) {
    throw new ApiError(
      503,
      "Chapa online payment is not configured. Please use Sinqee Bank receipt upload or set CHAPA_SECRET_KEY in the backend environment."
    );
  }
}

export interface ChapaInitializeParams {
  amount: number;
  currency?: string;
  email: string;
  firstName?: string;
  lastName?: string;
  txRef: string;
  callbackUrl?: string;
  returnUrl?: string;
  title?: string;
  description?: string;
}

export interface ChapaInitializeResult {
  checkoutUrl: string;
  txRef: string;
  raw?: any;
}

export interface ChapaVerifyResult {
  success: boolean;
  status: string;
  amount?: number;
  currency?: string;
  txRef: string;
  transactionId?: string;
  raw?: any;
}

// TODO: Adjust response shape once live Chapa API keys are available for testing.
export async function chapaInitializePayment(
  params: ChapaInitializeParams
): Promise<ChapaInitializeResult> {
  const { secretKey, baseUrl, isConfigured } = getChapaConfig();
  if (!isConfigured || !secretKey) {
    throw new ApiError(503, "Chapa is not configured.");
  }

  const response = await fetch(`${baseUrl}/transaction/initialize`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${secretKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      amount: params.amount,
      currency: params.currency || "ETB",
      email: params.email,
      first_name: params.firstName || params.email.split("@")[0],
      last_name: params.lastName || "",
      tx_ref: params.txRef,
      callback_url: params.callbackUrl,
      return_url: params.returnUrl,
      customization: {
        title: params.title || "Kebele House Tax Payment",
        description: params.description || "Tax assessment payment",
      },
    }),
  });

  const data = await response.json() as any;

  if (!response.ok || data.status !== "success") {
    throw new ApiError(
      502,
      `Chapa payment initialization failed: ${data.message || "Unknown error"}`,
      [data]
    );
  }

  return {
    checkoutUrl: data.data?.checkout_url || data.data?.link,
    txRef: params.txRef,
    raw: data,
  };
}

// TODO: Verify exact response shape from Chapa verify endpoint with live keys.
export async function chapaVerifyTransaction(
  txRef: string
): Promise<ChapaVerifyResult> {
  const { secretKey, baseUrl, isConfigured } = getChapaConfig();
  if (!isConfigured || !secretKey) {
    throw new ApiError(503, "Chapa is not configured.");
  }

  const response = await fetch(`${baseUrl}/transaction/verify/${txRef}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${secretKey}`,
    },
  });

  const data = await response.json() as any;

  if (!response.ok) {
    throw new ApiError(
      502,
      `Chapa transaction verification failed: ${data.message || "Unknown error"}`,
      [data]
    );
  }

  const isSuccess = data.status === "success" && data.data?.status === "success";

  return {
    success: isSuccess,
    status: data.data?.status || data.status,
    amount: data.data?.amount,
    currency: data.data?.currency,
    txRef: data.data?.tx_ref || txRef,
    transactionId: data.data?.id || data.data?.chapa_transfer_id,
    raw: data,
  };
}

export function generateTxRef(assessmentId: string): string {
  const shortId = assessmentId.slice(0, 8).toUpperCase();
  const timestamp = Date.now();
  return `KEBELE-${shortId}-${timestamp}`;
}
