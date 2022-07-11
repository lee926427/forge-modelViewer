import ForgeSDK from "forge-apis";

export const auth = {
    authClientTwoLegged:async (clientId,clientSecret, scope)=>{
        return await new ForgeSDK.AuthClientTwoLegged(clientId, clientSecret, scope)
            .authenticate()
    }
};