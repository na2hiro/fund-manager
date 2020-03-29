/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: BondTransactions
// ====================================================

export interface BondTransactions_bond_trade_bond {
  __typename: "bond";
  currency: string;
  effective_currency: string;
  name: string;
}

export interface BondTransactions_bond_trade {
  __typename: "bond_trade";
  redemption_date: any;
  purchase_date: any;
  discount: any;
  /**
   * An object relationship
   */
  bond: BondTransactions_bond_trade_bond;
  amount: number;
  id: number;
}

export interface BondTransactions {
  /**
   * fetch data from the table: "bond_trade"
   */
  bond_trade: BondTransactions_bond_trade[];
}
