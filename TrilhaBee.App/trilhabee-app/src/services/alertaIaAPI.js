import HTTPClient from './client';

const baseUrl = '/AlertaIA';

export const alertaIaAPI = {
    listarAsync: async () => {
        try {
            const resposta = await HTTPClient.get(baseUrl);
            return resposta.data;
        } catch (erro) {
            console.error('Erro ao listar alertas:', erro);
            throw erro;
        }
    },

    obterAsync: async (id) => {
        try {
            const resposta = await HTTPClient.get(`${baseUrl}/${id}`);
            return resposta.data;
        } catch (erro) {
            console.error(`Erro ao obter alerta ${id}:`, erro);
            throw erro;
        }
    },

    resolverAsync: async (id) => {
        try {
            const alertaAtual = await HTTPClient.get(`${baseUrl}/${id}`);
            const payload = { ...alertaAtual.data, resolvido: true };
            
            const resposta = await HTTPClient.put(`${baseUrl}/${id}`, payload);
            return resposta.data;
        } catch (erro) {
            console.error(`Erro ao resolver alerta ${id}:`, erro);
            throw erro;
        }
    },

    gerarAnaliseAsync: async () => {
        try {
            const resposta = await HTTPClient.post(`${baseUrl}/gerar`);
            return resposta.data;
        } catch (erro) {
            console.error('Erro ao gerar análise IA:', erro);
            throw erro;
        }
    }
};
