import { GetPaymentInstructionsResponse, CreatePaymentInstructionResponse } from '../../api';

export function createPaymentInstruction(): CreatePaymentInstructionResponse {
  return {
    payment_instruction_id: "01FYRK0Q1DVFTJRG50J5QT424Y",
  };
}

export function getPaymentInstruction(): GetPaymentInstructionsResponse {
  return {
    payment_instruction: {
        amount: 1000,
        currency: "PHP",
        end_date: "2022-12-01",
        frequency: "MONTHLY",
        info: {},
        recipient_account_id: "HOMECREDIT",
        recipient_name: "HOMECREDIT",
        reference_id: "01G0KD6Z8P06W4536X4BHEQYAX",
        remarks: "HOME CREDIT REPAYMENT",
        sender_account_id: "LOAN102345",
        sender_name: "Sender Name",
        start_date: "2022-04-01",
        status: "SUBMITTED",
        type: "DEBIT_AUTHORIZATION",
    }
  };
}
