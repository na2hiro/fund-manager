import React, { useState, useCallback } from "react";
import { gql } from "apollo-boost";
import { useQuery } from "react-apollo-hooks";
import { loadingOrError } from "../../utils/apolloUtils";
import { Table } from "antd";

const PER_PAGE = 10;

const GET_TRADES = gql`
query MyQuery ($offset: Int) {
  currency_trade(limit: ${PER_PAGE}, offset: $offset, order_by: {date: desc}) {
    date
    amount
    id
    price
    currency_pair {
      long_currency
      short_currency
    }
  }
  currency_trade_aggregate {
    aggregate {
      count
    }
  }
}
`;
const numberFormatter = new Intl.NumberFormat('ja-JP', { });
const priceRenderer = (price: number, record: Record) => record.currencyFormatter.format(price);
const valueRenderer = (price: number, record: Record) => record.currencyValueFormatter.format(price);

// pagination https://ant.design/components/table/#components-table-demo-ajax
const FxTrades = () => {
    const [page, setPage] = useState(1);
    const onChangeTable = useCallback((pagination, filters, sorter) =>{
        setPage(pagination.current);
    }, []);
    const {loading, error, data} = useQuery(GET_TRADES, {
        variables: {
            offset: (page-1)*PER_PAGE
        }
    });
    return loadingOrError({loading, error}) || <Table
        bordered
        size="small"
        title={() => <>Trades</>}
        pagination={{
            total: data.currency_trade_aggregate.aggregate.count,
            current: page
        }}
        onChange={onChangeTable}
        dataSource={data.currency_trade
            .map((row: { id: any; }) => ({
                ...row,
                id: row.id,
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
            {dataIndex: "date", title: "Date"},
            {
                dataIndex: "currency_pair",
                align: "right",
                title: "Name",
                render: (currency_pair) => currency_pair.long_currency+currency_pair.short_currency,
            },
            {
                dataIndex: "price",
                align: "right",
                title: "Price",
                render: priceRenderer,
            },
            {
                dataIndex: "amount",
                align: "right",
                title: "Amount",
                render: (number) => numberFormatter.format(number),
            },
            {
                dataIndex: "price",
                key: "value",
                align: "right",
                title: "Value",
                render: (price, record) => record.currencyValueFormatter.format(price*record.amount),
            },
        ]}
    />;
}

export default FxTrades;