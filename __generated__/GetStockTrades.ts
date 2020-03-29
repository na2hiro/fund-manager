/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: GetStockTrades
// ====================================================

export interface GetStockTrades_stock_trade_stock_type {
  __typename: "stock_type";
  name: string;
}

export interface GetStockTrades_stock_trade_stock_stock_market {
  __typename: "stock_market";
  currency: string;
}

export interface GetStockTrades_stock_trade_stock {
  __typename: "stock";
  effective_currency: string | null;
  name: string;
  /**
   * An object relationship
   */
  type: GetStockTrades_stock_trade_stock_type;
  /**
   * An object relationship
   */
  stock_market: GetStockTrades_stock_trade_stock_stock_market;
}

export interface GetStockTrades_stock_trade {
  __typename: "stock_trade";
  id: number;
  amount: number;
  date: any;
  price: any;
  /**
   * An object relationship
   */
  stock: GetStockTrades_stock_trade_stock;
}

export interface GetStockTrades_stock_trade_aggregate_aggregate {
  __typename: "stock_trade_aggregate_fields";
  count: number | null;
}

export interface GetStockTrades_stock_trade_aggregate {
  __typename: "stock_trade_aggregate";
  aggregate: GetStockTrades_stock_trade_aggregate_aggregate | null;
}

export interface GetStockTrades {
  /**
   * fetch data from the table: "stock_trade"
   */
  stock_trade: GetStockTrades_stock_trade[];
  /**
   * fetch aggregated fields from the table: "stock_trade"
   */
  stock_trade_aggregate: GetStockTrades_stock_trade_aggregate;
}

export interface GetStockTradesVariables {
  offset?: number | null;
  perPage?: number | null;
}
