import {RadialChart} from 'react-vis';
import {FunctionComponent} from "react";

const chartConfig = {
    width: 300,
    height: 300,
    showLabels: true,
    radius: 120,
    innerRadius: 60,
};

interface Props {
    names: string[],
    currencies: string[],
    sumsNames: number[],
    sumsCurrencies: number[],
}

const Charts: FunctionComponent<Props> = ({names, currencies, sumsNames, sumsCurrencies}) => {
    return <div style={{display: "flex"}}>
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
    </div>;
};

export default Charts;
