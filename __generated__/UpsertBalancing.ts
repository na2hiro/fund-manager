/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: UpsertBalancing
// ====================================================

export interface UpsertBalancing_insert_portfolio_balancing_returning {
  __typename: "portfolio_balancing";
  amount: any;
}

export interface UpsertBalancing_insert_portfolio_balancing {
  __typename: "portfolio_balancing_mutation_response";
  /**
   * data of the affected rows by the mutation
   */
  returning: UpsertBalancing_insert_portfolio_balancing_returning[];
}

export interface UpsertBalancing {
  /**
   * insert data into the table: "portfolio_balancing"
   */
  insert_portfolio_balancing: UpsertBalancing_insert_portfolio_balancing | null;
}

export interface UpsertBalancingVariables {
  amount?: any | null;
  class?: string | null;
  currency?: string | null;
}
