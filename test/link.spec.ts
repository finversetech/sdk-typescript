import MockAdapter from 'axios-mock-adapter';
import axios from 'axios';

import { config, grantType } from './config';
import { Configuration } from '..';
import { CustomerApi, LinkApi } from '../api';
import { linkToken } from './responses/linkToken';
import { customerToken } from './responses/customerToken';
import { loginIdentityToken } from './responses/loginIdentityToken';
import { expect } from 'chai';

describe('Link', function () {
  let mock: MockAdapter;
  beforeEach(() => {
    mock = new MockAdapter(axios);
  });

  it('Obtain link token and link url to launch Finverse Link UI', async function () {
    // Variables
    const url = `${config.apiHost}/link/token`;
    const requestBody = {
      client_id: config.clientId,
      grant_type: grantType.CLIENT_CREDENTIALS,
      user_id: 'userId', // Reference back to your system userId, finverse does not use this
      redirect_uri: config.redirectURI,
      state: 'state', // This will be sent in the redirectUri callback, can be used to identify the state
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
    // The link url is used to initialize Finverse Link, when linking is finished, a cose is sent to the redirectUri
    // This is used to exchange for loginIdentity Token
    expect(got.data.link_url).to.equal(linkToken.link_url);
  });

  it('Obtain login identity token', async function () {
    // Variables
    const url = `${config.apiHost}/auth/token`;
    const requestBody = new URLSearchParams({
      grant_type: grantType.AUTHORIZATION_CODE,
      code: 'obtainAfterLink',
      client_id: config.clientId,
      redirect_uri: config.redirectURI,
    });

    // Mocking
    // When Finverse link is done, obtain the code and use it to exchange for login identity access token
    mock.onPost(url, requestBody.toString()).reply(200, loginIdentityToken);

    // Make Request
    const configuration = new Configuration({ basePath: config.apiHost, accessToken: customerToken.access_token });
    const got = await new LinkApi(configuration).token(
      grantType.AUTHORIZATION_CODE,
      'obtainAfterLink',
      config.clientId,
      config.redirectURI,
    );

    // Expect
    // The loginIdentityToken can be used to retrieve data
    expect(got.data.access_token).to.equal(loginIdentityToken.access_token);
  });

  afterEach(() => {
    mock.restore();
  });
});
