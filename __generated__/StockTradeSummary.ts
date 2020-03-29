/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: StockTradeSummary
// ====================================================

export interface StockTradeSummary_stock_trade_with_evaluation_stock_stock_market {
  __typename: "stock_market";
  currency: string;
}

export interface StockTradeSummary_stock_trade_with_evaluation_stock_type {
  __typename: "stock_type";
  name: string;
}

export interface StockTradeSummary_stock_trade_with_evaluation_stock {
  __typename: "stock";
  name: string;
  effective_currency: string | null;
  /**
   * An object relationship
   */
  stock_market: StockTradeSummary_stock_trade_with_evaluation_stock_stock_market;
  /**
   * An object relationship
   */
  type: StockTradeSummary_stock_trade_with_evaluation_stock_type;
}

export interface StockTradeSummary_stock_trade_with_evaluation {
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
  stock: StockTradeSummary_stock_trade_with_evaluation_stock | null;
  amount: number | null;
  date: any | null;
}

export interface StockTradeSummary {
  /**
   * fetch data from the table: "stock_trade_with_evaluation"
   */
  stock_trade_with_evaluation: StockTradeSummary_stock_trade_with_evaluation[];
}

export interface StockTradeSummaryVariables {
  stock_id?: number | null;
}
