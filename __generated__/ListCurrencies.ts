/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: ListCurrencies
// ====================================================

export interface ListCurrencies_currency_pair {
  __typename: "currency_pair";
  id: number;
  long_currency: string;
  short_currency: string;
}

export interface ListCurrencies {
  /**
   * fetch data from the table: "currency_pair"
   */
  currency_pair: ListCurrencies_currency_pair[];
}
