import MockAdapter from 'axios-mock-adapter';
import axios from 'axios';

import { config, grantType } from './config';
import { Configuration } from '..';
import { CustomerApi } from '../api';
import { linkToken } from './responses/linkToken';
import { customerToken } from './responses/customerToken';

let mock = new MockAdapter(axios);

it('Obtain link token and link url to launch Finverse Link UI', async () => {
  // Variables
  const url = `${config.apiHost}/link/token`;
  const requestBody = {
    client_id: config.clientId,
    grant_type: grantType.CLIENT_CREDENTIALS,
    user_id: 'userId',
    redirect_uri: config.redirectURI,
    state: 'state',
    response_mode: 'form_post',
    response_type: 'code',
    link_mode: 'iframe',
  };

  // Mocking
  mock.onPost(url, requestBody).reply(200, linkToken);

  // Make Request
  const configuration = new Configuration({ basePath: config.apiHost, accessToken: customerToken.access_token });
  const got = await new CustomerApi(configuration).generateLinkToken(requestBody);

  // Expect
  expect(got.data.link_url).toBe(linkToken.link_url);
});
