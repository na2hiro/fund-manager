import Layout from "../components/Layout";
import {FunctionComponent} from "react";
import {Query} from "react-apollo";
import {gql} from "apollo-boost";
import {Alert, Spin, Table} from "antd";

interface Prop {
}

const numberFormatter = new Intl.NumberFormat('ja-JP', {
});

const Stock: FunctionComponent<Prop> = ({}) => {
    return <Layout selectedMenu="stock">
        <h1>Stock</h1>

        <Query query={gql`
{
  stock_balance {
    stock {
      id
      name
      stock_market {
        currency
      }
      effective_currency
      symbol
      type {
        name
      }
    }
    current_value
    current_profit
    current_price
    average_price
    amount
  }
}
        `}>
            {({loading, error, data})=>{
                if (loading) return <Spin />;
                if (error) return <Alert message={error.toString()} type="error" />;
                return <Table
                    dataSource={data.stock_balance
                        .map(row => ({
                            ...row,
                            id: row.stock.id,
                            currencyFormatter: new Intl.NumberFormat('ja-JP', {style: "currency", currency: row.stock.stock_market.currency}),
                        }))}
                    columns={[
                        {dataIndex: "stock.name", align: "right", title: "Name"},
                        {dataIndex: "amount", align: "right", title: "Amount", render: (number)=>numberFormatter.format(number)},
                        {dataIndex: "average_price", align: "right", title: "Average acquire price", render: (price, record)=> record.currencyFormatter.format(price)},
                        {dataIndex: "current_price", align: "right", title: "Current price", render: (price, record)=> record.currencyFormatter.format(price)},
                        {dataIndex: "current_value", align: "right", title: "Current value", render: (price, record)=> record.currencyFormatter.format(price)},
                        {dataIndex: "current_profit", align: "right", title: "Current profit", render: (price, record)=> record.currencyFormatter.format(price)},
                    ]}/>;
            }}
        </Query>
    </Layout>;
};

export default Stock;
