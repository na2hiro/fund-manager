import { gql } from "apollo-boost";
import { Table } from "antd";
import { useQuery } from "react-apollo-hooks";
import { loadingOrError } from "../../utils/apolloUtils";
import { currencyValueFormatter } from "../../utils/formatter";

// TODO 
type Record = {
    currencyFormatter: Intl.NumberFormat;
    currencyValueFormatter: Intl.NumberFormat;
    date: string;
    price: number;
    amount: number;
}

const numberFormatter = new Intl.NumberFormat('ja-JP', { });
const priceRenderer = (price: number, record: Record) => record.currencyFormatter.format(price);
const valueRenderer = (price: number, record: Record) => record.currencyValueFormatter.format(price);

const GET_SUMMARY = gql`
query GetSummary {
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
}`;

const FxSummary = () => {
    const {loading, error, data} = useQuery(GET_SUMMARY);
    return loadingOrError({loading, error}) || <Table
        bordered
        expandRowByClick={true}
        rowKey={(row) => row.currency_pair.long_currency + "_" + row.currency_pair.short_currency}
        dataSource={data.currency_balance
            .map((row: { currency_pair: { short_currency: any; }; }) => ({
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
        summary={pageData =>{
            console.log("summary")
            let totalValue = 0;
            let totalProfit = 0;
            pageData.forEach(({current_value, current_profit}) => {
                totalValue+=current_value;
                totalProfit+=current_profit;
            });
            return <tr>
                <th></th>
                <th>total</th>
                <th></th>
                <th></th>
                <th></th>
                <th>{currencyValueFormatter(totalValue)}</th>
                <th>{currencyValueFormatter(totalProfit)}</th>
            </tr>
        }}
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
        expandedRowRender={record => <FxSummaryExpanded record={record} />}
    />
}

const GET_TRADES_FOR_CURRENCY = gql`
query getTradeForCurrency($long_currency: String!, $short_currency: String!){
    currency_trade(
        where: {currency_pair: {long_currency: {_eq: $long_currency}, short_currency: {_eq: $short_currency}}},
        order_by: {date: desc}
    ) {
        date
        price
        amount
        id
    }
}`;

const FxSummaryExpanded  = ({record}) => {
    const {loading, error, data} = useQuery(GET_TRADES_FOR_CURRENCY, {
        variables: {
            long_currency: record.currency_pair.long_currency,
            short_currency: record.currency_pair.short_currency,
        }
    });
    return loadingOrError({loading, error}) || <Table
        bordered
        size="small"
        title={() => <>Trades</>}
        dataSource={data.currency_trade
            .map((row: { id: any; }) => ({
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
                render: priceRenderer,
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

export default FxSummary;