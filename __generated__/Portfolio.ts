/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: Portfolio
// ====================================================

export interface Portfolio_assets_full {
  __typename: "assets_full";
  name: string | null;
}

export interface Portfolio {
  /**
   * fetch data from the table: "assets_full"
   */
  assets_full: Portfolio_assets_full[];
}
