import MockAdapter from 'axios-mock-adapter';
import axios from 'axios';

import { config } from './config';
import { Configuration } from '..';
import { LoginIdentityApi } from '../api';
import { getAccounts } from './responses/account';
import { loginIdentityToken } from './responses/loginIdentityToken';
import { expect } from 'chai';

describe('Accounts', function () {
  let mock: MockAdapter;

  before(() => {
    mock = new MockAdapter(axios);
    mock.onGet(`${config.apiHost}/accounts`).reply(200, getAccounts());
  });

  it('Get accounts', async function () {
    // Make Request
    const configuration = new Configuration({ basePath: config.apiHost, accessToken: loginIdentityToken.access_token });
    const got = await new LoginIdentityApi(configuration).listAccounts();

    // Expect
    expect(got.data.accounts).to.be.ok;
  });

  after(() => {
    mock.restore();
  });
});
