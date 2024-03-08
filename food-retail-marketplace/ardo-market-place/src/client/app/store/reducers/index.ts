import catalogState from "@app/store/reducers/catalog";
import {CatalogState} from "@app/store/reducers/catalog/types.ts";
import systemState from "@app/store/reducers/system";
import {SystemState} from "@app/store/reducers/system/types.ts";

export interface State {
    catalogState: CatalogState,
    systemState: SystemState
}

// eslint-disable-next-line import/no-anonymous-default-export
export default {
    catalogState,
    systemState
}
