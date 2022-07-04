import { GetStatementsResponse } from '../../api';

import { getAccounts } from './account';

export function getStatements(): GetStatementsResponse {
  const accountData = getAccounts();
  return {
    statements: [
      {
        created_at: '2021-03-18T03:41:08.666Z',
        date: '2020-09-01',
        id: '01F11PRDNQQV3HE6K57BVPEH09',
        name: 'Test Bank Statement',
      },
    ],
    institution: accountData.institution,
    login_identity: accountData.login_identity,
  };
}

export function getStatementAsBuffer(): ArrayBuffer {
  return new TextEncoder().encode("this is statement");
}
