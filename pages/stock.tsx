import Layout from "../components/Layout";
import {FunctionComponent} from "react";
import {gql} from "apollo-boost";
import {Table} from "antd";
import { useQuery } from "react-apollo-hooks";
import { loadingOrError } from "../utils/apolloUtils";

const STOCK_BALANCE = gql`
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
}`;

interface Prop {
}

const numberFormatter = new Intl.NumberFormat('ja-JP', {
});

const Stock: FunctionComponent<Prop> = ({}) => {
    const {loading, error, data} = useQuery(STOCK_BALANCE);
    return <Layout selectedMenu="stock">
        <h1>Stock</h1>
        {loadingOrError({loading, error}) || <Table
                rowKey={(row) => row.stock.id}
                dataSource={data.stock_balance
                    .map((row: { stock: { stock_market: { currency: any; }; }; }) => ({
                        ...row,
                        currencyFormatter: new Intl.NumberFormat('ja-JP', {style: "currency", currency: row.stock.stock_market.currency}),
                    }))}
                columns={[
                    {dataIndex: "stock.name", align: "right", title: "Name"},
                    {dataIndex: "amount", align: "right", title: "Amount", render: (number)=>numberFormatter.format(number)},
                    {dataIndex: "average_price", align: "right", title: "Average acquire price", render: (price, record)=> record.currencyFormatter.format(price)},
                    {dataIndex: "current_price", align: "right", title: "Current price", render: (price, record)=> record.currencyFormatter.format(price)},
                    {dataIndex: "current_value", align: "right", title: "Current value", render: (price, record)=> record.currencyFormatter.format(price)},
                    {dataIndex: "current_profit", align: "right", title: "Current profit", render: (price, record)=> record.currencyFormatter.format(price)},
                ]}/>
        }
    </Layout>;
};

export default Stock;
