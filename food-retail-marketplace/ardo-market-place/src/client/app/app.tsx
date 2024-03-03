import {Routing} from "@pages/index.tsx";
import {useActions} from "@pkg/hooks/useActions.ts";
import "@app/app.scss";

interface EntryProps {

}

export const App = ({}: EntryProps) => {
    const {} = useActions();

    return (
        <Routing/>
    )
}
