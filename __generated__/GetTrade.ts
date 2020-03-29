/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: GetTrade
// ====================================================

export interface GetTrade_currency_trade_currency_pair {
  __typename: "currency_pair";
  long_currency: string;
  short_currency: string;
}

export interface GetTrade_currency_trade {
  __typename: "currency_trade";
  date: any;
  amount: number;
  id: number;
  price: any;
  /**
   * An object relationship
   */
  currency_pair: GetTrade_currency_trade_currency_pair;
}

export interface GetTrade_currency_trade_aggregate_aggregate {
  __typename: "currency_trade_aggregate_fields";
  count: number | null;
}

export interface GetTrade_currency_trade_aggregate {
  __typename: "currency_trade_aggregate";
  aggregate: GetTrade_currency_trade_aggregate_aggregate | null;
}

export interface GetTrade {
  /**
   * fetch data from the table: "currency_trade"
   */
  currency_trade: GetTrade_currency_trade[];
  /**
   * fetch aggregated fields from the table: "currency_trade"
   */
  currency_trade_aggregate: GetTrade_currency_trade_aggregate;
}

export interface GetTradeVariables {
  offset?: number | null;
  perPage?: number | null;
  currency_pair_id?: number | null;
}
