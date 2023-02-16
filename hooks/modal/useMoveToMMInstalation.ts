// @ts-nocheck
import React from 'react'
import { useDispatch } from 'react-redux'
import { isMobile } from 'react-device-detect'

import { OPEN_MM_BROWSER, INSTALL_WALLET } from '@constants/modals'

import { _getStore } from 'src/storage/configureStore'
import { setModal } from '@entities/modal/actions'

export default function useMoveToMMInstalation () {
	const dispatch = useDispatch()
	return React.useCallback(() => {
		if (isMobile) return dispatch(setModal({ viewType: OPEN_MM_BROWSER }))
		dispatch(setModal({ viewType: INSTALL_WALLET }))
	}, [dispatch, isMobile])
}
