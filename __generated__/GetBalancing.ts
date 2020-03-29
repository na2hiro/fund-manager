/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: GetBalancing
// ====================================================

export interface GetBalancing_portfolio_balancing {
  __typename: "portfolio_balancing";
  amount: any;
  class: string;
  currency: string;
}

export interface GetBalancing {
  /**
   * fetch data from the table: "portfolio_balancing"
   */
  portfolio_balancing: GetBalancing_portfolio_balancing[];
}
