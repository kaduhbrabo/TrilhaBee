import HTTPClient from './client';

export const authAPI = {
    loginAsync: async (email, senha) => {
        try {
            const resposta = await HTTPClient.post('/Auth/login', { email, senha });
            // Se der certo, a resposta vai conter o Token
            return resposta.data;
        } catch (erro) {
            console.error('Erro no login:', erro);
            throw erro;
        }
    }
};
