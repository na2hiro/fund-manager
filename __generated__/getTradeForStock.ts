/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: getTradeForStock
// ====================================================

export interface getTradeForStock_stock_trade_stock_type {
  __typename: "stock_type";
  name: string;
}

export interface getTradeForStock_stock_trade_stock_stock_market {
  __typename: "stock_market";
  currency: string;
}

export interface getTradeForStock_stock_trade_stock {
  __typename: "stock";
  id: number;
  effective_currency: string | null;
  name: string;
  /**
   * An object relationship
   */
  type: getTradeForStock_stock_trade_stock_type;
  /**
   * An object relationship
   */
  stock_market: getTradeForStock_stock_trade_stock_stock_market;
}

export interface getTradeForStock_stock_trade {
  __typename: "stock_trade";
  id: number;
  amount: number;
  date: any;
  price: any;
  /**
   * An object relationship
   */
  stock: getTradeForStock_stock_trade_stock;
}

export interface getTradeForStock {
  /**
   * fetch data from the table: "stock_trade"
   */
  stock_trade: getTradeForStock_stock_trade[];
}

export interface getTradeForStockVariables {
  id?: number | null;
}
