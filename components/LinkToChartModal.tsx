import { FunctionComponent, useState, useCallback } from "react";
import Modal from "antd/lib/modal/Modal";
import TradingViewWidget from "react-tradingview-widget";

type Props = {
    name: string;
    symbol: string;
}

const LinkToChartModal: FunctionComponent<Props> = ({name, symbol}) => {
    const [isOpen, setOpen] = useState(false);
    const close = useCallback(() => {
        setOpen(false);
    }, [open])
    return <>
        <a onClick={(e)=>{e.stopPropagation(); setOpen(true)}}>{name}</a>
        <Modal
            visible={isOpen}
            onOk={close}
            onCancel={close}
            width="95%"
            bodyStyle={{ height: "600px" }}
            footer={() => <></>}
            centered
        >
            <TradingViewWidget symbol={symbol} autosize />
        </Modal>
    </>;
};

export default LinkToChartModal;