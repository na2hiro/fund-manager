import { useState } from "react";
import {Switch} from "antd";
import React from "react";
import { currencyValueFormatter, percentageFormatter, Formatter } from "../utils/formatter";

const useCurrencyFormatterContextAndToggle: (totalAmount: number) => [Formatter, JSX.Element] = (totalAmount: number) => {
    const [isMasked, setMasked] = useState(false);

    const formatter: Formatter = isMasked ?
        {format: (amount: number) => percentageFormatter.format(amount / totalAmount) } :
        currencyValueFormatter;
    const component = <Switch onChange={(checked)=>setMasked(checked)} checkedChildren="%" unCheckedChildren="¥"  />

    return [
        formatter,
        component
    ];
};

export default useCurrencyFormatterContextAndToggle;