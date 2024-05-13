import React from "react";
import classes from "./Block.module.scss";

interface BlockProps {
    title: string
    tag?: {
        label: string;
        icon?: React.ReactNode
    }
    children: React.ReactNode
}

export default function Block({ title, tag, children}: BlockProps) {
    return (
        <section className={classes.block}>
            <div className={classes.block__header}>
                <h2>{title}</h2>
                {
                    !!Object.keys(tag || {}).length && (
                        <div className={classes.block__header__tag}>
                            <p>{tag!.label}</p>
                            {tag?.icon}
                        </div>
                    )
                }
            </div>
            <div className={classes.block__content}>
                {children}
            </div>
        </section>
    )
}
