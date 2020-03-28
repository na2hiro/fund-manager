import React from "react";
import { Spin, Alert} from "antd";
import { ApolloError } from "apollo-boost";

export const loadingOrError: (arg: {loading: boolean, error: ApolloError | undefined}) => React.ReactElement | null = ({loading, error}) => {
    if (loading) return <Spin/>;
    if (error) return <Alert message={ error.toString() } type = "error" />;
    return null;
};