import React, { useState } from 'react';
import { ethers } from 'ethers';
import Vault_abi from './Vault_ABI.json';

const Vault = () => {

    const contractAddress = '0xd47A584727c8C84559073859567F5d6300fd24B6';

    const [errorMessage, setErrorMessage] = useState(null);
    const [defaultAccount, setDefaultAccount] = useState(null);
    const [connectButtonText, setConnectButtonText] = useState('Connect Wallet');
    
    const [currentContractVal, setCurrentContractVal] = useState(null);

    const [provider, setProvider] = useState(null);
    const [signer, setSigner] = useState(null);
    const [contract, setContract] = useState(null);

    const connectWalletHandler = () => {
        if (window.ethereum) {
            // https://docs.metamask.io/guide/ethereum-provider.html#using-the-provider
            window.ethereum.request({ method: 'eth_requestAccounts' })
            .then(result => {
                accountChangedHandler(result[0]);
                setConnectButtonText('Wallet Connected');
            })
        } else {
            setErrorMessage('Need to install MetaMask!');
        }
    }

    const accountChangedHandler = (newAccount) => {
        setDefaultAccount(newAccount);
        updateEthers();
    }

    const updateEthers = () => {
        let tempProvider = new ethers.providers.Web3Provider(window.ethereum);
        setProvider(tempProvider);

        let tempSigner = tempProvider.getSigner();
        setSigner(tempSigner);

        let tempContract = new ethers.Contract(contractAddress, Vault_abi, tempSigner);
        setContract(tempContract);
    }

    return (
        <div>
            <h3>{"Adv3nturer Vaults"}</h3>
            <button onClick={connectWalletHandler}>{connectButtonText}</button>
            <h3>Address: {defaultAccount}</h3>

            {errorMessage}

        </div>

    )
}

export default Vault;