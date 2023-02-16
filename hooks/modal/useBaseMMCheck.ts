// @ts-nocheck
import React from 'react'
import { useDispatch } from 'react-redux'

import {
	CONNECT_WALLET, CHANGE_WALLET, CHANGE_NETWORK
} from '@constants/modals'

import { _getStore } from 'src/storage/configureStore'
import { setModal, setModalOptions } from '@entities/modal/actions'
import useMoveToMMInstalation from '@hooks/modal/useMoveToMMInstalation'

import checkMMInstalled from '@utils/metamask/checkMMInstalled'
import checkMMConnected from '@utils/metamask/checkMMConnected'
import getMMNetwork from '@utils/metamask/getMMNetwork'

export default function useBaseMMCheck (referrer) {
	const dispatch = useDispatch()
  const moveToMMInstalation = useMoveToMMInstalation()
	return React.useCallback(async () => {
		const isInstalled = checkMMInstalled() // check MM extension
		if (!isInstalled) {
			dispatch(setModalOptions({ referrer }))
			moveToMMInstalation()
			return false
		}
		const MMAddress = await checkMMConnected() // check adding domain to MM
		if (!MMAddress) {
			dispatch(setModalOptions({ referrer }))
			dispatch(setModal({ viewType: CONNECT_WALLET }))
			return false
		}
		const currentAddress = _getStore().getState().user.metamaskAddress // check address in DB
		if (!currentAddress) {
			dispatch(setModalOptions({ referrer }))
      dispatch(setModal({ viewType: CONNECT_WALLET }))
			return false
		}
		if (currentAddress !== MMAddress) {
			dispatch(setModalOptions({ referrer }))
			dispatch(setModal({ viewType: CHANGE_WALLET })) // check equality DB and MM
			return false
		}
		const chainId = _getStore().getState().modal.data.collection.network.chainId
		if (!chainId) {
			dispatch(setModalOptions({ referrer }))
			dispatch(setModal({ viewType: CHANGE_NETWORK })) // check existing chainId in collection
			return false
		}
		const providerNetwork = await getMMNetwork()
		if (chainId !== providerNetwork.chainId) {
			dispatch(setModalOptions({ referrer }))
			dispatch(setModal({ viewType: CHANGE_NETWORK })) // check equality networks for Item and MM
			return false
		}
		return true
	}, [referrer, dispatch, moveToMMInstalation])
}
