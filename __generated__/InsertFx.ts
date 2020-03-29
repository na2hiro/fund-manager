/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: InsertFx
// ====================================================

export interface InsertFx_insert_currency_trade_returning {
  __typename: "currency_trade";
  id: number;
}

export interface InsertFx_insert_currency_trade {
  __typename: "currency_trade_mutation_response";
  /**
   * data of the affected rows by the mutation
   */
  returning: InsertFx_insert_currency_trade_returning[];
}

export interface InsertFx {
  /**
   * insert data into the table: "currency_trade"
   */
  insert_currency_trade: InsertFx_insert_currency_trade | null;
}

export interface InsertFxVariables {
  amount?: number | null;
  date?: any | null;
  price?: any | null;
  currency_pair_id?: number | null;
}
