// @ts-nocheck
import React from 'react'
import { useDispatch } from 'react-redux'

import { _getStore } from 'src/storage/configureStore'
import { setModalOptions } from '@entities/modal/actions'
import { cancelReservations } from '@requests/reservation'

export default function useClearReservation () {
  const dispatch = useDispatch()
  return React.useCallback(() => {
    const reservation = _getStore().getState().modal.options.reservation
		if (reservation) {
			dispatch(setModalOptions({ reservation: null }))
			cancelReservations()
		}
  }, [])
}
