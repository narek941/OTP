// @ts-nocheck
import React from 'react'
import { useDispatch } from 'react-redux'

import { CARD, CRYPTO } from '@constants/payments'
import { BUY_CARD, BUY_CRYPTO } from '@constants/modals'

import { _getStore } from 'src/storage/configureStore'
import { setModal } from '@entities/modal/actions'

const config = {
	[CARD]: BUY_CARD,
	[CRYPTO]: BUY_CRYPTO
}

export default function useMoveToBuyView () {
	const dispatch = useDispatch()
	return React.useCallback(() => {
		const method = _getStore().getState().modal.options.method
		const viewType = config[method]
		if (!viewType) {
			console.warn(`Modal options method not set`)
			return
		} 
		dispatch(setModal({ viewType }))
	}, [dispatch])
}