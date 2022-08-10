import { Context, Logger, Schema, segment, Session } from 'koishi'
import { commands, makeImage } from './data_source'
import { PetPetCommand, UserInfo } from './models'
import { clearRes, deleteFont, loadFonts } from './resource'
import { bufferToBase64, helpImage } from './utils'

export interface Config {
    prefix?: string
    saveOnDisk?: boolean
    normalFontPath?: string
    boldFontPath?: string
    repositoryEndpoint?: string
}

export const name = 'petpet'

export const Config: Schema<Config> = Schema.object({
    prefix: Schema.string().description('头像表情包的指令前缀。请不要使用"/"。').default('#'),
    saveOnDisk: Schema.boolean().description('是否将模板图片保存到本地。启用此项会加快生成速度，但会占用额外的硬盘空间。').default(true),
    normalFontPath: Schema.string().description('字体绝对路径，留空则会自动下载并保存默认字体在本地。更改后请重启koishi。').default(""),
    boldFontPath: Schema.string().description('字体绝对路径，留空则会自动下载并保存默认字体在本地。更改后请重启koishi。').default(""),
    repositoryEndpoint: Schema.string().description('图片、字体等资源的仓库地址。').default('https://cdn.jsdelivr.net/gh/univeous/koishi-plugin-petpet@master/assets')
})

const logger = new Logger(name)

export let ctx: Context
export let config: Config

export async function apply(_ctx: Context, cfg: Config) {
    ctx = _ctx
    config = cfg

    if (!config.saveOnDisk) {
        clearRes()
    }
    if(config.normalFontPath != '') {
        deleteFont('SourceHanSansSC-Regular.otf')
    }
    if(config.boldFontPath != '') {
        deleteFont('SourceHanSansSC-Bold.otf')
    }

    loadFonts()

    ctx.command(`petpet ${segment('image', { url: 'base64://' + bufferToBase64(await helpImage(commands)) })}`, '摸头等头像相关表情制作').alias('头像表情包')

    commands.forEach(command => {
        const cmdName = config.prefix + command.keywords[0]

        ctx.command('petpet').subcommand(cmdName, { hidden: true }).alias(...(command.keywords.map(c => config.prefix + c))).action(async ({ session }) => {
            const { success, state } = await getState(session, command)

            logger.info(state)

            if (!success) return
            const { sender, users, args } = state

            await Promise.all([getUserInfo(session, sender), ...users.map(user => getUserInfo(session, user))])

            const result = await makeImage(command, sender, users, args)

            if (typeof result == 'object') return segment('image', { url: 'base64://' + bufferToBase64(result) })
            return result
        })
    })
}

async function getUserInfo(session: Session, user: UserInfo) {
    if (!user.userId){
        if (user.avatar.startsWith('http')) {
            user.avatar = await ctx.http.get(user.avatar, { responseType: 'arraybuffer' })
        }
        return
    }

    const userInfo = await session.bot.getUser(user.userId)
    user.nickname = userInfo.nickname ? userInfo.nickname : userInfo.username
    user.avatar = userInfo.avatar
    if (user.avatar.startsWith('http')) {
        user.avatar = await ctx.http.get(user.avatar, { responseType: 'arraybuffer' })
    }
    user.gender = 'male'
}

async function getState(session: Session, command: PetPetCommand): Promise<{
    success: boolean
    state: {
        sender?: UserInfo
        users?: UserInfo[]
        args?: string[]
    }
}> {
    const users: UserInfo[] = []
    const args: string[] = []

    const segments = segment.parse(session.content)
    //logger.info(`${JSON.stringify(segments, null, '\t')}`)

    if (segments[0].type == 'quote') {
        const originalMsg = await session.bot.getMessage(segments[0].data.channelId, segments[0].data.id)

        //logger.info(`quote:`)
        //logger.info(`original message: ${JSON.stringify(originalMsg, null, '\t')}`)
        const msgContent = segment.parse(originalMsg.content)
        msgContent.forEach(async fragment => {
            if (fragment.type == 'image') {
                users.push(new UserInfo({ avatar: fragment.data.url }))
            }
        })
    }

    segments.forEach(fragment => {
        switch (fragment.type) {
            case 'at':
                users.push(new UserInfo({ userId: fragment.data.id }))
                break
            case 'image':
                users.push(new UserInfo({ avatar: fragment.data.url }))
                break
            case 'text':
                fragment.data.content.split(/\s+/).forEach(element => {
                    if (['.', '。', '自己'].includes(element.trim())) {
                        users.push(new UserInfo({
                            userId: session.author.userId,
                            nickname: session.author.nickname,
                            avatar: session.author.avatar
                        }))
                    }
                    else if (element.trim() != '') {
                        args.push(element.trim())
                    }
                })
                break
        }
    })

    if (args.length - 1 > command.arg_num) return { success: false, state: {} }

    if (users.length == 0) {
        const userBot = await session.bot.getSelf()
        users.push(new UserInfo({
            userId: userBot.userId,
            nickname: userBot.nickname ? userBot.nickname : userBot.username,
            avatar: userBot.avatar
        }))
    }

    if (users.length == 0) return { success: false, state: {} }


    return {
        success: true, state: {
            sender: new UserInfo({
                userId: session.author.userId,
                nickname: session.author.nickname,
                avatar: session.author.avatar
            }),
            users,
            args: args.slice(1, args.length)
        }
    }
}