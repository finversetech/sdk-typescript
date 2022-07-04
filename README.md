# Finverse API - Typescript SDK
This SDK enables a basic end-to-end backend integration with the Finverse API, including API authentication, institution linking, and data retrieval.

## Installation
```
npm install @finverse/sdk-typescript
```

## Getting started (Linking flow)

### 1. Authenticate with Finverse API: Obtain Customer Access Token
```typescript
// Obtain these from https://dashboard.finverse.com
const apiHost = "https://api.sandbox.finverse.net"
const clientId = process.env.FINVERSE_CLIENTID
const clientSecret = process.env.FINVERSE_SECRET
const redirectUri = process.env.REDIRECT_URI

const configuration = new Configuration({ basePath: apiHost });
// Obtain customer access token
const customerTokenResp = await new PublicApi(configuration).generateCustomerAccessToken({
	client_id: clientId,
	client_secret: clientSecret,
	grant_type: 'client_credentials',
});

const customerAccessToken = customerTokenResp.access_token
```

### 2. Link new institution: Obtain Link Token and Link URL to launch Finverse Link UI
```typescript
// generate a link token

// reference back to your system userId, finverse does not use this
const userId = "someUserId"     
// this will be sent in the redirectUri callback, can be used to identify the state
const state = "someUniqueState" 
const configuration = new Configuration({ 
	basePath: apiHost, 
	accessToken: customerToken.access_token
});
const linkTokenResp = await new CustomerApi(configuration).generateLinkToken({
	client_id:     clientId,
        user_id:       userId,
        redirect_uri:  redirectUri,
        state:        state,
        response_mode: "form_post",
        response_type: "code",
	grant_type:    "client_credentials",
});

// The linkUrl can be used to initiate Finverse Link
console.log("linkUrl: " + linkTokenResp.link_url)
```

### 3. Finalize linking: Exchange code for Login Identity Access Token
```typescript
// when Finverse Link UI is successful, obtain the code from Finverse Link
// exchange it for a Login Identity Access Token
const code = "obtainAfterLink"
const configuration = new Configuration({ 
	basePath: apiHost, 
	accessToken: customerToken.access_token 
});
const loginIdentityTokenResp = await new LinkApi(configuration).token(
	"authorization_code",
	code,
	clientId,
	redirectURI,
);

// The loginIdentityToken can be used to retrieve data
const loginIdentityToken = loginIdentityTokenResp.access_token
```

### 4. Retrieve data: Get data using Login Identity Access Token
```typescript
// get LoginIdentity
const configuration = new Configuration({
	basePath: apiHost,
	accessToken: loginIdentityToken.access_token 
});
const loginIdentityResp = await new LoginIdentityApi(configuration).getLoginIdentity();


console.log("login identity: " + loginIdentityResp.login_identity)
    
// get other products (Accounts, Account Numbers, Transactions)
```


### 5. Poll loginIdentityStatus until ready
```typescript
enum FinalStatus {
	ERROR = 'ERROR',
	DATA_RETRIEVAL_PARTIALLY_SUCCESSFUL = 'DATA_RETRIEVAL_PARTIALLY_SUCCESSFUL',
	DATA_RETRIEVAL_COMPLETE = 'DATA_RETRIEVAL_COMPLETE',
}

const configuration = new Configuration({
	basePath: apiHost,
	accessToken: loginIdentityToken.access_token 
});
let loginIdentity: AxiosResponse<GetLoginIdentityByIdResponse>;

// Poll until loginIdentityStatus is ready
for (let i = 0; i < 20; i++) {
	loginIdentity = await new LoginIdentityApi(configuration).getLoginIdentity();
	const loginIdentityStatus = loginIdentity.data.login_identity.status;
	if ( 
	  loginIdentityStatus === FinalStatus.ERROR ||
	  loginIdentityStatus === FinalStatus.DATA_RETRIEVAL_COMPLETE ||
	  loginIdentityStatus === FinalStatus.DATA_RETRIEVAL_PARTIALLY_SUCCESSFUL
	) { break; }
	
	await new Promise((resolve) => setTimeout(resolve, 3000));
}

console.log("login identity: " + loginIdentityResp.login_identity)
// get other products (Accounts, Account Numbers, Transactions)
```

### 6. Get Accounts
```typescript
// Get Accounts
const configuration = new Configuration({ basePath: apiHost, accessToken: loginIdentityToken.access_token });
const accountsRsp = await new LoginIdentityApi(configuration).listAccounts();

console.log("accounts: " + accountsResp.accounts)
```

### 7. Get Transactions
```typescript
// Get Transactions with pagination using offset and limit
let offset = 0
while(true) {
	const configuration = new Configuration({ basePath: apiHost, accessToken: loginIdentityToken.access_token });
        const transactionsResp = await new LoginIdentityApi(configuration).listTransactionsByLoginIdentityId();

	console.log(`total: ${transactionsResp.total_transactions}, transactions: ${transactionsResp.transactions}`)
	offset += transactionsResp.transactions.length

	if offset >= transactionsResp.total_transactions {
			break
	}
}
```

