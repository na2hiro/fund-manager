import queryString from 'query-string';

const Callback = () => {
    if (!process.browser) {
        return null;
    }
    var obj = queryString.parse(location.hash);
    if (obj.id_token) {
        console.log(`jwt = ${obj.id_token}; expires=${new Date(new Date().getTime() + obj.expires_in * 1000)}`);
        document.cookie = `jwt = ${obj.id_token}; expires=${new Date(new Date().getTime() + obj.expires_in * 1000)}`;
        location.href = localStorage.getItem("callbackUrl") || "/";
        return null;
    }
    return <>
        <h3>Error!</h3>
        <p>{obj.error_description}</p>
        <p><a href="/">Go back</a></p>
    </>;
};

export default Callback;