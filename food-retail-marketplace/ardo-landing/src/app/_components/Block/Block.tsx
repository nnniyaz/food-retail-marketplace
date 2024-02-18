import classes from './Block.module.scss';

interface BlockProps {
    id?: string;
    children?: React.ReactNode;
    title?: string;
    height?: string;
    padding?: string;
}

export default function Block({ id, children, title, height, padding }: BlockProps) {
    return (
        <article className={classes.block} style={{height: height, padding: padding}} id={id}>
            {!!title && <h2 className={classes.block__title}>{title}</h2>}
            {children}
        </article>
    );
}
