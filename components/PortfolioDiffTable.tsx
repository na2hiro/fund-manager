import React, {FunctionComponent} from 'react';
import {InputNumber} from "antd";
import {Diff, DispatchDiff} from "../hooks/useDiff";
import { Formatter } from '../utils/formatter';

interface Props {
    diff: Diff,
    dispatchDiff: DispatchDiff,
    currencies: string[],
    names: string[],
    diffsCurrencies: number[],
    diffsNames: number[],
    formatter: Formatter,
}

const isBase = (className: string, currencyName: string) => (
    className == BASE_CLASS && currencyName == BASE_CURRENCY
);

const BASE_CLASS = "Cash / FX";
const BASE_CURRENCY = "JPY";

const PortfolioDiffTable: FunctionComponent<Props> = (props) => {
    const {
        diff,
        dispatchDiff,
        currencies,
        names,
        diffsCurrencies,
        diffsNames,
        formatter,
    } = props;

    return (
        <table>
            <style jsx>{`
                    table, td {border: 1px #ccc solid; border-collapse: collapse}
                    th {border: 2px #ccc solid; border-collapse: collapse}
                    td {text-align: right}
                `}</style>
            <thead>
            <th></th>
            {currencies.map(currency => <th key={currency}>{currency}</th>)}
            <th></th>
            </thead>
            <tbody>
            {names.map((name, i) =>
                <tr key={name}>
                    <th>{name}</th>
                    {currencies.map(currency => <td key={currency}>
                        <InputNumber
                            value={diff.filter(d => d.currency == currency && d.class == name).map(d => d.amount)[0] || 0}
                            step={10000}
                            disabled={isBase(name, currency)}
                            onChange={(amount) => {
                                dispatchDiff({type: "change", currency, class: name, amount: amount || 0});
                            }}
                            onBlur={(e) => {
                                dispatchDiff({
                                    type: "update",
                                    currency,
                                    class: name,
                                    amount: parseInt(e.target.value),
                                })
                            }}/>
                    </td>)}
                    <td>{formatter.format(diffsNames[i] - diff.filter(d => d.class == names[i]).reduce((previous, current) => previous + current.amount, 0))}</td>
                </tr>
            )}
            <tr>
                <th></th>
                {diffsCurrencies.map((diffC, i) => <td>
                    {formatter.format(diffC - diff.filter(d => d.currency == currencies[i]).reduce((previous, current) => previous + current.amount, 0))}
                </td>)}
                <td></td>
            </tr>
            </tbody>
        </table>
    )
};
export default PortfolioDiffTable;
