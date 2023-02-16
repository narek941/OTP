// @ts-nocheck
import React from 'react'

import { useTypedSelector } from '@hooks/useNewTypedSelector'

export function useSelectedCollection () {
	const collectionId = useTypedSelector(state => state.filter.collectionId)
	const collections = useTypedSelector(state => state.collections.list)
	return React.useMemo(() => {
		if (!collectionId) return null
		if (!collections) return null
		const collection = collections.find(collection => collection.id === collectionId)
		return collection
	}, [collectionId, collections])
}