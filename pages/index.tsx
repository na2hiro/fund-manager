import Layout from "../components/Layout";
import PortfolioTable from "../components/PortfolioTable";
import {FunctionComponent, ReactElement} from "react";
import {gql} from "apollo-boost";
import Charts from "../components/Charts";
import PortfolioDiffTable from "../components/PortfolioDiffTable";
import useMemoedPortfolioProps from "../hooks/useMemoedPortfolioProps";
import useDiff, {Diff, DispatchDiff} from "../hooks/useDiff";
import { useQuery } from "react-apollo-hooks";
import { loadingOrError } from "../utils/apolloUtils";

interface Prop {
}

const PORTFOLIO_OVERVIEW = gql`
{
  assets_by_class_in_jpy {
    effective_currency
    name
    current_value_jpy
  }
  currency: portfolio_aggregate(where: {axis: {_eq: "currency"}}) {
    nodes {
      ratio
      type
    }
  }
  class: portfolio_aggregate(where: {axis: {_eq: "class"}}) {
    nodes {
      ratio
      type
    }
  }
}`;

const Portfolio: FunctionComponent<Prop> = ({}) => {
    const {loading, error, data} = useQuery(PORTFOLIO_OVERVIEW);
    return <Layout selectedMenu="portfolio">
        <h1>Portfolio</h1>
        {loadingOrError({loading, error}) || <PortfolioProvider data={data}>
            {({
                valueMatrix,
                currencies,
                names,
                sumsCurrencies,
                sumsNames,
                sumAll,
                currencyTargetRatios,
                classTargetRatios,
                diff,
                dispatchDiff,
            }) => <>
                <PortfolioTable {...{
                    valueMatrix,
                    currencies,
                    names,
                    sumsCurrencies,
                    sumsNames,
                    sumAll,
                    currencyTargetRatios,
                    classTargetRatios
                }}/>
                <Charts {...{names, currencies, sumsNames, sumsCurrencies}} />
                <PortfolioDiffTable {...{
                    diff,
                    dispatchDiff,
                    currencies,
                    names,
                    diffsNames: sumsNames.map((sum, i) => (
                        (sumAll * classTargetRatios[i]) - sum
                    )),
                    diffsCurrencies: sumsCurrencies.map((sum, i) => (
                        (sumAll * currencyTargetRatios[i]) - sum
                    )),
                }}/>
            </>}
        </PortfolioProvider>}
    </Layout>;
};
interface PortfolioProps {
    valueMatrix: number[][],
    currencies: string[],
    names: string[],
    sumsCurrencies: number[],
    sumsNames: number[],
    sumAll: number,
    currencyTargetRatios: number[],
    classTargetRatios: number[],
    diff: Diff,
    dispatchDiff: DispatchDiff;
}

interface Props {
    data: PortfolioProps;
    children: (props: PortfolioProps) => ReactElement;
}

const PortfolioProvider: FunctionComponent<Props> = ({data, children}) => {
    const {valueMatrix, currencies, names, sumsCurrencies, sumsNames, sumAll, currencyTargetRatios, classTargetRatios} = useMemoedPortfolioProps(data);

    const [diff, dispatchDiff] = useDiff();

    return children({
        valueMatrix,
        currencies,
        names,
        sumsCurrencies,
        sumsNames,
        sumAll,
        currencyTargetRatios,
        classTargetRatios,
        diff,
        dispatchDiff,
    });
};

export default Portfolio;
