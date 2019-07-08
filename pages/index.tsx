import fetch from 'isomorphic-unfetch';
import Table from "../components/Table";
import cookie from 'isomorphic-cookie';
import queryString from 'query-string';
import {FunctionComponent} from "react";

interface Prop {
    data: any,
    redirect_uri: string,
}

const App: FunctionComponent<Prop> = ({data, redirect_uri}) => {
    return <>
        {data
            ? <a href="#" onClick={() => {
                cookie.remove("jwt");
                location.href = "/";
            }}>Log out</a>
            :
            <a
                href={`https://dev--f2asibj.auth0.com/login?${queryString.stringify({
                    client: "2WDgaVybZzReNIKoZ8cuMsv2W08Wf53Y",
                    protocol: "oauth2",
                    response_type: "token id_token",
                    redirect_uri,
                    scope: "openid profile",
                })}`}
                onClick={() => {
                    localStorage.setItem("callbackUrl", location.href);
                }}>Log in</a>}
        <h1>Hello World!</h1>

        {data && <Table data={data}/>}

    </>;
};
App.getInitialProps = async ({req}) => {
    const method = "POST";
    let jwt = cookie.load("jwt", req);
    const headers = {
        "content-type": "application/json",
        "Authorization": "Bearer " + jwt
    };
    const body = JSON.stringify({
        query: `{
  assets_by_class_in_jpy {
    effective_currency
    name
    current_value_jpy
  }
}`
    });
    const res = await fetch("https://na2hiro-gql.herokuapp.com/v1/graphql", {
        method,
        headers,
        body
    });
    const response = await res.json();
    // response.errors
    const {data} = response;

    let redirect_uri;
    if (process.browser) {
        redirect_uri = location.protocol + "//" + location.host + (location.port ? ":" + location.port : "") + "/callback";
    } else {
        console.log(req);
        redirect_uri = "http://" + req.headers.host + "/callback"; // TODO https
    }

    return {
        data,
        redirect_uri,
    };
};

export default App;