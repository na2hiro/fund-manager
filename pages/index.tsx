import Layout from "../components/Layout";
import Table from "../components/Table";
import {FunctionComponent} from "react";
import {gql} from "apollo-boost";
import {Query} from "react-apollo";

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
        }
        `}>
            {({loading, error, data})=>{
                if(loading) return "Loading";
                if(error) return "error";
                return <Table data={data}/>;
            }}
        </Query>
    </Layout>;
};

export default Portfolio;