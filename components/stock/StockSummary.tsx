import React, { FunctionComponent } from "react";
import {gql} from "apollo-boost";
import {Table} from "antd";
import { useQuery } from "react-apollo-hooks";
import { loadingOrError } from "../../utils/apolloUtils";
import { numberFormatter, CurrencyFormatterHolder, currencyValueFormatter } from "../../utils/formatter";
import { StockBalance, StockBalance_stock_balance } from "../../__generated__/StockBalance";
import { StockTradeSummary, StockTradeSummary_stock_trade_with_evaluation } from "../../__generated__/StockTradeSummary";

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
query StockTradeSummary($stock_id: Int) {
  stock_trade_with_evaluation(where: {stock_id: {_eq: $stock_id}}) {
    id
    acquired_currency_date
    acquired_currency_price
    latest_currency_date
    latest_currency_price
    latest_stock_date
    latest_stock_price
    price
    stock {
      name
      effective_currency
      stock_market {
        currency
      }
      type {
        name
      }
    }
    amount
    date
  }
}`;

const StockSummaryExpanded: FunctionComponent<{record: Record}> = ({record}) => {
    const {loading, error, data} = useQuery<StockTradeSummary>(GET_TRADES_FOR_STOCK, {
        variables: {
            stock_id: record.stock!.id
        }
    });
    return loadingOrError({loading, error}) || <Table
        bordered
        size="small"
        dataSource={data!.stock_trade_with_evaluation
            .map((row: StockTradeSummary_stock_trade_with_evaluation) => {
                const value = row.price*row.amount!;
                const value_jpy = value*(row.acquired_currency_price||1);
                const latest_stock_value = row.latest_stock_price!*row.amount!;
                const latest_stock_value_jpy = latest_stock_value*(row.latest_currency_price||1);
                const profit_jpy = latest_stock_value_jpy - value_jpy;
                // TODO dividend
                return {
                    ...row,
                    id: row.id,
                    value,
                    value_jpy,
                    latest_stock_value,
                    latest_stock_value_jpy,
                    profit_jpy,
                    currencyFormatter: new Intl.NumberFormat('ja-JP', {
                        style: "currency",
                        currency: row.stock!.stock_market.currency,
                        minimumFractionDigits: 2,
                    }),
                    currencyValueFormatter: new Intl.NumberFormat('ja-JP', {
                        style: "currency",
                        currency: row.stock!.stock_market.currency,
                        minimumFractionDigits: 0,
                    }),
                };
            })}
        columns={[
            {
                dataIndex: "amount",
                align: "right",
                title: "Amount",
                render: (number) => numberFormatter.format(number),
                sorter: (a, b) => a.amount! - b.amount!,
            },
            {title: "Acquire", children: [
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
                    dataIndex: "value",
                    key: "value",
                    align: "right",
                    title: "Value",
                    render: (value, record) => record.currencyValueFormatter.format(value),
                    sorter: (a, b) => a.value - b.value,
                },
                {
                    dataIndex: "value_jpy",
                    key: "value_jpy",
                    align: "right",
                    title: "Value (JPY)",
                    render: (value_jpy, record) => currencyValueFormatter.format(value_jpy),
                    sorter: (a, b) => a.value_jpy - b.value_jpy,
                },
            ]},
            {title: "Current / Sold", children: [
                {
                    title: "Date"
                    /*,
                    sorter: (a, b) => a.date < b.date ? -1 : 1,
                    defaultSortOrder: "descend",
                    */
                },
                {
                    dataIndex: "latest_stock_price",
                    align: "right",
                    title: "Price",
                    render: (price) => record.currencyFormatter.format(price),
                    sorter: (a, b) => a.latest_stock_price! - b.latest_stock_price!,
                },
                {
                    dataIndex: "latest_stock_value",
                    key: "value",
                    align: "right",
                    title: "Value",
                    render: (value, record) => record.currencyValueFormatter.format(value),
                    sorter: (a, b) => a.latest_stock_value - b.latest_stock_value,
                },
                {
                    dataIndex: "latest_stock_value_jpy",
                    key: "value_jpy",
                    align: "right",
                    title: "Value (JPY)",
                    render: (value, record) => currencyValueFormatter.format(value),
                    sorter: (a, b) => a.value_jpy - b.value_jpy,
                },
            ]},
            {
                dataIndex: "profit_jpy",
                key: "profit_jpy",
                align: "right",
                title: "Profit (JPY)",
                render: (value, record) => currencyValueFormatter.format(value),
                sorter: (a, b) => a.profit_jpy - b.profit_jpy,
            },
        ]}
    />
}

export default StockSummary;