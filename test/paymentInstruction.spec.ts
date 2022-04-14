import MockAdapter from 'axios-mock-adapter';
import axios from 'axios';

import { config } from './config';
import { Configuration } from '..';
import { CustomerApi, CustomerPaymentInstruction } from '../api';
import { customerToken } from './responses/customerToken';
import { createPaymentInstruction, getPaymentInstruction } from './responses/paymentInstruction';
import { expect } from 'chai';

describe('PaymentInstruction', function () {
  let mock: MockAdapter;

  before(() => {
    mock = new MockAdapter(axios);
  });

  it('Create paymentInstruction', async function () {
    mock.onPost(`${config.apiHost}/payments/instruction`).reply(200, createPaymentInstruction());

    const configuration = new Configuration({ basePath: config.apiHost, accessToken: customerToken.access_token });
    const paymentInstruction: CustomerPaymentInstruction = {
      type: "DEBIT_AUTHORIZATION",
      user_id: "customer_user1",
      frequency: "MONTHLY",
      start_date: "2022-04-01",
      end_date: "2022-12-01",
      amount: 1000,
      currency: "PHP",
      recipient_name: "HOMECREDIT",
      recipient_account_id: "Recipient Account Id",
      sender_name: "Sender Name",
      sender_account_id: "LOAN102345",
      remarks: "HOME CREDIT REPAYMENT"
    };
    const createPaymentInstructionResponse = await new CustomerApi(configuration).createPaymentInstruction(paymentInstruction);

    expect(createPaymentInstructionResponse.data.payment_instruction_id).to.be.ok;
  });

  it('Get paymentInstruction', async function () {
    mock.onGet(`${config.apiHost}/payments/instruction/stub_payment_instruction_id`).reply(200, getPaymentInstruction());

    const configuration = new Configuration({ basePath: config.apiHost, accessToken: customerToken.access_token });
    const getPaymentInstructionResponse = await new CustomerApi(configuration).getPaymentInstruction("stub_payment_instruction_id");

    expect(getPaymentInstructionResponse.data.payment_instruction).to.be.ok;
  });

  after(() => {
    mock.restore();
  });
});
