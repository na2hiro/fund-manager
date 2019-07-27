import Layout from "../components/Layout";
import Table from "../components/Table";
import {FunctionComponent} from "react";
import {gql} from "apollo-boost";
import {Query} from "react-apollo";
import {Alert, Spin} from "antd";

interface Prop {
}

const Portfolio: FunctionComponent<Prop> = ({}) => {
    return <Layout selectedMenu="portfolio">
        <h1>Portfolio</h1>

        <Query query={gql`
{
  assets_by_class_in_jpy {
    effective_currency
    name
    current_value_jpy
  }
  currency: portfolio_aggregate(where: {axis: {_eq: "currency"}}) {
    nodes {
      ratio
      type
    }
  }
  class: portfolio_aggregate(where: {axis: {_eq: "class"}}) {
    nodes {
      ratio
      type
    }
  }
}
        `}>
            {({loading, error, data})=>{
                if (loading) return <Spin/>;
                if (error) return <Alert message={error.toString()} type="error" />;
                return <Table data={data}/>;
            }}
        </Query>
    </Layout>;
};

export default Portfolio;
