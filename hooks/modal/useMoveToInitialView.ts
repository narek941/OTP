// @ts-nocheck
import React from 'react'
import { useDispatch } from 'react-redux'

import { NFT, PACKS } from '@constants/payments'
import { NFT_DETAILS, PACKS_DETAILS } from '@constants/modals'

import { _getStore } from 'src/storage/configureStore'
import { setModal, setModalOptions } from '@entities/modal/actions'
import { cancelReservations } from '@requests/reservation'

const config = {
	[NFT]: NFT_DETAILS,
	[PACKS]: PACKS_DETAILS
}

export default function useMoveToInitialView () {
	const dispatch = useDispatch()
	return React.useCallback(() => {
		const type = _getStore().getState().modal.options.type
		const viewType = config[type]
		if (!viewType) {
			console.warn(`Modal options type not set`)
			return
		}
		dispatch(setModal({ viewType }))
		const reservation = _getStore().getState().modal.options.reservation
		if (reservation) {
			dispatch(setModalOptions({ reservation: null }))
			cancelReservations()
		}
	}, [dispatch])
}