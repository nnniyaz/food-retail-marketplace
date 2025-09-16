import {redirect} from "next/navigation";

export default function NotFound() {
    redirect("/suppliers/en");
    return <></>
}
