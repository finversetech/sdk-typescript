import { ListAccountsResponse } from '../../api';

export function getAccounts(): ListAccountsResponse {
  return {
    accounts: [
      {
        account_currency: 'HKD',
        account_holder_name: 'usergood',
        account_id: '01ESQMVCHTW60SCB08TFFSNGDZ',
        group_id: '01ESQMVCHTW60SCB08TFFSNGDZ', // Does this need to be legit?
        account_name: 'HKD Checking',
        balance: {
          currency: 'HKD',
          raw: '70013.12',
          value: 70013.12,
        },
        created_at: '2020-12-17T06:05:31.000Z',
        is_closed: false,
        is_excluded: false,
        is_parent: false,
        statement_balance: {
          currency: 'HKD',
          raw: '70013.12',
          value: 70013.12,
        },
        updated_at: '2020-12-17T06:05:31.000Z',
      },
    ],
    institution: {
      countries: ['HKG'],
      institution_id: 'testbank',
      institution_name: 'TestBank HK',
      portal_name: 'Test Bank Personal Account',
    },
    login_identity: {
      login_identity_id: '01ESQMV1YV5JXW884A7NH2FFAT',
      last_session_id: '111SQMV1YV5JXW884A7NH2FFAT',
      status: 'LINKED',
    },
  };
}