### 8. Get Statements
```typescript
// Get Statements metadata
const configuration = new Configuration({ basePath: apiHost, accessToken: loginIdentityToken.access_token });
const statements = await new LoginIdentityApi(configuration).getStatements();

console.log("statements: "  + statementsResp.statements)

// Get link to statement
// Assuming there is only one statement
const statementId = statements.data.statements[0].id;

// Can download statement from here 
const statementResp = await new LoginIdentityApi(configuration).getStatement(statementId, true, {responseType: "arraybuffer"});
writeFileSync("statement.pdf", Buffer.from(statementResp.data));
```

## Getting started (Payment flow)

### 1. Authenticate with Finverse API: Obtain Customer Access Token
```typescript
// Obtain these from https://dashboard.finverse.com
const apiHost = "https://api.sandbox.finverse.net"
const clientId = process.env.FINVERSE_CLIENTID
const clientSecret = process.env.FINVERSE_SECRET
const redirectUri = process.env.REDIRECT_URI

const configuration = new Configuration({ basePath: apiHost });
// Obtain customer access token
const customerTokenResp = await new PublicApi(configuration).generateCustomerAccessToken({
	client_id: clientId,
	client_secret: clientSecret,
	grant_type: 'client_credentials',
});

const customerAccessToken = customerTokenResp.access_token
```

### 2. Create payment instruction
```typescript
    const configuration = new Configuration({ basePath: config.apiHost, accessToken: customerToken.access_token });
    const paymentInstruction: CustomerPaymentInstruction = {
      type: "DEBIT_AUTHORIZATION",
      user_id: "customer_user1",
      frequency: "MONTHLY",
      start_date: "2022-04-01",
      end_date: "2022-12-01",
      amount: 1000,
      currency: "PHP",
      recipient_name: "HOMECREDIT",
      recipient_account_id: "Recipient Account Id",
      sender_name: "Sender Name",
      sender_account_id: "LOAN102345",
      remarks: "HOME CREDIT REPAYMENT"
    };
    const createPaymentInstructionResponse = await new CustomerApi(configuration).createPaymentInstruction(paymentInstruction);

    // createPaymentInstructionResponse.data.payment_instruction_id can be used to retrieve the status
```

### 3. Link with payment instruction: Obtain Link Token and Link URL to launch Finverse Link UI
```typescript
// generate a link token

// reference back to your system userId, finverse does not use this
const userId = "someUserId"     
// this will be sent in the redirectUri callback, can be used to identify the state
const state = "someUniqueState" 
const configuration = new Configuration({ 
  basePath: apiHost, 
	accessToken: customerToken.access_token
});
const linkTokenResp = await new CustomerApi(configuration).generateLinkToken({
	client_id:     clientId,
  user_id:       userId,
  redirect_uri:  redirectUri,
  state:        state,
  response_mode: "form_post",
  response_type: "code",
	grant_type:    "client_credentials",
  payment_instruction_id: createPaymentInstructionResponse.data.payment_instruction_id,
  products_requested: "PAYMENTS",
});

// The linkUrl can be used to initiate Finverse Link
console.log("linkUrl: " + linkTokenResp.link_url)
```

### 4. Finalize linking: Exchange code for Login Identity Access Token
```typescript
// when Finverse Link UI is successful, obtain the code from Finverse Link
// exchange it for a Login Identity Access Token
const code = "obtainAfterLink"
const configuration = new Configuration({ 
	basePath: apiHost, 
	accessToken: customerToken.access_token 
});
const loginIdentityTokenResp = await new LinkApi(configuration).token(
	"authorization_code",
	code,
	clientId,
	redirectURI,
);

// The loginIdentityToken can be used to retrieve data
const loginIdentityToken = loginIdentityTokenResp.access_token
```

### 5. Poll loginIdentityStatus until ready
Alternatively you can use webhook to receive LoginIdentity event.

```typescript
enum FinalStatus {
	ERROR = 'ERROR',
	CONNECTION_COMPLETE= 'CONNECTION_COMPLETE',
}

const configuration = new Configuration({
	basePath: apiHost,
	accessToken: loginIdentityToken.access_token 
});
let loginIdentity: AxiosResponse<GetLoginIdentityByIdResponse>;

// Poll until loginIdentityStatus is ready
for (let i = 0; i < 20; i++) {
	loginIdentity = await new LoginIdentityApi(configuration).getLoginIdentity();
	const loginIdentityStatus = loginIdentity.data.login_identity.status;
	if ( 
	  loginIdentityStatus === FinalStatus.ERROR ||
	  loginIdentityStatus === FinalStatus.CONNECTION_COMPLETE
	) { break; }
	
	await new Promise((resolve) => setTimeout(resolve, 3000));
}

console.log("login identity: " + loginIdentityResp.login_identity)
```

### 6. Get payment instruction status
```typescript
    const configuration = new Configuration({ basePath: config.apiHost, accessToken: customerToken.access_token });
    const getPaymentInstructionResponse = await new CustomerApi(configuration).getPaymentInstruction(createPaymentInstructionResponse.data.payment_instruction_id);

    console.log("paymentInstruction status: " + getPaymentInstructionResponse.data.payment_instruction.status);
```
