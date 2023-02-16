import { useState } from 'react';
import { ethers } from 'ethers';
import { jsonParse } from '@utils/common';
import { getCookie } from '@utils/cookies';
import { metaMaskLinks } from '../../configure';
import { metamaskSendRequest } from '@entities/user/redux/actions';
import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import {
  formatAddress,
  getAddressFromMetamask,
  MetamaskConnectStatus,
  MetamaskCryptoPayStatus,
  _changeNetwork,
} from '@utils/metamaskUtils';
import { _getStore } from 'src/storage/configureStore';
import { $apiWithToken } from '@services/index';
import { ReservationTypes } from 'src/common/models/reservation';
import { AxiosError, AxiosResponse } from 'axios';
import { ICryptoPurchase, IMetamaskData } from 'src/common/models/metamask';

export const useMetamask = () => {
  const dispatch = useDispatch();

  const [activeAccount, setActiveAccount] = useState<string | null>(null);

  const getMetamaskBalance = async (
    address: string = getMetamaskAddress()
  ): Promise<number> => {
    return await window.ethereum
      .request({
        method: 'eth_getBalance',
        params: [address, 'latest'],
      })
      .then((res) => ethers.utils.formatEther(res))
      .then((res) => res);
  };

  const getMetamaskAddress = () => {
    if (getCookie('user')) {
      //to prevent -> Unexpected token u in JSON at position 0
      const user = jsonParse(getCookie('user') as string);
      return user != null ? user.address : null;
    }
  };

  const getMetamaskAccounts = async () => {
    if (window.ethereum) {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      return provider
        .send('eth_requestAccounts', []) // get metamask address
        .then(async (accounts: string[]) => {
          setActiveAccount(accounts[0]);
          return accounts[0];
        })
        .catch((error) => {
          if (error.code === 4001) {
            toast.warn('Please connect to MetaMask.');
          } else {
            toast.error('Metamask: something went wrong.');
          }
        });
    } else {
      toast.error('Metamask is not installed');
      setTimeout(() => {
        window.open('https://metamask.io/download/', '_blank');
      }, 2000);
    }
  };

  const metamaskAccountChange = async (address: string) => {
    const metamaskRequest = await dispatch(metamaskSendRequest({ address }));
    setActiveAccount(address.toString());
    return metamaskRequest;
  };

  const metamaskInstalled = () => window.ethereum;

  const checkCryptoPaymentPossible = async (
    name,
    chainId
  ): Promise<MetamaskConnectStatus> => {
    if (!name || !chainId) {
      console.error(
        'Name and chainId is undefined. Please check backend data!'
      );
      return MetamaskConnectStatus.SOMETHING_WRONG;
    }
    const isInstalled = metamaskInstalled();
    if (!isInstalled) return MetamaskConnectStatus.NOT_INSTALLED;
    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum); // create provider for metamask
      const providerNetwork = await provider.getNetwork(); // metamask network
      const isMetamaskConnected = await provider.send(
        'eth_requestAccounts',
        []
      );
      if (!isMetamaskConnected) return MetamaskConnectStatus.NOT_CONNECTED;
      // if (providerNetwork.chainId !== chainId) {
      //   const isSuccess = await _changeNetwork({ provider, name, chainId });
      //   if (!isSuccess) return MetamaskConnectStatus.REJECTED_BY_USER;
      // }
      let currentAddress = _getStore().getState().user.metamaskAddress;
      const address = await getAddressFromMetamask();
      if (!currentAddress) {
        await dispatch(metamaskSendRequest({ address }));
      }
      currentAddress = _getStore().getState().user.metamaskAddress; // important to get updated address
      if (!currentAddress) return MetamaskConnectStatus.ADRESS_ABSENT;
      if (currentAddress !== address) {
        return MetamaskConnectStatus.ADDRESS_DONT_MATCH;
      }
      if (providerNetwork.chainId !== chainId) {
        return MetamaskConnectStatus.NEED_CHANGE_NETWORK;
      }
      return MetamaskConnectStatus.READY;
    } catch (error) {
      return MetamaskConnectStatus.SOMETHING_WRONG;
    }
  };

  const isCryptoPayStatus = (value: any): boolean =>
    Object.values(MetamaskCryptoPayStatus).includes(value);

  const getCryptoPurchaseData = async (
    prefix: string,
    id: number
  ): Promise<IMetamaskData | MetamaskCryptoPayStatus> => {
    return $apiWithToken
      .get(`collections/${prefix}-crypto-purchase/${id}`)
      .then((response) => response.data)
      .catch((error) => {
        const message = (error as AxiosError)?.response?.data?.message;
        if (message === MetamaskCryptoPayStatus.INSUFFICIENT_FUNDS)
          return message;
        return MetamaskCryptoPayStatus.PURCHASE_FAILED;
      });
  };

  const buyPackWithCrypto = async (id: number) => buyWithCrypto('pack', id);

  const buyNFTWithCrypto = async (id: number) => buyWithCrypto('nft', id);

  const buyWithCrypto = async (
    prefix: string,
    id: number
  ): Promise<MetamaskCryptoPayStatus> => {
    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const metamaskResponse = await getCryptoPurchaseData(prefix, id);
      if (isCryptoPayStatus(metamaskResponse))
        return metamaskResponse as MetamaskCryptoPayStatus;
      const response = metamaskResponse as IMetamaskData;
      const { data, gas, to, value } = response;
      const tokenId = prefix === 'nft' ? response.tokenId : response.packId;
      const accounts = await provider.send('eth_requestAccounts', []);
      const isDataValid = accounts && data && gas && to && value && tokenId;
      if (!isDataValid) return MetamaskCryptoPayStatus.PURCHASE_FAILED;
      const transactionParameters = {
        gas: ethers.utils.hexValue(ethers.BigNumber.from(gas)),
        to,
        from: getMetamaskAddress(),
        data,
        value: ethers.utils.hexValue(ethers.BigNumber.from(value)),
      };

      await provider.send('eth_estimateGas', [transactionParameters]);
      const transactionHash = await provider.send('eth_sendTransaction', [
        transactionParameters,
      ]);
      if (!transactionHash) return MetamaskCryptoPayStatus.PURCHASE_FAILED;
      const completedPayload = {
        transactionHash,
      };
      const completed = await $apiWithToken.post(
        `/collections/${prefix}-crypto-purchase-complete`,
        {
          tokenId: prefix === 'nft' && tokenId,
          packId: prefix === 'pack' && tokenId,
          transactionHash,
        }
      );
      if (!completed) return MetamaskCryptoPayStatus.PURCHASE_FAILED;
      return MetamaskCryptoPayStatus.SUCCESS;
    } catch (error) {
      return MetamaskCryptoPayStatus.SOMETHING_WRONG;
    }
  };

  return {
    getMetamaskBalance,
    getMetamaskAddress,
    metamaskInstalled,
    getMetamaskAccounts,
    metamaskAccountChange,
    checkCryptoPaymentPossible,
    buyNFTWithCrypto,
    buyPackWithCrypto,
  };
};
