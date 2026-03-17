# Finverse API - TypeScript SDK

This SDK enables end-to-end backend integration with the Finverse API, including API authentication, institution linking, data retrieval, and payment operations.

## Installation

```
npm install @finverse/sdk-typescript
```

## API Overview

The SDK is organized into two main API categories:

| API | Purpose |
|-----|---------|
| **Payment API** | Create payment links, mandates, payments, and manage payment accounts |
| **Data API** | Retrieve accounts, transactions, statements, balance history, and identity data |

Both APIs share authentication and linking flows via `PublicApi` and `LinkApi`.

---

## Payment API

The Payment API enables you to create payment links for checkout, initiate payments, manage mandates, and handle payment-related operations.

### Key Classes & Methods

| Class | Key Methods |
|-------|-------------|
| `CustomerApi` | `createPayment`, `getPayment`, `createMandate`, `getMandate`, `authorizeMandate`, `createPaymentUser`, `createPaymentAccount`, `listPaymentAccounts` |
| `DefaultApi` | `createPaymentLink`, `getPaymentLink`, `cancelPaymentLink`, `createScheduledPayout`, `getPayoutById`, `createPaymentMethod` |

### Payment Flow (End-to-End)

The payment link flow: **Create** → **Redirect** → **Callback** → **Poll** → **Result**.

1. **Create** – Create payment link via API, get `url` and `payment_link_id`. Save both and `unique_reference_id`.
2. **Redirect** – Redirect user to the payment link URL (use HTTP 303 so the redirect is followed with GET).
3. **Callback** – Finverse redirects back with `payment_link_id` and `unique_reference_id` query params. Verify they match what you stored.
4. **Poll** – Poll `GET /payment_links/{paymentLinkId}` every 2 seconds for up to 30 seconds until `session_status` is `"COMPLETE"`.
5. **Result** – If `COMPLETE` → success; otherwise → error.

> **Security:** `FINVERSE_CLIENT_ID` and `FINVERSE_CLIENT_SECRET` must **never** be committed to git or sent to the frontend. Use them only on the server (e.g. environment variables, secrets manager).

#### 1. Authenticate: Obtain Customer Access Token

```typescript
import { Configuration, PublicApi } from '@finverse/sdk-typescript';

const apiHost = process.env.FINVERSE_BASE_URL ?? "https://api.prod.finverse.net";
const clientId = process.env.FINVERSE_CLIENT_ID;
const clientSecret = process.env.FINVERSE_CLIENT_SECRET;

const configuration = new Configuration({ basePath: apiHost });
const customerTokenResp = await new PublicApi(configuration).generateCustomerAccessToken({
  client_id: clientId,
  client_secret: clientSecret,
  grant_type: 'client_credentials',
});

const customerAccessToken = customerTokenResp.data.access_token;
// Cache the token; refresh before expiry (use expires_in minus 60s buffer)
```

#### 2. Create Payment Link

**Payment mode** – For one-time payments. Requires `amount` (minor units, e.g. 10000 = 100.00 HKD), `currency`, `sender`, `payment_details`, and `link_customizations` with `redirect_uri`:

```typescript
import { DefaultApi } from '@finverse/sdk-typescript';
import crypto from 'crypto';

const configuration = new Configuration({
  basePath: apiHost,
  accessToken: customerAccessToken,
});
const defaultApi = new DefaultApi(configuration);

const uniqueReferenceId = crypto.randomUUID();
const callbackUrl = process.env.CALLBACK_URL; // e.g. https://yoursite.com/callback

const createResp = await defaultApi.createPaymentLink({
  mode: "PAYMENT",
  amount: 10000,  // 100.00 HKD
  currency: "HKD",
  unique_reference_id: uniqueReferenceId,
  sender: {
    external_user_id: "your-internal-user-id",
    name: "Customer Name",
    email: "customer@example.com",
  },
  payment_details: {
    description: "Order #12345",
    external_transaction_reference: "order-12345",  // max 35 chars
  },
  link_customizations: {
    ui_mode: "redirect",
    redirect_uri: callbackUrl,
  },
});

const paymentLinkId = createResp.data.payment_link_id;
const paymentUrl = createResp.data.url;

// Store paymentLinkId and uniqueReferenceId for callback verification
```

