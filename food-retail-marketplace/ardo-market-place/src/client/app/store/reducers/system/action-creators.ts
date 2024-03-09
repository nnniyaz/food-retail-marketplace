import {InitSystemStateAction, SystemActionEnum} from "@app/store/reducers/system/types.ts";
import {Cfg} from "@domain/base/cfg/cfg.ts";

export const systemActionCreator = {
    initSystemState: (cfg: Cfg): InitSystemStateAction => {
        return {
            type: SystemActionEnum.INIT_SYSTEM_STATE,
            payload: cfg
        }
    },
}
