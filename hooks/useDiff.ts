import {useReducer} from "react";

interface Diff {
    [class_and_currency: string]: number // TODO hide
}

interface DispatchDiff {
    (action: { class: string, currency: string, amount: number}): void;
}

const getDiff = (diff: Diff, className: string, currencyName: string) => (
    diff[getDiffMapKey(className, currencyName)] || 0
);

const getDiffMapKey = (className: string, currencyName: string) => (
    className + "_" + currencyName
);
const isBase = (className: string, currencyName: string) => (
    className == BASE_CLASS && currencyName == BASE_CURRENCY
);

const BASE_CLASS = "Cash / FX";
const BASE_CURRENCY = "JPY";
const BASE_KEY = getDiffMapKey(BASE_CLASS, BASE_CURRENCY);

const useDiff: () => [Diff, DispatchDiff] = () => {
    const [diffMatrix, dispatch] = useReducer((state, action) => {
        if (action.class === BASE_CLASS && action.currency === BASE_CURRENCY) {
            return state;
        }
        const key = getDiffMapKey(action.class, action.currency);
        const originalAmount = state[key] || 0;
        return {
            ...state,
            [BASE_KEY]: (state[BASE_KEY] || 0) - action.amount + originalAmount,
            [key]: action.amount,
        };
    }, /*() =>*/ {});

    return [diffMatrix, dispatch];
};

export default useDiff;


export {
    Diff,
    DispatchDiff,
    getDiffMapKey,
    getDiff,
    isBase,
}
