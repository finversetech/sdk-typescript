import { GetStatementLinkResponse } from '../../api';

export function getStatementLinkByStatementId(): GetStatementLinkResponse {
  return {
    statement_links: [
      {
        url: 'dummyUrl',
        statement_id: '01F11PRDNQQV3HE6K57BVPEH09',
        expiry: 'time',
      },
    ],
  };
}
