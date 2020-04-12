import Layout from "../components/Layout";
import PortfolioTable from "../components/PortfolioTable";
import {FunctionComponent} from "react";
import {gql} from "apollo-boost";
import Charts from "../components/Charts";
import useMemoedPortfolioProps from "../hooks/useMemoedPortfolioProps";
import useDiff from "../hooks/useDiff";
import { useQuery } from "react-apollo-hooks";
import { loadingOrError } from "../utils/apolloUtils";
import { PortfolioOverview } from "../__generated__/PortfolioOverview";
import useCurrencyFormatterContextAndToggle from "../hooks/useCurrencyFormatterContextAndToggle";
import Rebalance from "../components/Rebalance";

interface Prop {
}

const PORTFOLIO_OVERVIEW = gql`
query PortfolioOverview{
  assets_full {
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
    const {loading, error, data} = useQuery<PortfolioOverview>(PORTFOLIO_OVERVIEW);
    const [diff, dispatchDiff] = useDiff();
    const {valueMatrix, currencies, names, sumsCurrencies, sumsNames, sumAll, currencyTargetRatios, classTargetRatios} = useMemoedPortfolioProps(error ? undefined : data, diff);
    const [formatter, toggle] = useCurrencyFormatterContextAndToggle(sumAll);

    return <Layout selectedMenu="portfolio">
        <h1>Portfolio</h1>
        {loadingOrError({loading, error}) || <>
            <Charts {...{names, currencies, sumsNames, sumsCurrencies, classTargetRatios, currencyTargetRatios}} />
            {toggle}
            <PortfolioTable {...{
                valueMatrix,
                currencies,
                names,
                sumsCurrencies,
                sumsNames,
                sumAll,
                currencyTargetRatios,
                classTargetRatios,
                formatter
            }}/>

            <h2>Rebalance</h2>
            <Rebalance {...{
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
                formatter
            }} />
        </>}
    </Layout>;
};

export default Portfolio;
