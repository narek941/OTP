// @ts-nocheck
import React from 'react'
import { useDispatch } from 'react-redux'

import { _getStore } from 'src/storage/configureStore'
import { setModal } from '@entities/modal/actions'

export default function useMoveToReferrer () {
	const dispatch = useDispatch()
	return React.useCallback(() => {
		const referrer = _getStore().getState().modal.options.referrer
		if (!referrer) {
			console.warn(`Missed "referrer" in useMoveToReferrer hook`)
			return
		}
		dispatch(setModal({ viewType: referrer }))
	}, [dispatch])
}
