import axios from "axios";

export const API_ERROR_EVENT = "api-error";

export interface ApiErrorDetail {
    message: string;
}

function getApiErrorMessage(error: unknown) {
    if (!axios.isAxiosError(error) || !error.response) {
        return "Não foi possível conectar à API. Tente novamente em instantes.";
    }

    if (error.response.status === 404) {
        return "O recurso solicitado não foi encontrado.";
    }

    if (error.response.status >= 500) {
        return "O serviço está temporariamente indisponível. Tente novamente em instantes.";
    }

    return "Não foi possível concluir a operação.";
}

export const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    headers: {
        'Content-Type': 'application/json',
    }
});

api.interceptors.response.use(
    (response) => response,
    (error: unknown) => {
        window.dispatchEvent(new CustomEvent<ApiErrorDetail>(API_ERROR_EVENT, {
            detail: {message: getApiErrorMessage(error)},
        }));

        return Promise.reject(error);
    },
);
