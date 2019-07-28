import {FunctionComponent} from 'react';
import {InputNumber} from "antd";
import {Diff, DispatchDiff, getDiff, isBase} from "../hooks/useDiff";

interface Props {
    diff: Diff,
    dispatchDiff: DispatchDiff,
    currencies: string[],
    names: string[],
    diffsCurrencies: number[],
    diffsNames: number[],
}

const PortfolioDiffTable: FunctionComponent<Props> = (props) => {
    const {
        diff,
        dispatchDiff,
        currencies,
        names,
        diffsCurrencies,
        diffsNames,
    } = props;
    const currencyFormatter = new Intl.NumberFormat('ja-JP', {
        style: 'currency',
        currency: 'JPY'
    });
    const percentageFormatter = new Intl.NumberFormat('ja-JP', {
        style: 'percent',
        minimumFractionDigits: 1
    });

    return <>
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
                    {/*<td>{percentageFormatter.format(classTargetRatios[i])}</td>*/}
                    {currencies.map(currency => <td key={currency}>
                        <InputNumber value={getDiff(diff, name, currency)} onChange={(amount) => {
                            dispatchDiff({class: name, currency, amount})
                        }} /*formatter={currencyFormatter.format}*/ step={10000}
                                     disabled={isBase(name, currency)}/>
                    </td>)}
                    <td>{currencyFormatter.format(diffsNames[i])}</td>
                    {/* <td>{currencyFormatter.format(sumsNames[i])}</td>*/}
                </tr>
            )}
            <tr>
                <th></th>
                {diffsCurrencies.map(diff => <td>{currencyFormatter.format(diff)}</td>)}
                <td></td>
            </tr>
            </tbody>
        </table>
    </>;
};
export default PortfolioDiffTable;
