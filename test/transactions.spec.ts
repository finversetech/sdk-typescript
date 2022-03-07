import MockAdapter from 'axios-mock-adapter';
import axios from 'axios';

import { config } from './config';
import { Configuration } from '..';
import { LoginIdentityApi } from '../api';
import { loginIdentityToken } from './responses/loginIdentityToken';
import { getTransactions } from './responses/transaction';

let mock = new MockAdapter(axios);

it('Get transactions', async () => {
  // Variable
  const url = `${config.apiHost}/transactions`;
  const transactions = getTransactions();

  // Mocking
  mock.onGet(url).reply(200, transactions);

  // Make Request
  const configuration = new Configuration({ basePath: config.apiHost, accessToken: loginIdentityToken.access_token });
  const got = await new LoginIdentityApi(configuration).listTransactionsByLoginIdentityId();

  // Expect
  expect(got.data.total_transactions).not.toBe(undefined);
});
