import {Suspense, useEffect, useState} from "react";
import {Provider} from "react-redux";
import {App} from "@app/app.tsx";
import {store} from "@app/store";

interface EntryProps {

}

export const Main = (pageContext: EntryProps) => {
    // =================================================================================================================
    // REMOVES HYDRATION WARNING
    const [mounted, setMounted] = useState(false);
    useEffect(() => {
        setMounted(true);
    }, []);
    if (!mounted) return <></>;
    // =================================================================================================================
    return (
        <Suspense>
            <Provider store={store}>
                <App {...pageContext}/>
            </Provider>
        </Suspense>
    )
}
