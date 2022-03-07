import MockAdapter from 'axios-mock-adapter';
import axios from 'axios';

import { config } from './config';
import { Configuration } from '..';
import { LoginIdentityApi } from '../api';
import { getAccounts } from './responses/account';
import { loginIdentityToken } from './responses/loginIdentityToken';

let mock = new MockAdapter(axios);

it('Get accounts', async () => {
  // Variable
  const url = `${config.apiHost}/accounts`;
  const accounts = getAccounts();

  // Mocking
  mock.onGet(url).reply(200, accounts);

  // Make Request
  const configuration = new Configuration({ basePath: config.apiHost, accessToken: loginIdentityToken.access_token });
  const got = await new LoginIdentityApi(configuration).listAccounts();

  // Expect
  expect(got.data.accounts).not.toBe(undefined);
});
