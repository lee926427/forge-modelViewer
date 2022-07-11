import ForgeSDK from "forge-apis";

export const auth = {
    authClientTwoLegged:async (clientSecret, scope)=>{
        return await new ForgeSDK.AuthClientTwoLegged(
            import.meta.env.VITE_FORGE_CLIENT_ID, 
            clientSecret, scope
        ).authenticate()
    }
};