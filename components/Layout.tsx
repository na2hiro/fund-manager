import Link from "next/link";
import {Menu, Icon} from 'antd';
import 'antd/dist/antd.css';
import {Query} from "react-apollo";
import {gql} from "apollo-boost";
import queryString from 'query-string';
import cookie from 'isomorphic-cookie';
import {FunctionComponent} from "react";
import SubMenu from "antd/lib/menu/SubMenu";

interface Props {
    selectedMenu: string,
}

const Layout: FunctionComponent<Props> = ({children, selectedMenu}) => (
    <>
        <header>
        </header>
        <nav>
            <Menu mode="horizontal" selectedKeys={[selectedMenu]}>
                <Menu.Item key="portfolio"><Link href="/"><a>
                    <Icon type="pie-chart" />
                    Portfolio
                </a></Link></Menu.Item>
                <SubMenu title={<><Icon type="account-book" />Balance</>}>
                    <Menu.Item key="stock"><Link href="/stock"><a><Icon type="stock" />Stock & ETF</a></Link></Menu.Item>
                    <Menu.Item key="fx"><Link href="/fx"><a><Icon type="transaction" />Cash / FX</a></Link></Menu.Item>
                    <Menu.Item key="bond" disabled><Link href="/bond"><a><Icon type="red-envelope" />Bond</a></Link></Menu.Item>
                    <Menu.Item key="commodities" disabled><Link href="/commodities"><a><Icon type="gold" />Commodities</a></Link></Menu.Item>
                </SubMenu>
                <Menu.Item key="loginout">
                    <Query query={gql`
                        {
                            assets_by_class_in_jpy(limit: 0) {
                                name
                            }
                        }
                    `}>
                        {({loading, error, data}) => {
                            console.log("layout", loading, error, data);
                            if (loading) return "";
                            if (error) {
                                const url = `https://dev--f2asibj.auth0.com/login?${queryString.stringify({
                                    client: "2WDgaVybZzReNIKoZ8cuMsv2W08Wf53Y",
                                    protocol: "oauth2",
                                    response_type: "token id_token",
                                    redirect_uri: location.protocol + "//" + location.host + "/callback",
                                    scope: "openid profile",
                                })}`;
                                return <a
                                    href={url}
                                    onClick={(e) => {
                                        localStorage.setItem("callbackUrl", location.href);
                                        e.stopPropagation();
                                        location.href = url;
                                    }}><Icon type="login" />Log in</a>
                            } else {
                                return <a href="#" onClick={() => {
                                    cookie.remove("jwt");
                                    location.href = "/";
                                }}><Icon type="logout" />Log out</a>
                            }
                        }}
                    </Query>
                </Menu.Item>
            </Menu>
        </nav>
        <main>
            <style jsx>{`
                main { margin: 15px; }
            `}</style>
            {children}
        </main>
        <footer>
            <a href="https://github.com/na2hiro/fund-manager">fund-manager by na2hiro</a>
        </footer>
    </>
);

export default Layout;