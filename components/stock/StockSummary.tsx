import React from "react";
import {gql} from "apollo-boost";
import {Table} from "antd";
import { useQuery } from "react-apollo-hooks";
import { loadingOrError } from "../../utils/apolloUtils";
import { numberFormatter, percentageFormatter, jpyFormatter } from "../../utils/formatter";
import StockTrades from "./StockTrades";
import LinkToChartModal from "../LinkToChartModal";
import {GetStockSummary, GetStockSummary_stock_summary_with_evaluation} from "../../__generated__/GetStockSummary";

const STOCK_BALANCE = gql`
query GetStockSummary {
  stock_summary_with_evaluation {
    stock {
      id
      name
      stock_market {
        id
        currency
      }
      effective_currency
      symbol
      type {
        name
      }
    }
    amount
    avg_price
    avg_price_jpy
    latest_price
    latest_price_jpy
  }
  stock_summary_with_evaluation_aggregate {
    aggregate {
      sum {
        latest_value_jpy
        value_jpy
      }
    }
  }
}`;
const StockSummary = () => {
    const {loading, error, data} = useQuery<GetStockSummary>(STOCK_BALANCE);
    return loadingOrError({ loading, error }) || <Table
        bordered
        expandRowByClick={true}
        expandedRowRender={record => <StockTrades stockId={record.stock!.id} />}
        rowKey={(row) => row.stock!.id}
        dataSource={data!.stock_summary_with_evaluation
            .map((row: GetStockSummary_stock_summary_with_evaluation) => {
              const value = row.avg_price*row.amount;
              const value_jpy = row.avg_price_jpy*row.amount;
              const latest_value = (row.latest_price||NaN)*row.amount;
              const latest_value_jpy = (row.latest_price_jpy||NaN)*row.amount;
              const profit = latest_value-value;
              const profit_jpy = latest_value_jpy-value_jpy;
              const profit_jpy_rate = profit_jpy/value_jpy;
              return ({
                ...row,
                value,
                value_jpy,
                latest_value,
                latest_value_jpy,
                profit,
                profit_jpy,
                profit_jpy_rate,
                currencyFormatter: new Intl.NumberFormat('ja-JP', { style: "currency", currency: row.stock!.stock_market.currency }),
              })
          })}
        columns={[
            {
                dataIndex: ["stock", "name"],
                 align: "right",
                 title: "Name",
                 render: (name, record) => <LinkToChartModal name={name} symbol={ `${record.stock!.stock_market.id}:${record.stock!.symbol}`} /> },
            { dataIndex: "amount", align: "right", title: "Amount", render: (number) => numberFormatter.format(number) },
            {title: "Average acquire", children: [
                { dataIndex: "avg_price", align: "right", title: "Price", render: (price, record) => record.currencyFormatter.format(price) },
                { dataIndex: "value", align: "right", title: "Value", render: (value, record) => record.currencyFormatter.format(value) },
                { dataIndex: "value_jpy", align: "right", title: "(JPY)", render: (value, record) => jpyFormatter.format(value) },
            ]},
            {title: "Current", children: [
                { dataIndex: "latest_price", align: "right", title: "Price", render: (price, record) => record.currencyFormatter.format(price) },
                { dataIndex: "latest_value", align: "right", title: "Value", render: (price, record) => record.currencyFormatter.format(price) },
                { dataIndex: "latest_value_jpy", align: "right", title: "(JPY)", render: (price, record) => jpyFormatter.format(price) },
                { dataIndex: "profit", align: "right", title: "Profit", render: (price, record) => record.currencyFormatter.format(price) },
                { dataIndex: "profit_jpy", align: "right", title: "(JPY)", render: (price, record) => jpyFormatter.format(price) },
                { dataIndex: "profit_jpy_rate", align: "right", title: "%", render: (rate, record) => percentageFormatter.format(rate) },
            ]},
        ]}
        summary={() =>{
            let totalValueJpy = data!.stock_summary_with_evaluation_aggregate.aggregate!.sum!.value_jpy;
            let totalLatestValueJpy = data!.stock_summary_with_evaluation_aggregate.aggregate!.sum!.latest_value_jpy;
            let totalProfitJpy = totalLatestValueJpy - totalValueJpy;
            return <tr>
                <th></th>
                <th style={{textAlign: "right"}}>Total</th>
                <th></th>
                <th></th>
                <th></th>
                <th style={{textAlign: "right"}}>{jpyFormatter.format(totalValueJpy)}</th>
                <th></th>
                <th></th>
                <th style={{textAlign: "right"}}>{jpyFormatter.format(totalLatestValueJpy)}</th>
                <th></th>
                <th style={{textAlign: "right"}}>{jpyFormatter.format(totalProfitJpy)}</th>
                <th style={{textAlign: "right"}}>{percentageFormatter.format(totalProfitJpy / totalValueJpy)}</th>
            </tr>
        }}
         />;
}


export default StockSummary;