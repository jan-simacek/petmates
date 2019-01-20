import { selectUserState, RootState } from "./RootReducer";
import { selectCurrentUser } from ".";

export const getCurrentUser = (rootState: RootState) => selectCurrentUser(selectUserState(rootState))