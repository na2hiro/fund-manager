import { gql } from "apollo-boost";
import { Table } from "antd";
import { useQuery } from "react-apollo-hooks";
import { loadingOrError } from "../../utils/apolloUtils";
import { currencyValueFormatter, numberFormatter, priceRenderer, valueRenderer } from "../../utils/formatter";
import { GetSummary, GetSummary_currency_balance } from "../../__generated__/GetSummary";
import { FunctionComponent } from "react";
import FxTrades from "./FxTrades";

const GET_SUMMARY = gql`
query GetSummary {
  currency_balance {
    current_value
    current_profit
    current_price
    currency_pair {
      id
      long_currency
      short_currency
    }
    average_price
    amount
  }
}`;

const FxSummary: FunctionComponent<{}> = () => {
    const {loading, error, data} = useQuery<GetSummary>(GET_SUMMARY);
    return loadingOrError({loading, error}) || <Table
        bordered
        expandRowByClick={true}
        rowKey={(row) => row!.currency_pair!.long_currency + "_" + row!.currency_pair!.short_currency}
        dataSource={data!.currency_balance
            .map((row: GetSummary_currency_balance) => ({
                ...row,
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
        summary={pageData =>{
            let totalValue = 0;
            let totalProfit = 0;
            pageData.forEach(({current_value, current_profit}) => {
                totalValue+=current_value;
                totalProfit+=current_profit;
            });
            return <tr>
                <th></th>
                <th style={{textAlign: "right"}}>total</th>
                <th></th>
                <th></th>
                <th></th>
                <th style={{textAlign: "right"}}>{currencyValueFormatter.format(totalValue)}</th>
                <th style={{textAlign: "right"}}>{currencyValueFormatter.format(totalProfit)}</th>
            </tr>
        }}
        columns={[
            {dataIndex: ["currency_pair", "long_currency"], align: "right", title: "Name"},
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
        expandedRowRender={record => <FxTrades currencyPairId={record.currency_pair!.id} />}
    />
}

export default FxSummary;