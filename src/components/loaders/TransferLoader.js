import React from 'react'
import { Modal } from "react-bootstrap"
import "../../style/transferLoadersStyle.css";

export default function TransferLoader() {

    return (
        <Modal className="transfer-loader-modal" animation={false} show={true} size="sm" >
            <Modal.Header className="border-0">
                <Modal.Title><div className="transfer-loader__animation"><Animation /></div></Modal.Title>
            </Modal.Header>
            <Modal.Body className='transfer-loader__body'>
                <div className="transfer-loader__title">Transaction Processing</div>
                <div className="transfer-loader__text">The transaction time is unpredictably long due to the congestion on the blockchain.</div>
                <div className="transfer-loader__sub">💙 Please be patient</div>
            </Modal.Body>
        </Modal>
    )
}

function Animation(){
    return(
        <div className="center">
            <div className="wave"></div>
            <div className="wave"></div>
            <div className="wave"></div>
            <div className="wave"></div>
            <div className="wave"></div>
            <div className="wave"></div>
            <div className="wave"></div>
            <div className="wave"></div>
            <div className="wave"></div>
            <div className="wave"></div>
        </div>
    )
}