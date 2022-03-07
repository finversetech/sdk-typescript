import MockAdapter from 'axios-mock-adapter';
import axios from 'axios';

import { config, grantType } from './config';
import { Configuration, PublicApi } from '..';
import { customerToken } from './responses/customerToken';
import { expect } from 'chai';

describe('Authenticate', function () {
  let mock: MockAdapter;
  before(() => {
    mock = new MockAdapter(axios);
    mock
      .onPost(`${config.apiHost}/auth/customer/token`, {
        client_id: config.clientId,
        client_secret: config.clientSecret,
        grant_type: grantType.CLIENT_CREDENTIALS,
      })
      .reply(200, customerToken);
  });

  it('Get customer access token', async function () {
    // Make Request
    const configuration = new Configuration({ basePath: config.apiHost });
    const got = await new PublicApi(configuration).generateCustomerAccessToken({
      client_id: config.clientId,
      client_secret: config.clientSecret,
      grant_type: grantType.CLIENT_CREDENTIALS,
    });

    // Expect
    expect(got.data.access_token).to.equal(customerToken.access_token);
  });

  after(() => {
    mock.restore();
  });
});
