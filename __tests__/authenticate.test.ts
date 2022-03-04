import MockAdapter from 'axios-mock-adapter';
import axios from 'axios';

import { config, grantType } from './config';
import { Configuration, PublicApi } from '..';

let mock = new MockAdapter(axios);

it('Get customer access token', async () => {
  // Variables
  const access_token = 'customer-token';

  const url = `${config.apiHost}/auth/customer/token`;
  const requestBody = {
    client_id: config.clientId,
    client_secret: config.clientSecret,
    grant_type: grantType.CLIENT_CREDENTIALS,
  };
  const response = { access_token };

  // Mocking
  mock.onPost(url, requestBody).reply(200, response);

  // Make Request
  const configuration = new Configuration({ basePath: config.apiHost });
  const got = await new PublicApi(configuration).generateCustomerAccessToken({
    client_id: config.clientId,
    client_secret: config.clientSecret,
    grant_type: grantType.CLIENT_CREDENTIALS,
  });

  // Expect
  expect(got.data.access_token).toBe(access_token);
});
