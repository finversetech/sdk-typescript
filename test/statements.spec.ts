import MockAdapter from 'axios-mock-adapter';
import axios from 'axios';

import { config } from './config';
import { Configuration } from '..';
import { LoginIdentityApi } from '../api';
import { loginIdentityToken } from './responses/loginIdentityToken';
import { getStatements, getStatementAsBuffer } from './responses/statement';
import { expect } from 'chai';

describe('Statements', function () {
  let mock: MockAdapter;

  before(() => {
    mock = new MockAdapter(axios);
  });

  it('Get statements', async function () {
    // Get all statements
    mock.onGet(`${config.apiHost}/statements`).reply(200, getStatements());

    const configuration = new Configuration({ basePath: config.apiHost, accessToken: loginIdentityToken.access_token });
    const gotStatements = await new LoginIdentityApi(configuration).getStatements();

    expect(gotStatements.data.statements).to.be.ok;

    // Get link to statement
    // Assuming there is only one statement
    const statementId = gotStatements.data.statements[0].id;

    mock.onGet(`${config.apiHost}/statements/${statementId}`).reply(200, getStatementAsBuffer());
    const gotStatementLink = await new LoginIdentityApi(configuration).getStatement(statementId);

    expect(gotStatementLink.data).to.be.ok;
  });

  after(() => {
    mock.restore();
  });
});
