import React, { FunctionComponent } from "react";
import {gql} from "apollo-boost";
import {Table} from "antd";
import { useQuery } from "react-apollo-hooks";
import { loadingOrError } from "../../utils/apolloUtils";
import { numberFormatter, CurrencyFormatterHolder } from "../../utils/formatter";
import { StockBalance, StockBalance_stock_balance } from "../../__generated__/StockBalance";

type Record = StockBalance_stock_balance & CurrencyFormatterHolder;

const STOCK_BALANCE = gql`
query StockBalance{
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
const StockSummary = () => {
    const {loading, error, data} = useQuery<StockBalance>(STOCK_BALANCE);
    return loadingOrError({ loading, error }) || <Table
        bordered
        expandRowByClick={true}
        expandedRowRender={record => <StockSummaryExpanded record={record} />}
        rowKey={(row) => row.stock!.id}
        dataSource={data!.stock_balance
            .map((row: StockBalance_stock_balance) => ({
                ...row,
                currencyFormatter: new Intl.NumberFormat('ja-JP', { style: "currency", currency: row.stock!.stock_market.currency }),
            }))}
        columns={[
            { dataIndex: ["stock", "name"], align: "right", title: "Name" },
            { dataIndex: "amount", align: "right", title: "Amount", render: (number) => numberFormatter.format(number) },
            {title: "Average acquire", children: [
                { dataIndex: "average_price", align: "right", title: "Price", render: (price, record) => record.currencyFormatter.format(price) },
            ]},
            {title: "Current", children: [
                { dataIndex: "current_price", align: "right", title: "Price", render: (price, record) => record.currencyFormatter.format(price) },
                { dataIndex: "current_value", align: "right", title: "Value", render: (price, record) => record.currencyFormatter.format(price) },
                { dataIndex: "current_profit", align: "right", title: "Profit", render: (price, record) => record.currencyFormatter.format(price) },
            ]},
        ]} />;
}

const GET_TRADES_FOR_STOCK = gql`
query getTradeForStock($id: Int){
  stock_trade(order_by: {date: desc}, where: {stock_id: {_eq: $id}}) {
    id
    amount
    date
    price
    stock {
      effective_currency
      name
      type {
        name
      }
      stock_market {
        currency
      }
    }
  }
}`;

// TODO use an auto-generated type from GraphQL interface
type Row = {
    id: number;
    stock: {
        stock_market: {
            currency: string;
        }
    }
}

const StockSummaryExpanded: FunctionComponent<{record: Record}> = ({record}) => {
    const {loading, error, data} = useQuery(GET_TRADES_FOR_STOCK, {
        variables: {
            id: record.stock!.id
        }
    });
    return loadingOrError({loading, error}) || <Table
        bordered
        size="small"
        title={() => <>Trades</>}
        dataSource={data.stock_trade
            .map((row: Row) => ({
                ...row,
                id: row.id,
                currencyFormatter: new Intl.NumberFormat('ja-JP', {
                    style: "currency",
                    currency: row.stock.stock_market.currency,
                    minimumFractionDigits: 2,
                }),
                currencyValueFormatter: new Intl.NumberFormat('ja-JP', {
                    style: "currency",
                    currency: row.stock.stock_market.currency,
                    minimumFractionDigits: 0,
                }),
            }))}
        columns={[
            {
                dataIndex: "date",
                title: "Date",
                sorter: (a, b) => a.date < b.date ? -1 : 1,
                defaultSortOrder: "descend"
            },
            {
                dataIndex: "price",
                align: "right",
                title: "Price",
                render: (price) => record.currencyFormatter.format(price),
                sorter: (a, b) => a.price - b.price,
            },
            {
                dataIndex: "amount",
                align: "right",
                title: "Amount",
                render: (number) => numberFormatter.format(number),
                sorter: (a, b) => a.amount - b.amount,
            },
            {
                dataIndex: "price",
                key: "value",
                align: "right",
                title: "Value",
                render: (price, record) => record.currencyValueFormatter.format(price*record.amount),
                sorter: (a, b) => a.amount*a.price - b.amount*b.price,
            },
        ]}
    />
}

export default StockSummary;