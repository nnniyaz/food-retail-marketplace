import React from "react";

export const Catalog = () => {
    return (
        <React.Fragment>
            <Search/>
            <Sections catalog={catalog}/>
        </React.Fragment>
    );
}
