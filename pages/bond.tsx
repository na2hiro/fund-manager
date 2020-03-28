import Layout from "../components/Layout";
import {FunctionComponent} from "react";
import {gql} from "apollo-boost";
import {Table} from "antd";
import moment from "moment";
import { useQuery } from "react-apollo-hooks";
import { loadingOrError } from "../utils/apolloUtils";

const percentFormatter = new Intl.NumberFormat('ja-JP', {
    style: "percent",
    minimumFractionDigits: 2,
});

const YEAR_IN_MILLIS = 1000 * 60 * 60 * 24 * 365;

const BOND_TRANSACTIONS = gql`
{
  bond_trade {
    redemption_date
    purchase_date
    discount
    bond {
      currency
      effective_currency
      name
    }
    amount
    id
  }
}`;

const calculateRate = (purchase_date: string, redemption_date: string, discount: number) => {
    const r = moment(redemption_date, "YYYY-MM-DD");
    const p = moment(purchase_date, "YYYY-MM-DD");
    const yearsPassed = r.diff(p) / YEAR_IN_MILLIS;
    return Math.pow(1 / discount, 1 / yearsPassed) - 1;
};

const calculateCurrentPercentage = (purchase_date: string, redemption_date: string, discount: number) => {
    const p = moment(purchase_date, "YYYY-MM-DD");
    const yearsPassed = moment().diff(p) / YEAR_IN_MILLIS;
    return Math.pow(1 + calculateRate(purchase_date, redemption_date, discount), yearsPassed);
};

interface Prop {
}

const Stock: FunctionComponent<Prop> = ({}) => {
    const {loading, error, data} = useQuery(BOND_TRANSACTIONS);
    return <Layout selectedMenu="bond">
        <h1>Bond</h1>
        {loadingOrError({loading, error}) || <Table
            bordered
            rowKey={"id"}
            dataSource={data.bond_trade
                .map(row => ({
                    ...row,
                    currencyFormatter: new Intl.NumberFormat('ja-JP', {style: "currency", currency: row.bond.currency}),
                }))}
            columns={[
                {dataIndex: ["bond", "name"], title: "Name"},
                {
                    title: "Buy",
                    children: [
                        {dataIndex: "purchase_date", title: "Date"},
                        {dataIndex: "discount", align: "right", title: "Price", render: (price)=> percentFormatter.format(price)},
                        {
                            dataIndex: "amount",
                            key: "value",
                            align: "right",
                            title: "Value",
                            render: (amount, record) => record.currencyFormatter.format(amount * record.discount)
                        },
                    ],
                },
                {
                    title: "End",
                    children: [
                        {dataIndex: "redemption_date", title: "Date"},
                        {dataIndex: "amount", align: "right", title: "Value", render: (number, record)=>record.currencyFormatter.format(number)},
                    ],
                },
                {
                    dataIndex: "discount",
                    key: "rate",
                    align: "right",
                    title: "% / Y",
                    render: (discount, record) => percentFormatter.format(calculateRate(record.purchase_date, record.redemption_date, discount))
                },
                {
                    dataIndex: "discount",
                    key: "todaysvalue",
                    align: "right",
                    title: "Today's value",
                    render: (discount, record) => record.currencyFormatter.format(discount * record.amount * calculateCurrentPercentage(record.purchase_date, record.redemption_date, discount))
                },
            ]}
        />}
    </Layout>;
};

export default Stock;
