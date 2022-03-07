import { GetBalanceHistoryResponse } from '../../api';

import { getAccounts } from './account';

export function getBalanceHistory(): GetBalanceHistoryResponse {
  const accountData = getAccounts();
  return {
    account: accountData?.accounts?.[0],
    balance_history: [
      {
        amount: 69,
        currency: 'HKD',
        date: '2021-10-27',
      },
    ],
    institution: accountData.institution,
    login_identity: accountData.login_identity,
  };
}
