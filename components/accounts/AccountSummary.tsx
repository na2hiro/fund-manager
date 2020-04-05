import { gql } from "apollo-boost";
import { Table } from "antd";
import { useQuery } from "react-apollo-hooks";
import { loadingOrError } from "../../utils/apolloUtils";
import { valueRenderer, currencyValueFormatter } from "../../utils/formatter";
import { GetAccountLatest, GetAccountLatest_account_latest } from "../../__generated__/GetAccountLatest";
import { FunctionComponent } from "react";

const GET_SUMMARY = gql`
query GetAccountLatest {
  account_latest {
    latest_date
    latest_amount
    id
    account {
      currency
      name
    }
  }
  account_latest_aggregate {
    aggregate {
      sum {
        latest_amount
      }
    }
  }
}`;

const AccountSummary: FunctionComponent<{}> = () => {
    const {loading, error, data} = useQuery<GetAccountLatest>(GET_SUMMARY);
    return loadingOrError({loading, error}) || <Table
        bordered
        rowKey={(row) => row!.id!}
        dataSource={data!.account_latest
            .map((row: GetAccountLatest_account_latest) => ({
                ...row,
                currencyValueFormatter: new Intl.NumberFormat('ja-JP', {
                    style: "currency",
                    currency: row!.account!.currency,
                    minimumFractionDigits: 0,
                }),
                currencyFormatter: new Intl.NumberFormat('ja-JP', {
                    style: "currency",
                    currency: row!.account!.currency,
                    minimumFractionDigits: 2,
                }),
            }))}
        summary={() =>{
            return <tr>
                <th></th>
                <th></th>
                <th style={{textAlign: "right"}}>{currencyValueFormatter.format(data!.account_latest_aggregate.aggregate!.sum!.latest_amount!)}</th>
            </tr>
        }}
        columns={[
            {
                dataIndex: ["account", "name"],
                align: "right",
                title: "Name",
            },
            {dataIndex: "latest_date", align: "right", title: "Latest date"},
            {dataIndex: "latest_amount", align: "right", title: "Latest amount", render: valueRenderer},
        ]}
    />
}

export default AccountSummary;