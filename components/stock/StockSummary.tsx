import React from "react";
import {gql} from "apollo-boost";
import {Table} from "antd";
import { useQuery } from "react-apollo-hooks";
import { loadingOrError } from "../../utils/apolloUtils";
import { numberFormatter } from "../../utils/formatter";
import { StockBalance, StockBalance_stock_balance } from "../../__generated__/StockBalance";
import StockTrades from "./StockTrades";


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
        expandedRowRender={record => <StockTrades stockId={record.stock!.id} />}
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



export default StockSummary;