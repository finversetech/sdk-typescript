import MockAdapter from 'axios-mock-adapter';
import axios from 'axios';

import { config } from './config';
import { Configuration } from '..';
import { LoginIdentityApi } from '../api';
import { loginIdentityToken } from './responses/loginIdentityToken';
import { getTransactions } from './responses/transaction';
import { expect } from 'chai';

describe('Transactions', function () {
  let mock: MockAdapter;

  before(() => {
    mock = new MockAdapter(axios);
    mock.onGet(`${config.apiHost}/transactions`).reply(200, getTransactions());
  });

  it('Get transactions', async function () {
    // Make Request
    const configuration = new Configuration({ basePath: config.apiHost, accessToken: loginIdentityToken.access_token });
    const got = await new LoginIdentityApi(configuration).listTransactionsByLoginIdentityId();

    // Expect
    expect(got.data.total_transactions).to.be.ok;
  });

  after(() => {
    mock.restore();
  });
});
