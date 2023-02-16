// @ts-nocheck
import React from 'react'
import { useDispatch } from 'react-redux'

import { _getStore } from 'src/storage/configureStore'
import { setModal } from '@entities/modal/actions'

export default function useMoveToInitialPoint () {
	const dispatch = useDispatch()
	return React.useCallback(() => {
		const initialPoint = _getStore().getState().modal.options.initialPoint
		if (!initialPoint) {
			console.warn(`Missed "initialPoint" in useMoveToInitialPoint hook`)
			return
		}
		dispatch(setModal({ viewType: initialPoint }))
	}, [dispatch])
}
