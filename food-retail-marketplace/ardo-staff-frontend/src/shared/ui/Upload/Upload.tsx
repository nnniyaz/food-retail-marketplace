import React from "react";
import {LoadingOutlined, PlusOutlined} from "@ant-design/icons";
import {txt} from "@shared/core/i18ngen";
import {useTypedSelector} from "@shared/lib/hooks/useTypedSelector";
import classes from "./Upload.module.scss";

interface UploadProps {
    onUpload?: (file: File) => void;
    loading?: boolean;
    imgSrc?: string;
}

export const Upload = ({onUpload, loading, imgSrc}: UploadProps) => {
    const {currentLang} = useTypedSelector(state => state.lang);
    const ref = React.useRef<HTMLInputElement>(null);

    const handleClick = () => {
        ref.current?.click();
    }

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file && onUpload) {
            onUpload(file);
        }
        e.target.value = "";
    }

    return (
        <div className={classes.upload} onClick={handleClick}>
            {loading ? (
                <LoadingOutlined className={classes.upload__icon}/>
            ) : (
                !imgSrc && (
                    <>
                        <PlusOutlined className={classes.upload__icon}/>
                        <p>{txt.upload_image[currentLang]}</p>
                    </>
                )
            )}

            {
                !!imgSrc && (
                    <img
                        src={imgSrc}
                        alt={"Uploaded File"}
                        className={classes.upload__img}
                    />
                )
            }

            <input
                type={"file"}
                accept={"image/*"}
                style={{display: "none"}}
                multiple={false}
                ref={ref}
                onChange={handleFileChange}
            />
        </div>
    )
}
