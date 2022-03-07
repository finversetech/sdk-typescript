import MockAdapter from 'axios-mock-adapter';
import axios, { AxiosResponse } from 'axios';

import { config } from './config';
import { Configuration } from '..';
import { LoginIdentityApi, GetLoginIdentityByIdResponse } from '../api';
import { getLoginIdentity } from './responses/loginIdentity';
import { loginIdentityToken } from './responses/loginIdentityToken';
import { expect } from 'chai';

enum FinalStatus {
  ERROR = 'ERROR',
  DATA_RETRIEVAL_PARTIALLY_SUCCESSFUL = 'DATA_RETRIEVAL_PARTIALLY_SUCCESSFUL',
  DATA_RETRIEVAL_COMPLETE = 'DATA_RETRIEVAL_COMPLETE',
}

describe('Login Identity', function () {
  let mock: MockAdapter;

  beforeEach(() => {
    mock = new MockAdapter(axios);
    mock.onGet(`${config.apiHost}/login_identity`).reply(200, getLoginIdentity());
  });

  it('Obtain login identity', async function () {
    // Make Request
    const configuration = new Configuration({ basePath: config.apiHost, accessToken: loginIdentityToken.access_token });
    const got = await new LoginIdentityApi(configuration).getLoginIdentity();

    // Expect
    // This is the institution information
    expect(got.data.institution).to.be.ok;

    // This is the login identity events
    expect(got.data.login_identity).to.be.ok;
  });

  it('Poll login identity until ready', async function () {
    // Make Request
    const configuration = new Configuration({ basePath: config.apiHost, accessToken: loginIdentityToken.access_token });
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
    expect(got.data.institution).to.be.ok;

    // This is the login identity events
    expect(got.data.login_identity).to.be.ok;
  });

  afterEach(() => {
    mock.restore();
  });
});
