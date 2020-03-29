import React, { useState, useCallback } from "react";
import { gql } from "apollo-boost";
import { useQuery } from "react-apollo-hooks";
import { loadingOrError } from "../../utils/apolloUtils";
import { Table } from "antd";
import {GetTrade, GetTrade_currency_trade} from "../../__generated__/GetTrade";
import { priceRenderer, numberFormatter } from "../../utils/formatter";

const PER_PAGE = 10;

const GET_TRADES = gql`
query GetTrade ($offset: Int, $perPage: Int) {
  currency_trade(limit: $perPage, offset: $offset, order_by: {date: desc}) {
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

// pagination https://ant.design/components/table/#components-table-demo-ajax
const FxTrades = () => {
    const [page, setPage] = useState(1);
    const onChangeTable = useCallback((pagination, filters, sorter) =>{
        setPage(pagination.current);
    }, []);
    const {loading, error, data} = useQuery<GetTrade>(GET_TRADES, {
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
            total: data!.currency_trade_aggregate!.aggregate!.count!,
            current: page
        }}
        onChange={onChangeTable}
        dataSource={data!.currency_trade
            .map((row: GetTrade_currency_trade) => ({
                ...row,
                id: row.id,
                currencyFormatter: new Intl.NumberFormat('ja-JP', {
                    style: "currency",
                    currency: row!.currency_pair!.short_currency,
                    minimumFractionDigits: 2,
                }),
                currencyValueFormatter: new Intl.NumberFormat('ja-JP', {
                    style: "currency",
                    currency: row!.currency_pair!.short_currency,
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