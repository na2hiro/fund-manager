/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: PortfolioOverview
// ====================================================

export interface PortfolioOverview_assets_full {
  __typename: "assets_full";
  effective_currency: string | null;
  name: string | null;
  current_value_jpy: any | null;
}

export interface PortfolioOverview_currency_nodes {
  __typename: "portfolio";
  ratio: any;
  type: string;
}

export interface PortfolioOverview_currency {
  __typename: "portfolio_aggregate";
  nodes: PortfolioOverview_currency_nodes[];
}

export interface PortfolioOverview_class_nodes {
  __typename: "portfolio";
  ratio: any;
  type: string;
}

export interface PortfolioOverview_class {
  __typename: "portfolio_aggregate";
  nodes: PortfolioOverview_class_nodes[];
}

export interface PortfolioOverview {
  /**
   * fetch data from the table: "assets_full"
   */
  assets_full: PortfolioOverview_assets_full[];
  /**
   * fetch aggregated fields from the table: "portfolio"
   */
  currency: PortfolioOverview_currency;
  /**
   * fetch aggregated fields from the table: "portfolio"
   */
  class: PortfolioOverview_class;
}
