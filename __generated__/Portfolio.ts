/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: Portfolio
// ====================================================

export interface Portfolio_assets_by_class_in_jpy {
  __typename: "assets_by_class_in_jpy";
  name: string | null;
}

export interface Portfolio {
  /**
   * fetch data from the table: "assets_by_class_in_jpy"
   */
  assets_by_class_in_jpy: Portfolio_assets_by_class_in_jpy[];
}
