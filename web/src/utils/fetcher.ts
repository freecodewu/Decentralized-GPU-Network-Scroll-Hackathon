const baseUrl = `https://scrollapi.apus.network`
import qs from 'qs'

export const getFetcher = (args: [url: string, queryParams: Record<string, any>] | string) => {
    let path = ""
    if (typeof args === 'string') {
        path = args
    } else {
        const [url, queryParams] = args
        path = url + '?' + qs.stringify(queryParams)
    }
    return fetch(baseUrl + path, {
        method: "GET",
        headers: {
            "Content-Type": "application/json"
        },
    }).then(res => res.json())
}

export type CommonResponse<T> = {
    code: number
    data: T
}

export type CommonResponse2<T> = {
    code: number
    items: T
}