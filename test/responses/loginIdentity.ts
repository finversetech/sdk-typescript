import { GetLoginIdentityByIdResponse } from '../../api';

export function getLoginIdentity(): GetLoginIdentityByIdResponse {
  return {
    institution: {
      countries: ['HKG', 'SGP', 'PHL'],
      institution_id: 'testbank',
      institution_name: 'TestBank HK',
      portal_name: 'Test Bank Personal Account',
    },
    login_identity: {
      authentication_status: {
        last_successful_update: '2021-12-03T02:08:23.087Z',
        last_update: '2021-12-03T02:08:23.087Z',
        status: 'AUTHENTICATED',
        status_details: 'AUTHENTICATED',
      },
      billing_details: {
        billed_products: null,
      },
      created_at: '2021-12-03T02:07:58.103Z',
      customer_app_id: 'any_customer_app_id',
      error: {},
      first_success: '2021-12-03T02:07:58.103Z',
      institution_id: 'testbank',
      last_success: '2021-12-03T02:08:23.034Z',
      login_identity_id: '01FNZ0RP2MWD0SNFBXT8VJ65PE',
      login_methods_available: {},
      permissions: null,
      permissions_expiry_date: '2021-12-03T02:07:58.103Z',
      permissions_grant_date: '2021-12-03T02:07:58.103Z',
      product_status: {
        account_numbers: {
          last_successful_update: '2021-12-03T02:08:25.189Z',
          last_update: '2021-12-03T02:08:25.189Z',
          status: 'SUCCESS',
          status_details: 'ACCOUNT_NUMBERS_RETRIEVED',
        },
        accounts: {
          last_successful_update: '2021-12-03T02:08:25.050Z',
          last_update: '2021-12-03T02:08:25.050Z',
          status: 'SUCCESS',
          status_details: 'ACCOUNTS_RETRIEVED',
        },
        balance_history: {
          status: 'SUCCESS',
          status_details: 'BALANCE_HISTORY_RETRIEVED',
        },
        historical_transactions: {
          last_update: '2021-12-03T02:08:33.698Z',
          status: 'SUCCESS',
          status_details: 'HISTORICAL_TRANSACTIONS_RETRIEVED',
        },
        identity: {
          last_successful_update: '2021-12-03T02:08:27.898Z',
          last_update: '2021-12-03T02:08:27.898Z',
          status: 'SUCCESS',
          status_details: 'IDENTITY_RETRIEVED',
        },
        online_transactions: {
          last_successful_update: '2021-12-03T02:08:26.790Z',
          last_update: '2021-12-03T02:08:26.790Z',
          status: 'SUCCESS',
          status_details: 'ONLINE_TRANSACTIONS_RETRIEVED',
        },
        statements: {
          last_successful_update: '2021-12-03T02:08:29.092Z',
          last_update: '2021-12-03T02:08:29.092Z',
          status: 'SUCCESS',
          status_details: 'STATEMENTS_RETRIEVED',
        },
      },
      status: 'DATA_RETRIEVAL_COMPLETE',
      status_details: {
        event_date: '2021-12-03T02:08:33.794Z',
        event_name: 'BALANCE_HISTORY_RETRIEVED',
      },
      updated_at: '2021-12-03T02:08:33.811Z',
      user_id: '01FN8TJ92X38QF7B4N5HRP8X3K',
      webhook: 'https://example.com/callback',
    },
  };
}
