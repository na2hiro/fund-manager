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

const FxInsert = () => {
    const [insertFx, {data}] = useMutation(INSERT_FX);
    return (
        <Form layout="inline" className="ant-advanced-search-form" onFinish={(variables) => {
            e.preventDefault();
            // TODO validation
            /*form.validateFields((err, values) => {
                console.log('Received values of form: ', values, err);
            });*/
            variables.date = variables.date.format("YYYY-MM-DD");
            variables.currency_pair_id = parseInt(variables.currency_pair_id);
            insertFx({variables});
            form.setFieldsValue({price: "", amount: ""})
        }} initialValues={{date: moment()}}>
            <Form.Item name="date">
                <DatePicker />
            </Form.Item>
            <Form.Item name="currency_pair_id">
                <FxCurrencyDropdown />
            </Form.Item>
            <Form.Item name="price" rules={[{required: true}]}>
                <InputNumber placeholder="price"/>
            </Form.Item>
            <Form.Item name="amount">
                <InputNumber placeholder="amount"/>
            </Form.Item>
            <Form.Item>
                <Button type="primary" htmlType="submit">
                    Submit
                </Button>
            </Form.Item>
        </Form>
    );
};

const LIST_CURRENCIES = gql`
{
  currency_pair {
    id
    long_currency
    short_currency
  }
}`;

const FxCurrencyDropdown = () => {
    const {loading, error, data} = useQuery(LIST_CURRENCIES);
    return loadingOrError({loading, error}) || <Select
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
    </Select>;
};

export default FxInsert;
