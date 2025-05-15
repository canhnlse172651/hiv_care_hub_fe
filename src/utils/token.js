import { STORAGE } from "@/constant/storage"

export const localToken = {
    get: () => JSON.parse(localStorage.getItem(STORAGE.token)),
    set: (token) => { localStorage.setItem(STORAGE.token, JSON.stringify(token)) },
    remove: () => { localStorage.removeItem(STORAGE.token) }
}
