import { FunctionComponent } from "react";
import { Diff } from "../../hooks/useDiff";
import { Table } from "antd";
import { jpyFormatter } from "../../utils/formatter";

interface Props {
    diff: Diff;
}

const RebalanceTradePlan: FunctionComponent<Props> = ({diff}) => {
    return <>{diff.filter(d => d.amount>0).map(type => {
        return <>
            <h3>{type.class} in {type.currency}</h3>
            <Table 
                pagination={false}
                dataSource={[]}
                columns={[
                    { dataIndex: "name", title: "Name" },
                    {
                        dataIndex: "currency",
                        align: "right",
                        title: "Currency",
                    },
                    {
                        dataIndex: "price",
                        align: "right",
                        title: "Price",
                    },
                    {
                        dataIndex: "amount",
                        align: "right",
                        title: "Amount",
                    },
                    {
                        dataIndex: "value",
                        align: "right",
                        title: "Value"
                    },
                ]}
                summary={() =>{
                    return <tr>
                        <th>Total</th>
                        <th></th>
                        <th></th>
                        <th></th>
                        <th style={{textAlign: "right"}}>{jpyFormatter.format(type.amount)}</th>
                    </tr>
                }}
            />
        </>
    })}</>;
}

export default RebalanceTradePlan;