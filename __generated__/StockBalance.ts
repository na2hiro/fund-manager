/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: StockBalance
// ====================================================

export interface StockBalance_stock_balance_stock_stock_market {
  __typename: "stock_market";
  id: string;
  currency: string;
}

export interface StockBalance_stock_balance_stock_type {
  __typename: "stock_type";
  name: string;
}

export interface StockBalance_stock_balance_stock {
  __typename: "stock";
  id: number;
  name: string;
  /**
   * An object relationship
   */
  stock_market: StockBalance_stock_balance_stock_stock_market;
  effective_currency: string | null;
  symbol: string;
  /**
   * An object relationship
   */
  type: StockBalance_stock_balance_stock_type;
}

export interface StockBalance_stock_balance {
  __typename: "stock_balance";
  /**
   * An object relationship
   */
  stock: StockBalance_stock_balance_stock | null;
  current_value: any | null;
  current_profit: any | null;
  current_price: number | null;
  average_price: any | null;
  amount: any | null;
}

export interface StockBalance {
  /**
   * fetch data from the table: "stock_balance"
   */
  stock_balance: StockBalance_stock_balance[];
}
