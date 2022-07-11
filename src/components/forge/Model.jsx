import { useContext, useEffect } from "react";
import { ForgeContext } from "./context";
export default function Model({ urn }) {
    const { pushUrnModel } = useContext(ForgeContext);
    useEffect(() => {
        if (urn) pushUrnModel(urn);
    }, [urn]);

    return null;
}
