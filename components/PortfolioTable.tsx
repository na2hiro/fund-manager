import {FunctionComponent} from 'react';
import { percentageFormatter, Formatter } from '../utils/formatter';

interface Props {
    valueMatrix: number[][],
    currencies: string[],
    names: string[],
    sumsCurrencies: number[],
    sumsNames: number[],
    sumAll: number,
    currencyTargetRatios: number[],
    classTargetRatios: number[],
    formatter: Formatter,
}

const PortfolioTable: FunctionComponent<Props> = ({
        valueMatrix,
        currencies,
        names,
        sumsCurrencies,
        sumsNames,
        sumAll,
        currencyTargetRatios,
        classTargetRatios,
        formatter
    }) => {

    return <>
        <table>
            <style jsx>{`
            table, td {border: 1px #ccc solid; border-collapse: collapse}
            th {border: 2px #ccc solid; border-collapse: collapse}
            td {text-align: right}
        `}</style>
            <thead>
                <th></th>
                <th></th>
                <th></th>
                {currencies.map(currency => <th key={currency}>{currency}</th>)}
                <th></th>
            </thead>
            <tbody>
            <tr>
                <th></th>
                <td>Target</td>
                <td></td>
                {currencyTargetRatios.map((ratio, i)=><td key={i}>{percentageFormatter.format(ratio)}</td>)}
                <td></td>
            </tr>
            <tr>
                <th></th>
                <td></td>
                <td>Reality</td>
                {sumsCurrencies.map((sum, i)=><td key={i}>{percentageFormatter.format(sum / sumAll)}</td>)}
                <td></td>
            </tr>
            {valueMatrix.map((row, i) =>
                <tr>
                    <th>{names[i]}</th>
                    <td>{percentageFormatter.format(classTargetRatios[i])}</td>
                    <td>{percentageFormatter.format(sumsNames[i] / sumAll)}</td>
                    {row.map((cell, i) => <td key={i}>{formatter.format(cell)}</td>)}
                    <td>{formatter.format(sumsNames[i])}</td>
                </tr>
            )}
            <tr>
                <th></th>
                <td></td>
                <td></td>
                {sumsCurrencies.map(sum=><td>{formatter.format(sum)}</td>)}
                <td>{formatter.format(sumAll)}</td>
            </tr>
            </tbody>
        </table>
    </>;
};
export default PortfolioTable;
