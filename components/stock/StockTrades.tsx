import React, { useState, useCallback, FunctionComponent } from "react";
import { gql } from "apollo-boost";
import { useQuery } from "react-apollo-hooks";
import { loadingOrError } from "../../utils/apolloUtils";
import { Table } from "antd";
import { GetStockTrades, GetStockTrades_stock_trade_with_evaluation } from "../../__generated__/GetStockTrades";
import { numberFormatter, jpyFormatter, percentageFormatter } from "../../utils/formatter";
import LinkToChartModal from "../LinkToChartModal";

const PER_PAGE = 10;

const GET_TRADES = gql`
query GetStockTrades($stock_id: Int, $offset: Int, $perPage: Int) {
  stock_trade_with_evaluation(limit: $perPage, offset: $offset, order_by: {date: desc}, where: {stock_id: {_eq: $stock_id}}) {
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
      symbol
      effective_currency
      stock_market {
        id
        currency
      }
      type {
        name
      }
    }
    amount
    date
  }
  stock_trade_with_evaluation_aggregate(where: {stock_id: {_eq: $stock_id}}) {
    aggregate {
      count
    }
  }
}`;

type Props = {
    stockId?: number;
}

// pagination https://ant.design/components/table/#components-table-demo-ajax
const StockTrades: FunctionComponent<Props> = ({stockId}) => {
    const [page, setPage] = useState(1);
    const onChangeTable = useCallback((pagination, filters, sorter) =>{
        // TODO sort needs to be handled properly to show correct sort result
        setPage(pagination.current);
    }, []);
    const {loading, error, data} = useQuery<GetStockTrades>(GET_TRADES, {
        variables: {
            offset: (page-1)*PER_PAGE,
            perPage: PER_PAGE,
            stock_id: stockId
        }
    });
    return loadingOrError({loading, error}) || <Table
        bordered
        size="small"
        pagination={{
            total: data!.stock_trade_with_evaluation_aggregate.aggregate!.count!,
            current: page
        }}
        onChange={onChangeTable}
        dataSource={data!.stock_trade_with_evaluation
            .map((row: GetStockTrades_stock_trade_with_evaluation) => {
                const value = row.price*row.amount!;
                const value_jpy = value*castAcquiredPrice(row.acquired_currency_price, row.stock!.stock_market.currency);
                const latest_stock_value = row.latest_stock_price!*row.amount!;
                const latest_stock_value_jpy = latest_stock_value*castAcquiredPrice(row.latest_currency_price, row.stock!.stock_market.currency);
                const profit_jpy = latest_stock_value_jpy - value_jpy;
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
                dataIndex: ["stock", "name"],
                align: "right",
                title: "Name",
                render: (name, record) => <LinkToChartModal name={name} symbol={ `${record.stock!.stock_market.id}:${record.stock!.symbol}`} />
            },
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
                    align: "right",
                    sorter: (a, b) => a.date < b.date ? -1 : 1,
                    defaultSortOrder: "descend"
                },
                {
                    dataIndex: "price",
                    align: "right",
                    title: "Price",
                    render: (price, record) => record.currencyFormatter.format(price),
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
                    render: (value_jpy) => jpyFormatter.format(value_jpy),
                    sorter: (a, b) => a.value_jpy - b.value_jpy,
                },
            ]},
            {title: "Current / Sold", children: [
                {
                    dataIndex: "latest_stock_price",
                    align: "right",
                    title: "Price",
                    render: (price, record) => record.currencyFormatter.format(price),
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
                    render: (value) => jpyFormatter.format(value),
                    sorter: (a, b) => a.value_jpy - b.value_jpy,
                },
            ]},
            {
                dataIndex: "profit_jpy",
                key: "profit_jpy",
                align: "right",
                title: "Profit (JPY)",
                render: (value) => jpyFormatter.format(value),
                sorter: (a, b) => a.profit_jpy - b.profit_jpy,
            },
            {
                dataIndex: "profit_jpy",
                key: "profit_jpy",
                align: "right",
                title: "% (JPY)",
                render: (value, record) => percentageFormatter.format(value / record.value_jpy),
                sorter: (a, b) => a.profit_jpy - b.profit_jpy,
            },
        ]}
    />;
}

const castAcquiredPrice = (acquiredPrice: number, currency: string): number => {
    return currency==="JPY" ? 1 : (acquiredPrice||NaN);
}

export default StockTrades;