/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: GetStockSummary
// ====================================================

export interface GetStockSummary_stock_summary_with_evaluation_stock_stock_market {
  __typename: "stock_market";
  id: string;
  currency: string;
}

export interface GetStockSummary_stock_summary_with_evaluation_stock_type {
  __typename: "stock_type";
  name: string;
}

export interface GetStockSummary_stock_summary_with_evaluation_stock {
  __typename: "stock";
  id: number;
  name: string;
  /**
   * An object relationship
   */
  stock_market: GetStockSummary_stock_summary_with_evaluation_stock_stock_market;
  effective_currency: string | null;
  symbol: string;
  /**
   * An object relationship
   */
  type: GetStockSummary_stock_summary_with_evaluation_stock_type;
}

export interface GetStockSummary_stock_summary_with_evaluation {
  __typename: "stock_summary_with_evaluation";
  /**
   * An object relationship
   */
  stock: GetStockSummary_stock_summary_with_evaluation_stock | null;
  amount: any | null;
  avg_price: any | null;
  avg_price_jpy: any | null;
  latest_price: number | null;
  latest_price_jpy: any | null;
}

export interface GetStockSummary {
  /**
   * fetch data from the table: "stock_summary_with_evaluation"
   */
  stock_summary_with_evaluation: GetStockSummary_stock_summary_with_evaluation[];
}
