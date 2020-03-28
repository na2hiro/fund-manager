import {useMemo} from "react";

const useMemoedPortfolioProps = (data: any) => { // TODO
    const [valueMatrix, currencies, names, sumsCurrencies, sumsNames, currencyTargetRatios, classTargetRatios] = useMemo(() => {
        const assets = data.assets_by_class_in_jpy;
        const currencies = uniq(assets.map((v => v.effective_currency)));
        const names = uniq(assets.map((v => v.name)));

        const sumsCurrencies = currencies.map(_ => 0);
        const sumsNames = names.map(_ => 0);

        assets.forEach(asset => {
            sumsCurrencies[currencies.indexOf(asset.effective_currency)] += asset.current_value_jpy;
            sumsNames[names.indexOf(asset.name)] += asset.current_value_jpy;
        });

        const sortedCurrencies: string[] = [];
        const sortedSumsCurrencies: number[] = [];
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

        const currencyTargetRatios = sortedCurrencies.map(currency => (data.currency.nodes.filter(node => node.type==currency)[0] || {}).ratio);
        const classTargetRatios = sortedNames.map(name => (data.class.nodes.filter(node => node.type==name)[0] || {}).ratio);

        return [valueMatrix, sortedCurrencies, sortedNames, sortedSumsCurrencies, sortedSumsNames, currencyTargetRatios, classTargetRatios];
    }, data);

    const sumAll = useMemo(() => {
        return sumsCurrencies.reduce((a, b) => a + b, 0);
    }, [sumsCurrencies]);

    return {
        valueMatrix, currencies, names, sumsCurrencies, sumsNames, sumAll, currencyTargetRatios, classTargetRatios
    }
};

function uniq(array) {
    return [...new Set(array)];
}

export default useMemoedPortfolioProps;