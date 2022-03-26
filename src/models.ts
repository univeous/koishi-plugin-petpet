import { PetPetFunction } from "./function";

export class UserInfo {
    userId: string
    gender: string
    nickname: string
    avatar: string

    constructor({
        userId = '',
        gender = 'male',
        nickname = '',
        avatar = ''
    }: {
        userId?: string,
        gender?: string,
        nickname?: string,
        avatar?: string,
    } = {}
    ) {
        this.avatar = avatar
        this.gender = gender
        this.nickname = nickname
        this.userId = userId
    }

}

export class PetPetCommand {
    keywords: string[]
    func: PetPetFunction
    arg_num: number

    constructor(keywords: string[], {
        func = null,
        arg_num = 0
    }: {
        func?: PetPetFunction,
        arg_num?: number
    } = {}) {
        this.keywords = keywords
        this.func = func
        this.arg_num = arg_num
    }
}

