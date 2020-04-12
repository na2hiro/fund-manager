import {RadialChart} from 'react-vis';
import {FunctionComponent} from "react";
import { percentageFormatter } from '../utils/formatter';

interface Props {
    names: string[],
    currencies: string[],
    sumsNames: number[],
    sumsCurrencies: number[],
    classTargetRatios: number[],
    currencyTargetRatios: number[],
}

const Charts: FunctionComponent<Props> = ({names, currencies, sumsNames, sumsCurrencies, classTargetRatios, currencyTargetRatios}) => {
    return <div style={{display: "flex"}}>
        <div>
            <h3>Per type</h3>
            <PieChartWithTarget names={names} sums={sumsNames} targets={classTargetRatios} />
        </div>
        <div>
            <h3>Per currency</h3>
            <PieChartWithTarget names={currencies} sums={sumsCurrencies} targets={currencyTargetRatios} />
        </div>
    </div>;
};

const chartConfig = {
    width: 300,
    height: 300,
    showLabels: true,
    radius: 120,
    innerRadius: 80,
};
const innerChartConfig = {
    ...chartConfig,
    radius: 77,
    innerRadius: 65,
};

interface PieChartWithTargetProps {
    names: string[],
    sums: number[],
    targets: number[],
}

const PieChartWithTarget: FunctionComponent<PieChartWithTargetProps> = ({ names, sums, targets }) => {
    const visibleNames = names.filter((name, i) => targets[i]>0);
    return (
        <div className="PieChartWithTarget" style={{ height: "300px", width: "300px", "position": "relative" }}>
            <div style={{ position: "absolute", top: 0, left: 0 }}>
                <RadialChart
                    data={visibleNames.map((name, i) => ({
                        angle: sums[i],
                        label: name
                    }))}
                    {...chartConfig}
                />
            </div>
            <div style={{ position: "absolute", top: 0, left: 0 }}>
                <RadialChart
                    data={visibleNames.map((name, i) => ({
                        angle: targets[i],
                        label: percentageFormatter.format(targets[i])
                    }))}
                    {...innerChartConfig}
                />
            </div>
        </div>
    );
};

export default Charts;
