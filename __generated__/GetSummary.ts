/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: GetSummary
// ====================================================

export interface GetSummary_currency_balance_currency_pair {
  __typename: "currency_pair";
  id: number;
  long_currency: string;
  short_currency: string;
}

export interface GetSummary_currency_balance {
  __typename: "currency_balance";
  current_value: any | null;
  current_profit: any | null;
  current_price: any | null;
  /**
   * An object relationship
   */
  currency_pair: GetSummary_currency_balance_currency_pair | null;
  average_price: any | null;
  amount: any | null;
}

export interface GetSummary {
  /**
   * fetch data from the table: "currency_balance"
   */
  currency_balance: GetSummary_currency_balance[];
}
