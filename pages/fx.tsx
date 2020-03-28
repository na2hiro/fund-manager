import Layout from "../components/Layout";
import {FunctionComponent} from "react";
import FxInsert from "../components/fx/FxInsert";
import * as React from "react";
import FxSummary from "../components/fx/FxSummary";
import FxTrades from "../components/fx/FxTrades";

interface Prop {
}

const Stock: FunctionComponent<Prop> = ({}) => {
    return <Layout selectedMenu="fx">
        <h1>FX</h1>

        <h2>Add trades</h2>
        <FxInsert />

        <h2>Summary</h2>
        <FxSummary />

        <h2>Trades</h2>
        <FxTrades />
    </Layout>;
};

export default Stock;
