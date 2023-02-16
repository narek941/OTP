// @ts-nocheck
import React from 'react'
import { useDispatch } from 'react-redux'

import { _getStore } from 'src/storage/configureStore'
import { setModal } from '@entities/modal/actions'

export default function useMoveToActionPoint () {
	const dispatch = useDispatch()
	return React.useCallback(() => {
		const actionPoint = _getStore().getState().modal.options.actionPoint
		if (!actionPoint) {
			console.warn(`Missed "actionPoint" in useMoveToActionPoint hook`)
			return
		}
		dispatch(setModal({ viewType: actionPoint }))
	}, [dispatch])
}
