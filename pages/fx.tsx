import Layout from "../components/Layout";
import {FunctionComponent} from "react";
import {Query} from "react-apollo";
import {gql} from "apollo-boost";
import {Alert, Spin, Table} from "antd";
import FxInsert from "../components/fx/FxInsert";
import * as React from "react";

interface Prop {
}

const numberFormatter = new Intl.NumberFormat('ja-JP', {
});
const priceRenderer = (price, record) => record.currencyFormatter.format(price);
const valueRenderer = (price, record) => record.currencyValueFormatter.format(price);

const Stock: FunctionComponent<Prop> = ({}) => {
    return <Layout selectedMenu="fx">
        <h1>FX</h1>

        <Query query={gql`
{
  currency_balance {
    current_value
    current_profit
    current_price
    currency_pair {
      long_currency
      short_currency
    }
    average_price
    amount
  }
}
        `}>
            {({loading, error, data})=>{
                if(loading) return <Spin />;
                if (error) return <Alert message={error.toString()} type="error" />;
                return <Table
                    bordered
                    expandRowByClick={true}
                    rowKey={(row) => row.currency_pair.long_currency + "_" + row.currency_pair.short_currency}
                    dataSource={data.currency_balance
                        .map(row => ({
                            ...row,
                            currencyFormatter: new Intl.NumberFormat('ja-JP', {
                                style: "currency",
                                currency: row.currency_pair.short_currency,
                                minimumFractionDigits: 2,
                            }),
                            currencyValueFormatter: new Intl.NumberFormat('ja-JP', {
                                style: "currency",
                                currency: row.currency_pair.short_currency,
                                minimumFractionDigits: 0,
                            }),
                        }))}
                    columns={[
                        {dataIndex: "currency_pair.long_currency", align: "right", title: "Name"},
                        {dataIndex: "amount", align: "right", title: "Amount", render: (number)=>numberFormatter.format(number)},
                        {
                            title: "Average acquire",
                            children: [
                                {dataIndex: "average_price", align: "right", title: "Price", render: priceRenderer},
                            ]
                        },
                        {
                            title: "Current",
                            children: [
                                {dataIndex: "current_price", align: "right", title: "Price", render: priceRenderer},
                                {dataIndex: "current_value", align: "right", title: "Value", render: valueRenderer},
                                {dataIndex: "current_profit", align: "right", title: "Profit", render: valueRenderer},
                            ]
                        },
                    ]}
                    expandedRowRender={record => <div>
                        <Query query={gql`
{
  currency_trade(where: {currency_pair: {long_currency: {_eq: "${record.currency_pair.long_currency}"}, short_currency: {_eq: "${record.currency_pair.short_currency}"}}}) {
    date
    price
    amount
    id
  }
}
                        `}>{({loading, error, data}) => {
                            if (loading) return <Spin/>;
                            if (error) return <Alert message={error.toString()} type="error" />;
                            return <Table
                                bordered
                                size="small"
                                title={() => <>Transaction</>}
                                dataSource={data.currency_trade
                                    .map(row => ({
                                        ...row,
                                        id: row.id,
                                        currencyFormatter: new Intl.NumberFormat('ja-JP', {
                                            style: "currency",
                                            currency: record.currency_pair.short_currency,
                                            minimumFractionDigits: 2,
                                        }),
                                        currencyValueFormatter: new Intl.NumberFormat('ja-JP', {
                                            style: "currency",
                                            currency: record.currency_pair.short_currency,
                                            minimumFractionDigits: 0,
                                        }),
                                    }))}
                                columns={[
                                    {dataIndex: "date", title: "Date"},
                                    {
                                        dataIndex: "amount",
                                        align: "right",
                                        title: "Amount",
                                        render: (number) => numberFormatter.format(number),
                                    },
                                    {
                                        dataIndex: "price",
                                        align: "right",
                                        title: "Price",
                                        render: priceRenderer,
                                    },
                                    {
                                        dataIndex: "price",
                                        key: "value",
                                        align: "right",
                                        title: "Value",
                                        render: (price, record) => record.currencyValueFormatter.format(price*record.amount),
                                    },
                                ]}
                            />
                        }}</Query>
                    </div>}
                />;
            }}
        </Query>
        <h2>Add transaction</h2>
        <FxInsert />
    </Layout>;
};

export default Stock;
