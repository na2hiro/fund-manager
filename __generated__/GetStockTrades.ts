/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: GetStockTrades
// ====================================================

export interface GetStockTrades_stock_trade_with_evaluation_stock_stock_market {
  __typename: "stock_market";
  id: string;
  currency: string;
}

export interface GetStockTrades_stock_trade_with_evaluation_stock_type {
  __typename: "stock_type";
  name: string;
}

export interface GetStockTrades_stock_trade_with_evaluation_stock {
  __typename: "stock";
  name: string;
  symbol: string;
  effective_currency: string | null;
  /**
   * An object relationship
   */
  stock_market: GetStockTrades_stock_trade_with_evaluation_stock_stock_market;
  /**
   * An object relationship
   */
  type: GetStockTrades_stock_trade_with_evaluation_stock_type;
}

export interface GetStockTrades_stock_trade_with_evaluation {
  __typename: "stock_trade_with_evaluation";
  id: number | null;
  acquired_currency_date: any | null;
  acquired_currency_price: any | null;
  latest_currency_date: any | null;
  latest_currency_price: any | null;
  latest_stock_date: any | null;
  latest_stock_price: number | null;
  price: any | null;
  /**
   * An object relationship
   */
  stock: GetStockTrades_stock_trade_with_evaluation_stock | null;
  amount: number | null;
  date: any | null;
}

export interface GetStockTrades_stock_trade_with_evaluation_aggregate_aggregate {
  __typename: "stock_trade_with_evaluation_aggregate_fields";
  count: number | null;
}

export interface GetStockTrades_stock_trade_with_evaluation_aggregate {
  __typename: "stock_trade_with_evaluation_aggregate";
  aggregate: GetStockTrades_stock_trade_with_evaluation_aggregate_aggregate | null;
}

export interface GetStockTrades {
  /**
   * fetch data from the table: "stock_trade_with_evaluation"
   */
  stock_trade_with_evaluation: GetStockTrades_stock_trade_with_evaluation[];
  /**
   * fetch aggregated fields from the table: "stock_trade_with_evaluation"
   */
  stock_trade_with_evaluation_aggregate: GetStockTrades_stock_trade_with_evaluation_aggregate;
}

export interface GetStockTradesVariables {
  stock_id?: number | null;
  offset?: number | null;
  perPage?: number | null;
}
