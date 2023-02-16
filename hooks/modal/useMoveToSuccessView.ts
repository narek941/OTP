// @ts-nocheck
import React from 'react'
import { useDispatch } from 'react-redux'

import { NFT, PACKS } from '@constants/payments'
import { NFT_PAYMENT_SUCCESS, PACKS_PAYMENT_SUCCESS } from '@constants/modals'

import { _getStore } from 'src/storage/configureStore'
import { setModal } from '@entities/modal/actions'

const config = {
	[NFT]: NFT_PAYMENT_SUCCESS,
	[PACKS]: PACKS_PAYMENT_SUCCESS
}

export default function useMoveToSuccessView () {
	const dispatch = useDispatch()
	return React.useCallback(() => {
		const type = _getStore().getState().modal.options.type
		const viewType = config[type]
		if (!viewType) {
			console.warn(`Modal options type not set`)
			return
		} 
		dispatch(setModal({ viewType }))
	}, [dispatch])
}