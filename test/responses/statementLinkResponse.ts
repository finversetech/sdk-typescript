import { GetStatementLinkResponse } from '../../api';

export function getStatementLinkByStatementId(): GetStatementLinkResponse {
  return {
    statement_links: [
      {
        url: 'dummyUrl',
        statement_id: 'daiosdosi7823e43',
        expiry: 'time',
      },
    ],
  };
}
