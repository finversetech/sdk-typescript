import MockAdapter from 'axios-mock-adapter';
import axios, { AxiosResponse } from 'axios';

import { config } from './config';
import { Configuration } from '..';
import { LoginIdentityApi, GetLoginIdentityByIdResponse } from '../api';
import { customerToken } from './responses/customerToken';
import { getLoginIdentity } from './responses/loginIdentity';

enum FinalStatus {
  ERROR = 'ERROR',
  DATA_RETRIEVAL_PARTIALLY_SUCCESSFUL = 'DATA_RETRIEVAL_PARTIALLY_SUCCESSFUL',
  DATA_RETRIEVAL_COMPLETE = 'DATA_RETRIEVAL_COMPLETE',
}

let mock = new MockAdapter(axios);

it('Obtain link token and link url to launch Finverse Link UI', async () => {
  // Variable
  const url = `${config.apiHost}/login_identity`;
  const loginIdentity = getLoginIdentity();

  // Mocking
  mock.onGet(url).reply(200, loginIdentity);

  // Make Request
  const configuration = new Configuration({ basePath: config.apiHost, accessToken: customerToken.access_token });
  const got = await new LoginIdentityApi(configuration).getLoginIdentity();

  // Expect
  // This is the institution information
  expect(got.data.institution).toEqual(loginIdentity.institution);

  // This is the login identity events
  expect(got.data.login_identity).toEqual(loginIdentity.login_identity);
});

it('Poll login identity until ready', async () => {
  // Variable
  const url = `${config.apiHost}/login_identity`;
  const loginIdentity = getLoginIdentity();

  // Mocking
  mock.onGet(url).reply(200, loginIdentity);

  // Make Request
  const configuration = new Configuration({ basePath: config.apiHost, accessToken: customerToken.access_token });
  let got: AxiosResponse<GetLoginIdentityByIdResponse>;

  for (let i = 0; i < 20; i++) {
    got = await new LoginIdentityApi(configuration).getLoginIdentity();
    const loginIdentityStatus = got.data.login_identity.status;
    if (
      loginIdentityStatus === FinalStatus.ERROR ||
      loginIdentityStatus === FinalStatus.DATA_RETRIEVAL_COMPLETE ||
      loginIdentityStatus === FinalStatus.DATA_RETRIEVAL_PARTIALLY_SUCCESSFUL
    ) {
      break;
    }
    await new Promise((resolve) => setTimeout(resolve, 3000));
  }

  // Expect
  // This is the institution information
  expect(got.data.institution).toEqual(loginIdentity.institution);

  // This is the login identity events
  expect(got.data.login_identity).toEqual(loginIdentity.login_identity);
});
