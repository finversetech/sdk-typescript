import { ListTransactionsResponse } from '../../api';

import { getAccounts } from './account';

export function getTransactions(): ListTransactionsResponse {
  const accountData = getAccounts();
  return {
    ...accountData,
    transactions: [
      {
        account_id: '01ESQMVCHTW60SCB08TFFSNGDZ',
        created_at: '2020-12-17T06:05:31.000Z',
        amount: {
          currency: 'HKD',
          raw: '-399.99',
          value: -399.99,
        },
        description: 'HKBN SVC CHR OCT2020',
        posted_date: '2020-11-11',
        transaction_id: '01ESQMVCNK8995843X05BS0ADR',
        updated_at: '2020-12-17T06:05:31.000Z',
        is_pending: false,
      },
      {
        account_id: '01ESQMVCHTW60SCB08TFFSNGDZ',
        created_at: '2020-12-17T06:05:31.000Z',
        amount: {
          currency: 'HKD',
          raw: '-120.12',
          value: -120.12,
        },
        description: 'PIZZA PIZZA',
        posted_date: '2020-11-11',
        transaction_id: '01ESQMVCNTKFZCD22EW91KHJFE',
        updated_at: '2020-12-17T06:05:31.000Z',
        is_pending: false,
      },
    ],
    total_transactions: 2,
  };
}
