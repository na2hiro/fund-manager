import React, { useState, useCallback } from "react";
import { gql } from "apollo-boost";
import { useQuery } from "react-apollo-hooks";
import { loadingOrError } from "../../utils/apolloUtils";
import { Table } from "antd";
import { GetStockTrades, GetStockTrades_stock_trade } from "../../__generated__/GetStockTrades";
import { numberFormatter, priceRenderer } from "../../utils/formatter";

const PER_PAGE = 10;

const GET_TRADES = gql`
query GetStockTrades ($offset: Int, $perPage: Int) {
  stock_trade(limit: $perPage, offset: $offset, order_by: {date: desc}) {
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
  stock_trade_aggregate {
    aggregate {
      count
    }
  }
}
`;

// pagination https://ant.design/components/table/#components-table-demo-ajax
const StockTrades = () => {
    const [page, setPage] = useState(1);
    const onChangeTable = useCallback((pagination, filters, sorter) =>{
        setPage(pagination.current);
    }, []);
    const {loading, error, data} = useQuery<GetStockTrades>(GET_TRADES, {
        variables: {
            offset: (page-1)*PER_PAGE,
            perPage: PER_PAGE
        }
    });
    return loadingOrError({loading, error}) || <Table
        bordered
        size="small"
        title={() => <>Trades</>}
        pagination={{
            total: data!.stock_trade_aggregate.aggregate!.count!,
            current: page
        }}
        onChange={onChangeTable}
        dataSource={data!.stock_trade
            .map((row: GetStockTrades_stock_trade) => ({
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
                dataIndex: ["stock", "name"],
                align: "right",
                title: "Name",
            },
            {
                dataIndex: "amount",
                align: "right",
                title: "Amount",
                render: (number) => numberFormatter.format(number),
            },
            {title: "Acquire", children: [
                {dataIndex: "date", title: "Date", align: "right"},
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
                {
                    title: "Value (JPY)"
                }
            ]},
            {
                title: "Current / Sold",
                children: [
                    {title: "Date"},
                    {title: "Price"},
                    {title: "Value"},
                    {title: "Dividend"},
                    {title: "Profit"},
                ]
            }
        ]}
    />;
}

export default StockTrades;