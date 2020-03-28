import Layout from "../components/Layout";
import {FunctionComponent} from "react";
import StockSummary from "../components/stock/StockSummary";
import StockTrades from "../components/stock/StockTrades";

interface Prop {
}

const Stock: FunctionComponent<Prop> = ({}) => {
    return <Layout selectedMenu="stock">
        <h1>Stock</h1>
        <h2>Summary</h2>
        <StockSummary />
        <h2>Trades</h2>
        <StockTrades />
    </Layout>;
};

export default Stock;