**Setup mode** – For saving payment methods (e.g. Click to Pay). Do **not** pass `amount`:

```typescript
const createResp = await defaultApi.createPaymentLink({
  mode: "SETUP",
  currency: "HKD",
  unique_reference_id: uniqueReferenceId,
  sender: {
    external_user_id: "your-internal-user-id",
    name: "Customer Name",
    email: "customer@example.com",
  },
  payment_details: {
    description: "Save payment method",
    external_transaction_reference: "setup-12345",
  },
  link_customizations: {
    ui_mode: "redirect",
    redirect_uri: callbackUrl,
  },
  payment_setup_options: {
    future_payments: "CLICK_TO_PAY",
  },
});
```

#### 3. Redirect User to Payment URL

Redirect the user to `paymentUrl`. **Use HTTP 303** so the browser follows with GET (Finverse expects GET):


#### 4. Callback Handler: Poll for Completion

When Finverse redirects back, read `payment_link_id` and `unique_reference_id` from query params. Verify they match your stored values, then poll until `session_status` is `COMPLETE`:

```typescript
import { DefaultApi } from '@finverse/sdk-typescript';

const paymentLinkId = req.query.payment_link_id as string;  // from callback URL
const uniqueReferenceId = req.query.unique_reference_id as string;

// Verify uniqueReferenceId matches what you stored
// if (uniqueReferenceId !== storedUniqueReferenceId) { return error; }

const configuration = new Configuration({
  basePath: apiHost,
  accessToken: customerAccessToken,
});
const defaultApi = new DefaultApi(configuration);

const POLL_INTERVAL_MS = 2000;
const POLL_TIMEOUT_MS = 30000;
const startTime = Date.now();

while (Date.now() - startTime < POLL_TIMEOUT_MS) {
  const getResp = await defaultApi.getPaymentLink(paymentLinkId);
  const sessionStatus = getResp.data.session_status;

  if (sessionStatus === "COMPLETE") {
    // Success – redirect to success page
    // Log getResp.data.payment for payment details
    break;
  }

  await new Promise((resolve) => setTimeout(resolve, POLL_INTERVAL_MS));
}

// If loop ended without COMPLETE → timeout, show error page
```

---

## Data API

The Data API enables you to retrieve financial data: accounts, transactions, statements, balance history, identity, and income estimates.

### Key Classes & Methods

| Class | Key Methods |
|-------|-------------|
| `LoginIdentityApi` | `getLoginIdentity`, `listAccounts`, `getAccount`, `getAccountNumber`, `listTransactionsByLoginIdentityId`, `listTransactionsByAccountId`, `getStatements`, `getStatement`, `getBalanceHistory`, `getIdentity`, `getIncomeEstimateByLoginIdentityId`, `listCardDetails`, ` refreshLoginIdentity` |

### Data Retrieval Flow (End-to-End)

#### 1. Authenticate: Obtain Customer Access Token

```typescript
import { Configuration, PublicApi } from '@finverse/sdk-typescript';

const apiHost = "https://api.prod.finverse.net";
const clientId = process.env.FINVERSE_CLIENTID;
const clientSecret = process.env.FINVERSE_SECRET;
const redirectUri = process.env.REDIRECT_URI;

const configuration = new Configuration({ basePath: apiHost });
const customerTokenResp = await new PublicApi(configuration).generateCustomerAccessToken({
  client_id: clientId,
  client_secret: clientSecret,
  grant_type: 'client_credentials',
});

const customerAccessToken = customerTokenResp.data.access_token;
```

#### 2. Link New Institution: Obtain Link Token and Link URL

