import {Button, DatePicker, Form, InputNumber, Select} from "antd";
import React from "react";
import moment from "moment";
import {gql} from "apollo-boost";
import {useMutation, useQuery} from "react-apollo-hooks";
import { loadingOrError } from "../../utils/apolloUtils";

const INSERT_FX = gql`
mutation ($amount: Int, $date: date, $price: numeric, $currency_pair_id: Int) {
  insert_currency_trade(objects: {amount: $amount, date: $date, price: $price, currency_pair_id: $currency_pair_id}) {
    returning {
      id
    }
  }
}
`;

const FxInsertForm = ({form}) => {
    const {getFieldDecorator} = form;
    const [insertFx, {data}] = useMutation(INSERT_FX);
    return (
        <Form layout="inline" className="ant-advanced-search-form" onSubmit={(e) => {
            e.preventDefault();
            // TODO validation
            /*form.validateFields((err, values) => {
                console.log('Received values of form: ', values, err);
            });*/
            let variables = form.getFieldsValue();
            variables.date = variables.date.format("YYYY-MM-DD");
            variables.currency_pair_id = parseInt(variables.currency_pair_id);
            insertFx({variables});
            form.setFieldsValue({price: "", amount: ""})
        }}>
            <Form.Item>
                {getFieldDecorator("date", {initialValue: moment()})(<DatePicker />)}
            </Form.Item>
            <Form.Item>
                <FxCurrencyDropdown getFieldDecorator={getFieldDecorator} />
            </Form.Item>
            <Form.Item>
                {getFieldDecorator("price")(<InputNumber placeholder="price"/>)}
            </Form.Item>
            <Form.Item>
                {getFieldDecorator("amount")(<InputNumber placeholder="amount"/>)}
            </Form.Item>
            <Form.Item>
                <Button type="primary" htmlType="submit">
                    Submit
                </Button>
            </Form.Item>
        </Form>
    );
};

const FxInsert = Form.create()(FxInsertForm);

const LIST_CURRENCIES = gql`
{
  currency_pair {
    id
    long_currency
    short_currency
  }
}`;

const FxCurrencyDropdown = ({getFieldDecorator}) => {
    const {loading, error, data} = useQuery(LIST_CURRENCIES);
    return loadingOrError({loading, error}) || getFieldDecorator("currency_pair_id", {rules: [{required: true}]})(<Select
        showSearch
        filterOption={(input, option) =>
            option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
        }
        style={{width: "100px"}}
        placeholder="currency"
    >
        {data.currency_pair.map(row => <Select.Option key={row.id}>
            {row.long_currency + row.short_currency}
        </Select.Option>)}
    </Select>)
};

export default FxInsert;
