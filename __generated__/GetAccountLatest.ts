/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: GetAccountLatest
// ====================================================

export interface GetAccountLatest_account_latest_account {
  __typename: "account";
  currency: string;
  name: string;
}

export interface GetAccountLatest_account_latest {
  __typename: "account_latest";
  latest_date: any | null;
  latest_amount: number | null;
  id: number | null;
  /**
   * An object relationship
   */
  account: GetAccountLatest_account_latest_account | null;
}

export interface GetAccountLatest_account_latest_aggregate_aggregate_sum {
  __typename: "account_latest_sum_fields";
  latest_amount: number | null;
}

export interface GetAccountLatest_account_latest_aggregate_aggregate {
  __typename: "account_latest_aggregate_fields";
  sum: GetAccountLatest_account_latest_aggregate_aggregate_sum | null;
}

export interface GetAccountLatest_account_latest_aggregate {
  __typename: "account_latest_aggregate";
  aggregate: GetAccountLatest_account_latest_aggregate_aggregate | null;
}

export interface GetAccountLatest {
  /**
   * fetch data from the table: "account_latest"
   */
  account_latest: GetAccountLatest_account_latest[];
  /**
   * fetch aggregated fields from the table: "account_latest"
   */
  account_latest_aggregate: GetAccountLatest_account_latest_aggregate;
}
