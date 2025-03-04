import { ListAccountsResponse } from '../../api';

export function getAccounts() {
  return {
    accounts: [
      {
        account_currency: 'HKD',
        account_id: '01F7MP3XTNX36K9N66JPKH131P',
        account_name: 'HKD Checking',
        balance: {
          currency: 'HKD',
          raw: '70013.12',
          value: 70013.12,
        },
        created_at: '2021-06-08T02:09:42.000Z',
        group_id: '5578758a56843bbe7104f0915f807eae4231aa0e5ce2bc0950c4fcb372b85948',
        is_closed: false,
        is_excluded: false,
        is_parent: false,
        statement_balance: {
          currency: 'HKD',
          raw: '70013.12',
          value: 70013.12,
        },
        updated_at: '2021-06-08T02:09:42.000Z',
        metadata: {},
      },
      {
        account_currency: 'HKD',
        account_id: '01F7MP3XTQ4Y8AFQ9KDFQXF14Y',
        account_name: 'HKD Credit Card',
        balance: {
          currency: 'HKD',
          raw: '-1833.22',
          value: -1833.22,
        },
        created_at: '2021-06-08T02:09:42.000Z',
        group_id: '4f776329e40d2aafaeb33415283aea9e0dae84467aeaa51c5030e4b0311b6040',
        is_closed: false,
        is_excluded: false,
        is_parent: false,
        statement_balance: {
          currency: 'HKD',
          raw: '-1833.22',
          value: -1833.22,
        },
        updated_at: '2021-06-08T02:09:42.000Z',
        metadata: {},
      },
      {
        account_currency: 'USD',
        account_id: '01F7MP3XTSBSTG6G68FESC66B1',
        account_name: 'USD FX',
        balance: {
          currency: 'USD',
          raw: '1923.22',
          value: 1923.22,
        },
        created_at: '2021-06-08T02:09:42.000Z',
        group_id: '582c1d9912586672ef9d028d7ed521ffedf9bb11d2392ddf1c2ec2e231c49ce5',
        is_closed: false,
        is_excluded: false,
        is_parent: false,
        statement_balance: {
          currency: 'HKD',
          raw: '15001.116',
          value: 15001.116,
        },
        updated_at: '2021-06-08T02:09:42.000Z',
        metadata: {},
      },
      {
        account_currency: 'BTC',
        account_id: '01F7MP3XTV38VSZMVF4C65NHT3',
        account_name: 'Bitcoin',
        balance: {
          currency: 'BTC',
          raw: '420.69',
          value: 420.69,
        },
        created_at: '2021-06-08T02:09:42.000Z',
        group_id: '582c1d9912586672ef9d028d7ed521ffedf9bb11d2392ddf1c2ec2e231c49ce5',
        is_closed: false,
        is_excluded: false,
        is_parent: false,
        statement_balance: {
          currency: 'HKD',
          raw: '106468292.05',
          value: 106468292.05,
        },
        updated_at: '2021-06-08T02:09:42.000Z',
        metadata: {},
      },
    ],
    institution: {
      countries: ['HKG', 'SGP', 'PHL'],
      institution_id: 'testbank',
      institution_name: 'TestBank HK',
      portal_name: 'Test Bank Personal Account',
    },
    login_identity: {
      login_identity_id: '01F7MP3J3H485QSDQC0FS15KE7',
      status: 'DATA_RETRIEVAL_COMPLETE',
    },
  };
}