```typescript
import { CustomerApi } from '@finverse/sdk-typescript';

const userId = "someUserId";
const state = "someUniqueState";
const linkConfig = new Configuration({
  basePath: apiHost,
  accessToken: customerAccessToken,
});
const linkTokenResp = await new CustomerApi(linkConfig).generateLinkToken({
  client_id: clientId,
  user_id: userId,
  redirect_uri: redirectUri,
  state: state,
  response_mode: "form_post",
  response_type: "code",
  grant_type: "client_credentials",
});

console.log("linkUrl:", linkTokenResp.data.link_url);
```

#### 3. Finalize Linking: Exchange Code for Login Identity Access Token

```typescript
import { LinkApi } from '@finverse/sdk-typescript';

const code = "obtainAfterLink"; // from Finverse Link UI callback
const loginIdentityTokenResp = await new LinkApi(linkConfig).token(
  "authorization_code",
  code,
  clientId,
  redirectUri,
);
const loginIdentityToken = loginIdentityTokenResp.data.access_token;
```

#### 4. Retrieve data: Get Login Identity

```typescript
import { LoginIdentityApi } from '@finverse/sdk-typescript';

const dataConfig = new Configuration({
  basePath: apiHost,
  accessToken: loginIdentityToken,
});
const loginIdentityResp = await new LoginIdentityApi(dataConfig).getLoginIdentity();
console.log("login identity:", loginIdentityResp.data.login_identity);
```

#### 5. Poll Login Identity Status Until Ready

```typescript
import type { AxiosResponse } from 'axios';
import type { GetLoginIdentityByIdResponse } from '@finverse/sdk-typescript';

enum FinalStatus {
  ERROR = 'ERROR',
  DATA_RETRIEVAL_PARTIALLY_SUCCESSFUL = 'DATA_RETRIEVAL_PARTIALLY_SUCCESSFUL',
  DATA_RETRIEVAL_COMPLETE = 'DATA_RETRIEVAL_COMPLETE',
}

let loginIdentity: AxiosResponse<GetLoginIdentityByIdResponse>;
for (let i = 0; i < 20; i++) {
  loginIdentity = await new LoginIdentityApi(dataConfig).getLoginIdentity();
  const status = loginIdentity.data.login_identity.status;
  if (
    status === FinalStatus.ERROR ||
    status === FinalStatus.DATA_RETRIEVAL_COMPLETE ||
    status === FinalStatus.DATA_RETRIEVAL_PARTIALLY_SUCCESSFUL
  ) {
    break;
  }
  await new Promise((resolve) => setTimeout(resolve, 3000));
}
```

#### 6. Get Accounts

```typescript
const accountsResp = await new LoginIdentityApi(dataConfig).listAccounts();
console.log("accounts:", accountsResp.data.accounts);
```

#### 7. Get Transactions (with pagination)

```typescript
let offset = 0;
while (true) {
  const transactionsResp = await new LoginIdentityApi(dataConfig).listTransactionsByLoginIdentityId(
    offset,
    500  // limit: default 500, max 1000
  );
  const transactions = transactionsResp.data.transactions ?? [];
  console.log(`total: ${transactionsResp.data.total_transactions}, transactions: ${transactions.length}`);
  offset += transactions.length;
  if (offset >= transactionsResp.data.total_transactions) {
    break;
  }
}
```

#### 8. Get Statements

```typescript
import { writeFileSync } from 'fs';

const statementsResp = await new LoginIdentityApi(dataConfig).getStatements();
const statements = statementsResp.data.statements ?? [];
console.log("statements:", statements);

// Download a statement (assuming at least one exists)
const statementId = statements[0].id;
const statementResp = await new LoginIdentityApi(dataConfig).getStatement(
  statementId,
  true,
  { responseType: "arraybuffer" }
);
writeFileSync("statement.pdf", Buffer.from(statementResp.data));
```

---

## Best Practices

### Use async/await

All SDK methods return Promises. Use `async/await` for cleaner, readable code and to avoid callback hell:

