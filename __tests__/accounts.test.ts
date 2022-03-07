import MockAdapter from 'axios-mock-adapter';
import axios from 'axios';

import { config } from './config';
import { Configuration } from '..';
import { LoginIdentityApi } from '../api';
import { getAccounts } from './responses/account';
import { loginIdentityToken } from './responses/loginIdentityToken';

let mock = new MockAdapter(axios);

it('Obtain link token and link url to launch Finverse Link UI', async () => {
  // Variable
  const url = `${config.apiHost}/accounts`;
  const loginIdentity = getAccounts();

  // Mocking
  mock.onGet(url).reply(200, loginIdentity);

  // Make Request
  const configuration = new Configuration({ basePath: config.apiHost, accessToken: loginIdentityToken.access_token });
  const got = await new LoginIdentityApi(configuration).getLoginIdentity();

  // Expect
  // This is the institution information
  expect(got.data.institution).toEqual(loginIdentity.institution);

  // This is the login identity events
  expect(got.data.login_identity).toEqual(loginIdentity.login_identity);
});
