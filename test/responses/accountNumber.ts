import { GetAccountNumberResponse } from '../../api';

import { getAccounts } from './account';

export function getAccountNumber(): GetAccountNumberResponse {
  const accountData = getAccounts();
  return {
    account: accountData?.accounts?.[0],
    account_number: {
      raw: '123-456789-123',
      number: '123456789123',
      account_id: 'validId',
    },
    institution: accountData.institution,
    login_identity: accountData.login_identity,
  };
}