```typescript
async function fetchAccounts() {
  const config = new Configuration({ basePath: apiHost, accessToken: token });
  const response = await new LoginIdentityApi(config).listAccounts();
  return response.data.accounts;
}
```

### Handle API responses correctly

API methods return Axios `AxiosResponse` objects. Access the payload via `.data`:

```typescript
const tokenResp = await new PublicApi(config).generateCustomerAccessToken({ ... });
const accessToken = tokenResp.data.access_token;  // Correct: use .data

const accountsResp = await new LoginIdentityApi(config).listAccounts();
const accounts = accountsResp.data.accounts;  // Correct: use .data
```

### Use exported types and interfaces

Leverage the SDK's exported types for type safety and better IDE support:

```typescript
import type {
  Account,
  CreatePaymentRequest,
  GetLoginIdentityByIdResponse,
} from '@finverse/sdk-typescript';

const paymentRequest: CreatePaymentRequest = {
  // ...
};
```

### Handle errors with try/catch

Wrap API calls in try/catch blocks. API errors are returned as HTTP error responses; the SDK may throw on network failures or validation errors:

```typescript
import axios from 'axios';

try {
  const response = await new LoginIdentityApi(config).listAccounts();
  return response.data.accounts;
} catch (error) {
  if (axios.isAxiosError(error) && error.response) {
    console.error("API error:", error.response.status, error.response.data);
  } else {
    throw error;
  }
}
```

### Handle validation errors

When required parameters are missing, the SDK throws errors. Wrap API calls in try/catch to handle validation and other failures gracefully.

### Reuse Configuration instances

Create a `Configuration` once per token/context and reuse it for multiple API calls:

```typescript
const config = new Configuration({
  basePath: apiHost,
  accessToken: customerAccessToken,
});
const customerApi = new CustomerApi(config);
const linkTokenResp = await customerApi.generateLinkToken({ ... });
const paymentResp = await customerApi.createPayment(paymentRequest);
```

### Client secret: never commit, server-side only

**Never commit your client secret to version control.** The client secret must remain confidential and be used only on the server.

- **Server-side only:** This SDK is designed for backend use. Never expose `client_secret` to the browser, mobile apps, or any client-side code.
- **Use environment variables or a secrets manager:** Load credentials at runtime from secure storage.
- **Add to `.gitignore`:** Ensure `.env` and any files containing secrets are never committed.

```typescript
// ✅ Correct: Load from environment (server-side only)
const clientId = process.env.FINVERSE_CLIENTID;
const clientSecret = process.env.FINVERSE_SECRET;  // Never log, never send to client
const redirectUri = process.env.REDIRECT_URI;
```

### Payment idempotency

For payment and mandate operations, use idempotency keys to safely retry requests without creating duplicate payments. If a request fails due to network issues, you can retry with the same key—the API will return the original result instead of creating a duplicate.

**Methods that support idempotency keys:** `createPayment`, `createMandate`, `createMandateForExistingSender` (DefaultApi), `createScheduledPayout` (DefaultApi).

```typescript
import { CustomerApi } from '@finverse/sdk-typescript';
import crypto from 'crypto';

// Generate a unique key per logical operation (e.g., per checkout or mandate setup)
const idempotencyKey = crypto.randomUUID();

// Safe to retry—same key returns same result
await new CustomerApi(config).createPayment(paymentRequest, idempotencyKey);
await new CustomerApi(config).createMandate(mandateRequest, idempotencyKey);
```

**Best practices:**
- Use one idempotency key per unique payment or mandate.
- Store the key with your order/mandate record so you can retry with the same key if needed.

---

## Resources for AI Agents

For AI agents implementing Finverse integrations, the [Finverse AI repository](https://github.com/finversetech/ai) contains skills, implementation guides, and reference documentation for payment flows, data retrieval, and other Finverse API patterns. Follow this link for detailed integration instructions: https://github.com/finversetech/ai
