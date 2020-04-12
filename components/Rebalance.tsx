import { FunctionComponent, useState, useCallback } from "react";
import { Diff, DispatchDiff } from "../hooks/useDiff";
import { Formatter } from "../utils/formatter";
import { Spin, Button, Steps, Result, Popconfirm } from "antd";
import PortfolioDiffTable from "./PortfolioDiffTable";
import Link from "next/link";
import { gql } from "apollo-boost";
import { useApolloClient } from "react-apollo-hooks";

const {Step} = Steps;

const CLEAR_BALANCING = gql`
mutation ClearBalancing{
  delete_portfolio_balancing(where: {}) {
    affected_rows
  }
}`;

interface Props {
    diff: Diff | null,
    dispatchDiff: DispatchDiff,
    currencies: string[],
    names: string[],
    diffsCurrencies: number[],
    diffsNames: number[],
    formatter: Formatter,
}
const Rebalance: FunctionComponent<Props> = ({diff, dispatchDiff, currencies, names, diffsNames, diffsCurrencies, formatter}) => {
    const [step, setStep] = useLocalStorageBackedState(-1);
    const client = useApolloClient();

    if (!diff) {
        return <Spin />;
    }
    if (step < 0) {
        if (diff.filter(d => d.amount > 0).length > 0) {
            setStep(2);
            return <></>;
        }
        return <Button type="primary" size="large" onClick={() => setStep(0)}>Start rebalance</Button>
    }
    return (
        <>
            <div style={{width: "800px"}}>
                <Steps current={step}>
                    <Step title="Update account status" />
                    <Step title="Update onboarding" />
                    <Step title="Rebalance" />
                </Steps>
            </div>
            {step==0 && <>
                <Link href="/accounts">Go to accounts tab</Link> TODO
                <br />
                <Button type="primary" size="large" onClick={() => setStep(1)}>Done updating accounts</Button>
            </>}
            {step==1 && <>
                <Link href="/onboarding">Go to onboarding tab</Link> TODO
                <br />
                <Button type="primary" size="large" onClick={() => setStep(2)}>Done updating onboarding</Button>
            </>}
            {step==2 && 
                <>
                    <PortfolioDiffTable {...{
                        diff,
                        dispatchDiff,
                        currencies,
                        names,
                        diffsNames,
                        diffsCurrencies,
                        formatter
                    }} />
                    <Popconfirm title="Are you ok to clear the rebalance table?" onConfirm={() => {
                        setStep(3);
                        client.mutate({mutation: CLEAR_BALANCING});
                    }}>
                        <Button type="primary" size="large" >Done rebalancing</Button>
                    </Popconfirm>
                </>}
            {step == 3 && <Result status="success" title="Rebalance done!" />}
        </>
    )
}

const useLocalStorageBackedState: (initialState: number) => [number, (step: number) => void] = (initialState: number) => {
    const cachedState = (typeof localStorage !== "undefined") &&
        parseInt(localStorage.getItem("portfolio-step") || "");
    const [step, setStep] = useState(cachedState===false || isNaN(cachedState) ? initialState : cachedState);

    const setCachedState = useCallback((newStep: number) => {
        setStep(newStep);
        if(typeof localStorage !== "undefined") {
            if(newStep == 3) {
                localStorage.removeItem("portfolio-step");
            } else {
                localStorage.setItem("portfolio-step", newStep.toString());
            }
        }
    }, []);

    return [step, setCachedState];
}

export default Rebalance;