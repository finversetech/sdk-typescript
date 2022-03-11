import { GetIdentityResponse } from '../../api';

import { getAccounts } from './account';

export function getIdentity(): GetIdentityResponse {
  const accountData = getAccounts();
  return {
    identity: {
      addresses: [
        {
          account_ids: ['01FG0M305NNFND0ZK5EC6ARXQA', '01FG0M305QAAER7Z6XVZAEV4R9', '01FG0M305V0Z3MADJR00VFYDGG'],
          raw: 'Some location',
          source: 'ONLINE_BANKING',
          source_ids: ['01FG0M3D2GEM6Z2E1NV62WTY95'],
        },
      ],
      emails: [
        {
          account_ids: ['01FG0M305NNFND0ZK5EC6ARXQA', '01FG0M305QAAER7Z6XVZAEV4R9', '01FG0M305V0Z3MADJR00VFYDGG'],
          raw: 'john@company.com',
          source: 'ONLINE_BANKING',
          source_ids: ['01FG0M3D2GEM6Z2E1NV62WTY95'],
        },
      ],
      names: [
        {
          account_ids: ['01FG0M305NNFND0ZK5EC6ARXQA', '01FG0M305QAAER7Z6XVZAEV4R9', '01FG0M305V0Z3MADJR00VFYDGG'],
          full_name: 'John Doe',
          raw: 'John Doe',
          source: 'ONLINE_BANKING',
          source_ids: ['01FG0M3D2GEM6Z2E1NV62WTY95'],
        },
        {
          account_ids: ['01FG0M30612SWYQFRD6A2581Z2'],
          full_name: 'Joe',
          raw: 'Joe',
          source: 'ONLINE_BANKING',
          source_ids: ['01FG0M3D2GEM6Z2E1NV62WTY95'],
        },
      ],
      phone_numbers: [
        {
          account_ids: ['01FG0M305NNFND0ZK5EC6ARXQA', '01FG0M305QAAER7Z6XVZAEV4R9', '01FG0M305V0Z3MADJR00VFYDGG'],
          raw: '12345678',
          source: 'ONLINE_BANKING',
          source_ids: ['01FG0M3D2GEM6Z2E1NV62WTY95'],
        },
      ],
    },
    institution: accountData.institution,
    login_identity: accountData.login_identity,
  };
}
