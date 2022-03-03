import { GetStatementsResponse } from '../../api';

import { getAccounts } from './accountResponse';

export function getStatements(): GetStatementsResponse {
  const accountData = getAccounts();
  return {
    statements: [
      {
        created_at: '2021-02-01T10:01:02.333Z',
        date: '2021-02-01',
        id: 'daiosdosi7823e43',
        name: 'BusinessVantage',
      },
    ],
    institution: accountData.institution,
    login_identity: accountData.login_identity,
  };
}
