import Head from 'next/head';
import styles from '../styles/Home.module.css';
import Web3Modal from 'web3modal';
import {Contract, contract, ethers, providers} from 'ethers';
import { useEffect, useRef, useState } from 'react';
import { WHITELIST_CONTRACT_ADDRESS, abi } from '.../constants';

export default function Home() {
  const [ walletConnected, setWalletConnected] = useState(false);
  const [ joinedWhitelist, setJoinedWhitelist] = useState(false);
  const [ loading, setLoading] = useState(false);
  const [ numberOfWhitelisted, setNumberOfWhitelisted] = useState(0);
  const web3modal = useRef;

  const getProviderOrSigner = async (needSigner = false) => {
    // Connect to Metamask
    // Since we store `web3Modal` as a reference, we need to access the `current` value to get access to the underlying object
  const provider = await web3modalRef.current.connect();
  const Web3Provider = new providers.Web3Provider(provider)
    
    
// If user is not connected to the Goerli network, let them know and throw an error

    const {chainId} = await Web3Provider.getNetwork()
    if (chainId!==5) {
      window.alert('Change Network to Goerli')
      console.log('Changge Network to Goerli')
    }

    if (needSigner) {
      const signer = Web3Provider.getSigner()
      return signer
    }
    return Web3Provider;
  };



const addAddressToWhitelist = async () => {
  try {
    const signer = await getProviderOrSigner(true);
    const whitelistContract = new Contract(
      WHITELIST_CONTRACT_ADDRESS,
        abi,
        signer
    );

    const tx = whitelistContract.addAddressToWhitelist();
    setLoading(true);

    await tx.wait()
    setLoading(false);

    await getNumberOfWhitelisted();
    setJoinedWhitelist(true);
  } catch(err) {
    console.error(err)
  }
};


const getNumberOfWhitelisted = async () => {
  try {
    const provider = await getProviderOrSigner();
    const whitelistContract = new Contract(
      WHITELIST_CONTRACT_ADDRESS,
        abi,
        provider
    );

    const _numberOfWhitelisted = await whitelistContract.numAddressesWhitelisted();
    setNumberOfWhitelisted(_numberOfWhitelisted);
  } catch(err) {
    console.error(err)
  }
};

const checkIfAddressInWhitelisted = async () => {
  try {
    const signer = await getProviderOrSigner(true);
    const whitelistContract = new Contract(
      WHITELIST_CONTRACT_ADDRESS,
        abi,
        provider
    );

    const address = await signer.getAddress();
    const _joinedWhitlist = await whitelistContract.whitlistedAddresses(
      address
    );
    setJoinedWhitelist(_joinedWhitelist);
  } catch (err) {
    console.error(err)
  }
};


const connectWallet = async () => {
  try {
    await getProviderOrSigner();
    setWalletConnected(true);
    checkIfAddressInWhitelisted();
    getNumberOfWhitelisted()
  } catch (err) {
    console.log(err)
  }
};


const renderButton = () => {
    if (walletConnected) {
      if (joinedWhitelist) {
        return (
          <div className={styles.description}>
            Thanks for joining the Whitelist!
          </div>
        );
      } else if (loading) {
        return <button className={styles.button}>Loading...</button>;
      } else {
        return (
          <button onClick={addAddressToWhitelist} className={styles.button}>
            Join the Whitelist
          </button>
        );
      }
    } else {
      return (
        <button onClick={connectWallet} className={styles.button}>
          Connect your wallet
        </button>
      );
    }
  };


useEffect(() => {
  if(walletConnected) {
    Web3Modal.current = new Web3Modal({
      network: "goerli",
        providerOptions: {},
        disableInjectedProvider: false,
    });
    connectWallet()
  }
}, [walletConnected])

return (
  <div>
    <Head>
      <title>Info Space Dao Whitelist</title>
      <meta name="description" content="Whitelist-Dapp" />
      <link rel="icon" href="/favicon.ico" />
    </Head>
    <div className={styles.main}>
      <div>
        <h1 className={styles.title}>Welcome to Info Space Dao!</h1>
        <div className={styles.description}>
          Its an NFT collection for Info Space Dao.
        </div>
        <div className={styles.description}>
          {numberOfWhitelisted} have already joined the Whitelist
        </div>
        {renderButton()}
      </div>
      <div>
        <img className={styles.image} src="./crypto-devs.svg" />
      </div>
    </div>

    <footer className={styles.footer}>
      Made with &#10084; by Sadiqful<link></link>
    </footer>
  </div>
);

}
