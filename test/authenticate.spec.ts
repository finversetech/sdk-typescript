import MockAdapter from 'axios-mock-adapter';
import axios from 'axios';

import { config, grantType } from './config';
import { Configuration, PublicApi } from '..';
import { customerToken } from './responses/customerToken';

let mock = new MockAdapter(axios);

it('Get customer access token', async () => {
  // Variables
  const url = `${config.apiHost}/auth/customer/token`;
  const requestBody = {
    client_id: config.clientId,
    client_secret: config.clientSecret,
    grant_type: grantType.CLIENT_CREDENTIALS,
  };

  // Mocking
  mock.onPost(url, requestBody).reply(200, customerToken);

  // Make Request
  const configuration = new Configuration({ basePath: config.apiHost });
  const got = await new PublicApi(configuration).generateCustomerAccessToken({
    client_id: config.clientId,
    client_secret: config.clientSecret,
    grant_type: grantType.CLIENT_CREDENTIALS,
  });

  // Expect
  expect(got.data.access_token).toBe(customerToken.access_token);
});
