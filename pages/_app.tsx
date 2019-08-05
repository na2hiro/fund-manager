import ApolloClient from "apollo-boost";
import cookie from "isomorphic-cookie";
import {ApolloProvider} from "react-apollo";
import {ApolloProvider as ApolloHooksProvider} from "react-apollo-hooks";
import fetch from 'isomorphic-unfetch';

let jwt = cookie.load("jwt"/*, req*/);
const client = new ApolloClient({
    uri: "https://na2hiro-gql.herokuapp.com/v1/graphql",
    headers: {
        "Authorization": "Bearer " + jwt,
        fetch
    }
});

const App = ({Component, pageProps}) => (
    <ApolloProvider client={client}>
        <ApolloHooksProvider client={client}>
            <Component {...pageProps} />
        </ApolloHooksProvider>
    </ApolloProvider>
);

export default App;
