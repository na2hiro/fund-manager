import Layout from "../components/Layout";
import {FunctionComponent} from "react";
import * as React from "react";
import AccountSummary from "../components/accounts/AccountSummary";

interface Prop {
}

const Accounts: FunctionComponent<Prop> = ({}) => {
    return <Layout selectedMenu="accounts">
        <h1>Accounts</h1>

        <h2>Summary</h2>
        <AccountSummary />

        <h2>Add trades</h2>
    </Layout>;
};

export default Accounts;
