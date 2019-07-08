import {useMemo} from 'react';
import {RadialChart} from 'react-vis';

const Table = ({data}) => {
    // TODO memoize
    const [valueMatrix, currencies, names, sumsCurrencies, sumsNames] = useMemo(() => {
        const assets = data.assets_by_class_in_jpy;
        const currencies = uniq(assets.map((v => v.effective_currency)));
        const names = uniq(assets.map((v => v.name)));

        const sumsCurrencies = currencies.map(_ => 0);
        const sumsNames = names.map(_ => 0);

        assets.forEach(asset => {
            sumsCurrencies[currencies.indexOf(asset.effective_currency)] += asset.current_value_jpy;
            sumsNames[names.indexOf(asset.name)] += asset.current_value_jpy;
        });

        const sortedCurrencies=[];
        const sortedSumsCurrencies=[];
        currencies
            .map((currency, i) => [currency, sumsCurrencies[i]])
            .sort((a, b) => b[1] - a[1])
            .forEach(p => {
                sortedCurrencies.push(p[0]);
                sortedSumsCurrencies.push(p[1]);
            });

        const sortedNames =[];
        const sortedSumsNames =[];
        names
            .map((name, i) => [name, sumsNames[i]])
            .sort((a, b) => b[1] - a[1])
            .forEach(p => {
                sortedNames.push(p[0]);
                sortedSumsNames.push(p[1]);
            });

        const valueMatrix = sortedNames.map((name) =>
            sortedCurrencies.map((currency)=>
                0
            )
        );
        assets.forEach(asset => {
            valueMatrix[sortedNames.indexOf(asset.name)][sortedCurrencies.indexOf(asset.effective_currency)] = asset.current_value_jpy
        });
        return [valueMatrix, sortedCurrencies, sortedNames, sortedSumsCurrencies, sortedSumsNames];
    }, data);
    const sumAll = useMemo(() => {
        return sumsCurrencies.reduce((a,b)=>a+b, 0);
    }, [sumsCurrencies]);

    const currencyFormatter = new Intl.NumberFormat('ja-JP', {
        style: 'currency',
        currency: 'JPY'
    });
    const percentageFormatter = new Intl.NumberFormat('ja-JP', {
        style: 'percent',
    });

    const chartConfig = {
        width: 300,
        height: 300,
        showLabels: true,
        radius: 120,
        innerRadius: 60,
    };

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
                {currencies.map(currency => <th key={currency}>{currency}</th>)}
                <th></th>
            </thead>
            <tbody>
            <tr>
                <th></th>
                <td></td>
                {sumsCurrencies.map((sum, i)=><td key={i}>{percentageFormatter.format(sum / sumAll)}</td>)}
                <td></td>
            </tr>
            {valueMatrix.map((row, i) =>
                <tr>
                    <th>{names[i]}</th>
                    <td>{percentageFormatter.format(sumsNames[i] / sumAll)}</td>
                    {row.map((cell, i) => <td key={i}>{currencyFormatter.format(cell)}</td>)}
                    <td>{currencyFormatter.format(sumsNames[i])}</td>
                </tr>
            )}
            <tr>
                <th></th>
                <td></td>
                {sumsCurrencies.map(sum=><td>{currencyFormatter.format(sum)}</td>)}
                <td>{currencyFormatter.format(sumAll)}</td>
            </tr>
            </tbody>
        </table>
        <div style={{display: "flex"}}>
            <div>
                <h3>Per type</h3>
                <RadialChart
                    data={names.map((name, i) => ({
                        angle: sumsNames[i],
                        label: name
                    }))}
                    {...chartConfig}
                />
            </div>
            <div>
                <h3>Per currency</h3>
                <RadialChart
                    data={currencies.map((currency, i) => ({
                        angle: sumsCurrencies[i],
                        label: currency
                    }))}
                    {...chartConfig}
                />
            </div>
        </div>
    </>;
};
export default Table;


function uniq(array) {
    return [...new Set(array)];
}