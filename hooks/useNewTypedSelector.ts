import { useSelector, TypedUseSelectorHook } from 'react-redux';
import { RootState } from '../storage/configureStore';

export const useTypedSelector: TypedUseSelectorHook<RootState> = useSelector;
