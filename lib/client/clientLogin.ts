import { LoginModel } from "@/models/loginModel";
import axios from "axios";

export const loginWithMagicToken = async (token: string): Promise<LoginModel> =>
{
    const response = (await axios.post<LoginModel>('/api/login', {}, {
        headers: {
            "Authorization": `Bearer ${token}`
        }
    })).data;
    return response;
};