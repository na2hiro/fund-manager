import {useEffect, useReducer} from "react";
import {useApolloClient} from "react-apollo-hooks";
import {gql} from "apollo-boost";
import { GetBalancing } from "../__generated__/GetBalancing";

type Diff = DiffRow[];
type DiffKey = {
    class: string,
    amount: number,
}
type DiffRow = {
    currency: string,
} & DiffKey

type Action = {
    type: "set",
    data: Diff,
} |  ({
    type: "change",
} & DiffRow | {
    type: "update",
} & DiffRow);

interface DispatchDiff {
    (action: Action): void;
}

const isBase = (className: string, currencyName: string) => (
    className == BASE_CLASS && currencyName == BASE_CURRENCY
);

const BASE_CLASS = "Cash / FX";
const BASE_CURRENCY = "JPY";
const GET_BALANCING = gql`
query GetBalancing{
  portfolio_balancing {
    amount
    class
    currency
  }
}`;

const UPSERT_BALANCING = gql`
mutation UpsertBalancing($amount: numeric, $class: String, $currency: String){
    insert_portfolio_balancing(objects: {amount: $amount, class: $class, currency: $currency}, on_conflict: {constraint: portfolio_balancing_pkey, update_columns: amount}) {
        returning {
            amount
        }
    }
}`;

const push0IfNotExist = (diff: Diff, currency: string, klass: string) => {
    if (!diff.some(diffRow => diffRow.currency == currency && diffRow.class == klass)) {
        diff.push({
            class: klass,
            currency,
            amount: 0
        });
    }
    return diff;
};

const useDiff: () => [Diff, DispatchDiff] = () => {
    const client = useApolloClient();
    const [diff, dispatch] = useReducer((state: Diff, action: Action) => {
        switch (action.type) {
            case "set":
                const sum = action.data.reduce((previousValue, currentValue) => previousValue + currentValue.amount, 0);
                const diff = action.data.slice();
                diff.push({
                    currency: BASE_CURRENCY,
                    class: BASE_CLASS,
                    amount: -sum,
                });
                return diff;
            case "change":
                const zeroPadded = push0IfNotExist(state.slice(), action.currency, action.class);
                let sumOfBase = 0;
                const rowUpdated = zeroPadded
                    .filter(diffRow => !isBase(diffRow.class, diffRow.currency))
                    .map(diffRow => {
                        if (diffRow.class == action.class && diffRow.currency == action.currency) {
                            sumOfBase += action.amount;
                            return {
                                ...diffRow,
                                amount: action.amount,
                            };
                        } else {
                            sumOfBase += diffRow.amount;
                            return diffRow;
                        }
                    });
                rowUpdated.push({
                    class: BASE_CLASS,
                    currency: BASE_CURRENCY,
                    amount: -sumOfBase
                });
                return rowUpdated;
            case "update":
                client.mutate({
                    mutation: UPSERT_BALANCING,
                    variables: {
                        amount: action.amount,
                        class: action.class,
                        currency: action.currency,
                    }
                });
                return state;
        }
    }, []);
    useEffect(() => {
        const f = async () => {
            const {data} = await client.query<GetBalancing>({
                query: GET_BALANCING
            });
            dispatch({
                type: "set",
                data: data.portfolio_balancing,
            })
        };
        f();
    }, []);

    return [diff, dispatch];
};

export default useDiff;

export {
    Diff,
    DispatchDiff,
    isBase,
}
