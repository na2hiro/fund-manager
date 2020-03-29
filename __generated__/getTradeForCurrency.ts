/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: getTradeForCurrency
// ====================================================

export interface getTradeForCurrency_currency_trade {
  __typename: "currency_trade";
  date: any;
  price: any;
  amount: number;
  id: number;
}

export interface getTradeForCurrency {
  /**
   * fetch data from the table: "currency_trade"
   */
  currency_trade: getTradeForCurrency_currency_trade[];
}

export interface getTradeForCurrencyVariables {
  long_currency: string;
  short_currency: string;
}
