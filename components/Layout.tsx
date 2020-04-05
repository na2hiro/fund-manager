import Link from "next/link";
import {Menu} from 'antd';
import {PieChartOutlined, StockOutlined, TransactionOutlined, RedEnvelopeOutlined, GoldOutlined, LoginOutlined, LogoutOutlined, AccountBookOutlined} from "@ant-design/icons"
import 'antd/dist/antd.css';
import {gql} from "apollo-boost";
import queryString from 'query-string';
import cookie from 'isomorphic-cookie';
import {FunctionComponent} from "react";
import { useQuery } from "react-apollo-hooks";
import { Portfolio } from "../__generated__/Portfolio";

interface Props {
    selectedMenu: string,
}

const ASSET_BY_CLASS_IN_JPY = gql`
query Portfolio{
    assets_full(limit: 0) {
        name
    }
}`;

const Layout: FunctionComponent<Props> = ({children, selectedMenu}) => {
    return <>
        <header>
        </header>
        <nav>
            <Menu mode="horizontal" selectedKeys={[selectedMenu]}>
                <Menu.Item key="portfolio"><Link href="/"><a>
                    <PieChartOutlined />
                    Portfolio
                </a></Link></Menu.Item>
                <Menu.Item key="accounts"><Link href="/accounts"><a><AccountBookOutlined />Accounts</a></Link></Menu.Item>
                <Menu.Item key="fx"><Link href="/fx"><a><TransactionOutlined />Cash / FX</a></Link></Menu.Item>
                <Menu.Item key="stock"><Link href="/stock"><a><StockOutlined />Stock & ETF</a></Link></Menu.Item>
                <Menu.Item key="bond"><Link href="/bond"><a><RedEnvelopeOutlined />Bond</a></Link></Menu.Item>
                <Menu.Item key="commodities" disabled><Link href="/commodities"><a><GoldOutlined />Commodities</a></Link></Menu.Item>
                <Menu.Item key="loginout" style={{float: "right"}}>
                    <LogInOut />
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
};

const LogInOut = () => {
    const {loading, error} = useQuery<Portfolio>(ASSET_BY_CLASS_IN_JPY);
    if (loading) return <></>;
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
            }}><LoginOutlined />Log in</a>
    } else {
        return <a href="#" onClick={() => {
            cookie.remove("jwt");
            location.href = "/";
        }}><LogoutOutlined />Log out</a>
    }
}

export default Layout;
