import { useContext, useEffect } from "react";
import { ForgeContext } from "./context";
export default function Model({ ObjectId }) {
    const { pushUrnModel } = useContext(ForgeContext);
    useEffect(() => {
        if (ObjectId) pushUrnModel(ObjectId);
    }, [ObjectId]);

    return null;
}
