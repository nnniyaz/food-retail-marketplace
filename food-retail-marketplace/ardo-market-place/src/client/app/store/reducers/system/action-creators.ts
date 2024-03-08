import {SystemActionEnum} from "@app/store/reducers/system/types.ts";

export const systemActionCreator = {
    initSystemState: (mode) => {
        return {
            type: SystemActionEnum.INIT_SYSTEM_STATE,
            payload: {mode}
        }
    },
}
