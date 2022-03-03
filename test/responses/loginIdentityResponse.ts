import { GetLoginIdentityByIdResponse } from '../../api';

export function getLoginIdentity(): GetLoginIdentityByIdResponse {
  return {
    institution: {
      countries: ['HKG'],
      institution_id: 'testbank',
      institution_name: 'TestBank HK',
      portal_name: 'Test Bank Personal Account',
    },
    login_identity: {
      created_at: '2020-12-22T09:45:31.853Z',
      customer_app_id: 'demo.finverse',
      error: {
        details: 'ERROR_UNKNOWN',
        message: 'ERROR_UNKNOWN',
        type: 'ERROR_UNKNOWN',
      },
      first_success: '2020-12-22T09:45:31.853Z',
      institution_id: 'testbank',
      last_success: '2020-12-22T09:45:37.388Z',
      login_identity_id: '01ET4XDTEDK1EA13K1K11SWV0W',
      permissions_expiry_date: '2020-12-22T09:45:31.853Z',
      permissions_grant_date: '2020-12-22T09:45:31.853Z',
      status: 'ERROR',
      status_details: {
        event_date: '2020-12-22T09:45:40.313Z',
        event_name: 'RETRIEVE_DATA_FAILED',
      },
      updated_at: '2020-12-22T09:45:40.314Z',
      user_id: '01ET23V6TPXNE00SDSCQGXM3XB',
      webhook: 'https://example.com/callback',
    },
  };
}
