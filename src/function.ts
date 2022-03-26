import path from "path"
import { Canvas, Image, loadImage } from 'skia-canvas'
import { Random } from "koishi"
import { UserInfo } from "./models"
import { base64ToBuffer, canvas, canvasCtx, canvasToImage, circle, clearCanvas, colorMask, drawMultilineText, fitFontSize, fitSize, FitSizeDir, FitSizeMode, limitSize, makeGif, makePngOrGif, rotateAndDrawImage, square, zeroPad } from "./utils"
import { getImage } from "./resource"

interface PetPetFunctionParams {
    users?: UserInfo[],
    sender?: UserInfo,
    args?: string[]
}
export interface PetPetFunction {
    (params: PetPetFunctionParams): Promise<Buffer | string>
}

export interface MakeFunction {
    (imgBuffer: Buffer): Promise<Buffer>
}

export const petpet: PetPetFunction = async ({ users = [], args = [], }: PetPetFunctionParams) => {
    let img = await loadImage(users[0].avatar)
    const locs = [
        [14, 20, 98, 98],
        [12, 33, 101, 85],
        [8, 40, 110, 76],
        [10, 33, 102, 84],
        [12, 20, 98, 98],
    ]
    if (args.length != 0 && args[0].includes('圆')) {
        img = circle(img)
    }

    const frames: Promise<Buffer>[] = []

    canvas.width = 112
    canvas.height = 112

    for (let index = 0; index < 5; index++) {
        clearCanvas()

        const [x, y, w, h] = locs[index]

        canvasCtx.drawImage(img, x, y, w, h)

        const hand = await getImage(`petpet/${index}.png`)
        canvasCtx.drawImage(hand, 0, 0)

        frames.push(canvas.toBuffer('png'))
    }

    return makeGif(await Promise.all(frames), 112, 112, 6)
}

export const kiss: PetPetFunction = async ({ users = [], sender = null, }: PetPetFunctionParams) => {
    let selfImg: Image, userImg: Image
    if (users.length >= 2) {
        selfImg = await loadImage(users[0].avatar)
        userImg = await loadImage(users[1].avatar)
    } else {
        selfImg = await loadImage(sender.avatar)
        userImg = await loadImage(users[0].avatar)
    }

    const userLocs = [
        [58, 90], [62, 95], [42, 100], [50, 100], [56, 100], [18, 120], [28, 110],
        [54, 100], [46, 100], [60, 100], [35, 115], [20, 120], [40, 96]
    ]
    const selfLocs = [
        [92, 64], [135, 40], [84, 105], [80, 110], [155, 82], [60, 96], [50, 80],
        [98, 55], [35, 65], [38, 100], [70, 80], [84, 65], [75, 65]
    ]

    const frames: Promise<Buffer>[] = []

    canvas.width = 200
    canvas.height = 200

    for (let index = 0; index < 13; index++) {
        clearCanvas()

        const frame = await getImage(`kiss/${index}.png`)

        canvasCtx.drawImage(frame, 0, 0)

        canvasCtx.drawImage(circle(userImg), userLocs[index][0], userLocs[index][1], 50, 50)

        canvasCtx.drawImage(circle(selfImg), selfLocs[index][0], selfLocs[index][1], 40, 40)

        frames.push(canvas.toBuffer('png'))
    }

    return makeGif(await Promise.all(frames), 200, 200, 5)
}


export const rub: PetPetFunction = async ({ users = [], sender = null, }: PetPetFunctionParams) => {
    let selfImg: Image, userImg: Image
    if (users.length >= 2) {
        selfImg = await loadImage(users[0].avatar)
        userImg = await loadImage(users[1].avatar)
    } else {
        selfImg = await loadImage(sender.avatar)
        userImg = await loadImage(users[0].avatar)
    }

    const userLocs = [
        [39, 91, 75, 75], [49, 101, 75, 75], [67, 98, 75, 75],
        [55, 86, 75, 75], [61, 109, 75, 75], [65, 101, 75, 75]
    ]
    const selfLocs = [
        [102, 95, 70, 80, 0], [108, 60, 50, 100, 0], [97, 18, 65, 95, 0],
        [65, 5, 75, 75, -20], [95, 57, 100, 55, -70], [109, 107, 65, 75, 0]
    ]

    const frames: Promise<Buffer>[] = []

    canvas.width = 240
    canvas.height = 240

    for (let index = 0; index < 6; index++) {
        clearCanvas()

        const frame = await getImage(`rub/${index}.png`)
        canvasCtx.drawImage(frame, 0, 0)

        const [x, y, w, h] = userLocs[index]

        canvasCtx.drawImage(circle(userImg), x, y, w, h)

        const [x1, y1, w1, h1, angle] = selfLocs[index]

        rotateAndDrawImage(canvasCtx, circle(selfImg), {
            angleInRad: -angle * Math.PI / 180,
            x: x1, y: y1, w: w1, h: h1
        })

        frames.push(canvas.toBuffer('png'))
    }

    return makeGif(await Promise.all(frames), 240, 240, 5)
}

export const play: PetPetFunction = async ({ users = [], }: PetPetFunctionParams) => {
    const img = await loadImage(users[0].avatar)

    const locs = [
        [180, 60, 100, 100], [184, 75, 100, 100], [183, 98, 100, 100],
        [179, 118, 110, 100], [156, 194, 150, 48], [178, 136, 122, 69],
        [175, 66, 122, 85], [170, 42, 130, 96], [175, 34, 118, 95],
        [179, 35, 110, 93], [180, 54, 102, 93], [183, 58, 97, 92],
        [174, 35, 120, 94], [179, 35, 109, 93], [181, 54, 101, 92],
        [182, 59, 98, 92], [183, 71, 90, 96], [180, 131, 92, 101]
    ]

    const rawFrames: Buffer[] = []

    canvas.width = 480
    canvas.height = 400

    for (let i = 0; i < 23; i++) {
        clearCanvas()

        const frame = await getImage(`play/${i}.png`)
        canvasCtx.drawImage(frame, 0, 0)

        rawFrames.push(await canvas.toBuffer('png'))
    }

    const imgFrames: Buffer[] = []

    for (const i in locs) {
        clearCanvas('#fff')
        const [x, y, w, h] = locs[i]

        canvasCtx.drawImage(img, x, y, w, h)


        const rawFrame = await loadImage(rawFrames[i])
        canvasCtx.drawImage(rawFrame, 0, 0)

        imgFrames.push(await canvas.toBuffer('png'))
    }

    const frames = imgFrames.slice(0, 12)
        .concat(imgFrames.slice(0, 12))
        .concat(imgFrames.slice(0, 8))
        .concat(imgFrames.slice(12, 18))
        .concat(rawFrames.slice(18, 23))


    return makeGif(frames, 480, 400, 6)
}

export const pat: PetPetFunction = async ({ users = [] }: PetPetFunctionParams) => {
    const img = await loadImage(users[0].avatar)

    const locs = [
        [11, 73, 106, 100],
        [8, 79, 112, 96]
    ]

    const imgFrames: Promise<Buffer>[] = []

    canvas.width = 235
    canvas.height = 196

    for (let index = 0; index < 10; index++) {
        clearCanvas()

        const [x, y, w, h] = (index == 2 ? locs[1] : locs[0])

        const frame = await getImage(`pat/${index}.png`)
        canvasCtx.drawImage(img, x, y, w, h)
        canvasCtx.drawImage(frame, 0, 0)


        imgFrames.push(canvas.toBuffer('png'))
    }

    const frames: Promise<Buffer>[] = []
    const seq = [0, 1, 2, 3, 1, 2, 3, 0, 1, 2, 3, 0, 0, 1, 2, 3, 0, 0, 0, 0, 4, 5, 5, 5, 6, 7, 8, 9]

    for (const i of seq) {
        frames.push(imgFrames[i])
    }

    return makeGif(await Promise.all(frames), 235, 196, 8.5)
}

export const rip: PetPetFunction = async ({ users = [], args = [], sender = null }: PetPetFunctionParams) => {
    let selfImg: Image, userImg: Image
    if (users.length >= 2) {
        selfImg = await loadImage(users[0].avatar)
        userImg = await loadImage(users[1].avatar)
    } else {
        selfImg = await loadImage(sender.avatar)
        userImg = await loadImage(users[0].avatar)
    }

    const rip = await getImage(`rip/${args.includes('滑稽') ? '0' : '1'}.png`)

    canvas.width = rip.width
    canvas.height = rip.height

    const text = args.length > 0 ? args[0] : ''

    clearCanvas()

    rotateAndDrawImage(canvasCtx, userImg, {
        x: -5, y: 355, w: 385, h: 385, angleInRad: -24 * Math.PI / 180
    })

    rotateAndDrawImage(canvasCtx, userImg, {
        x: 649, y: 310, w: 385, h: 385, angleInRad: 11 * Math.PI / 180
    })

    canvasCtx.drawImage(selfImg, 408, 418, 230, 230)
    canvasCtx.drawImage(rip, 0, 0)

    if (text.length > 0) {
        canvasCtx.fillStyle = '#ff0000'

        const fontSize = fitFontSize(canvasCtx, text, rip.width - 50, 300, 'BOLD', 150, 25)
        if (fontSize == -1) return "文字太长了哦，改短点再试吧~"

        canvasCtx.font = `${fontSize}px BOLD`

        const textW = canvasCtx.measureText(text).width

        canvasCtx.fillText(text, (rip.width - textW) / 2, 40 + canvasCtx.measureText('m').actualBoundingBoxAscent)

    }

    return canvas.toBuffer('png')
}

export const throwUser: PetPetFunction = async ({ users = [] }: PetPetFunctionParams) => {
    const img = await loadImage(users[0].avatar)

    const frame = await getImage(`throw/0.png`)

    canvas.width = 512
    canvas.height = 512

    canvasCtx.drawImage(frame, 0, 0)

    const angle = Random.int(1, 360) * Math.PI / 180
    rotateAndDrawImage(canvasCtx, circle(img), {
        angleInRad: angle,
        x: 15,
        y: 178,
        w: 143,
        h: 143,
        expand: false
    })

    return canvas.toBuffer('png')
}

export const throwGif: PetPetFunction = async ({ users = [], }: PetPetFunctionParams) => {
    const img = await loadImage(users[0].avatar)

    const locs = [
        [[32, 32, 108, 36]],
        [[32, 32, 122, 36]],
        [],
        [[123, 123, 19, 129]],
        [[185, 185, -50, 200], [33, 33, 289, 70]],
        [[32, 32, 280, 73]],
        [[35, 35, 259, 31]],
        [[175, 175, -50, 220]],
    ]

    canvas.width = 350
    canvas.height = 350

    const frames: Promise<Buffer>[] = []

    for (let i = 0; i < 8; i++) {
        clearCanvas()

        const frame = await getImage(`throw_gif/${i}.png`)

        canvasCtx.drawImage(frame, 0, 0)

        for (const [w, h, x, y] of locs[i]) {
            canvasCtx.drawImage(circle(img), x, y, w, h)
        }
        frames.push(canvas.toBuffer('png'))
    }

    return makeGif(await Promise.all(frames), 350, 350, 1)
}

export const crawl: PetPetFunction = async ({ users = [], args = [], }: PetPetFunctionParams) => {
    const img = await loadImage(users[0].avatar)

    canvas.width = 500
    canvas.height = 500

    const crawlTotal = 92
    let crawlNum = Random.int(1, crawlTotal + 1)

    if (args && args.length > 0) {
        const num = parseInt(args[0])
        if (num && num <= crawlTotal && num >= 1) crawlNum = num
    }

    const frame = await getImage(`crawl/${zeroPad(crawlNum, 2)}.jpg`)

    canvasCtx.drawImage(frame, 0, 0)
    canvasCtx.drawImage(circle(img), 0, 400, 100, 100)

    return canvas.toBuffer('png')
}

export const support: PetPetFunction = async ({ users = [], }: PetPetFunctionParams) => {
    const img = await loadImage(users[0].avatar)


    const support = await getImage(`support/0.png`)
    canvas.width = support.width
    canvas.height = support.height

    clearCanvas()

    rotateAndDrawImage(canvasCtx, img, { x: -172, y: -17, w: 815, h: 815, angleInRad: -23 * Math.PI / 180 })
    canvasCtx.drawImage(support, 0, 0)

    return canvas.toBuffer('png')
}

export const always: PetPetFunction = async ({ users = [], }: PetPetFunctionParams) => {
    const img = await loadImage(users[0].avatar)

    const always = await getImage(`always/0.png`)
    const w = img.width
    const h = img.height
    const h1 = Math.floor(h / w * 300)
    const h2 = Math.floor(h / w * 60)
    const height = h1 + h2 + 10

    canvas.width = 300
    canvas.height = height

    const make: MakeFunction = async (imgBuffer: Buffer) => {
        clearCanvas('#fff')

        const img = await loadImage(imgBuffer)

        canvasCtx.drawImage(always, 0, h1 - 300 + Math.floor((h2 - 60) / 2))
        canvasCtx.drawImage(img, 0, 0, 300, h1)
        canvasCtx.drawImage(img, 165, h1 + 5, 60, h2)

        return canvas.toBuffer('png')
    }

    return makePngOrGif(base64ToBuffer(users[0].avatar), make, 300, height)
}

export const loading: PetPetFunction = async ({ users = [], }: PetPetFunctionParams) => {
    const img = await loadImage(users[0].avatar)

    const bg = await getImage(`loading/0.png`)
    const icon = await getImage(`loading/1.png`)
    const w = img.width
    const h = img.height
    const h1 = Math.floor(h / w * 300)
    const h2 = Math.floor(h / w * 60)
    const height = h1 + h2 + 10

    canvas.width = 300
    canvas.height = height

    async function makeStatic(imgBuffer: Buffer) {
        clearCanvas('#fff')

        const img = await loadImage(imgBuffer)

        canvasCtx.drawImage(bg, 0, h1 - 300 + Math.floor((h2 - 60) / 2))

        canvasCtx.filter = 'blur(2px)'
        canvasCtx.drawImage(img, 0, 0, 300, h1)
        canvasCtx.filter = 'none'

        canvasCtx.fillStyle = 'rgba(0, 0, 0, 0.5)'
        canvasCtx.fillRect(0, 0, 300, h1)

        canvasCtx.drawImage(icon, 100, Math.floor((h1 / 2) - 50))

        return canvas.toBuffer('png')
    }

    const frame = await makeStatic(base64ToBuffer(users[0].avatar))

    const make: MakeFunction = async (imgBuffer: Buffer) => {
        clearCanvas()

        const newFrame = await loadImage(frame)
        canvasCtx.drawImage(newFrame, 0, 0)
        canvasCtx.drawImage(await loadImage(imgBuffer), 60, h1 + 5, 60, h2)

        return canvas.toBuffer('png')
    }

    return makePngOrGif(base64ToBuffer(users[0].avatar), make, canvas.width, canvas.height)
}

export const turn: PetPetFunction = async ({ users = [], }: PetPetFunctionParams) => {
    const img = await loadImage(users[0].avatar)

    canvas.width = 250
    canvas.height = 250

    const frames: Promise<Buffer>[] = []

    for (let i = 0; i < 360; i += 10) {
        clearCanvas('#ffff')

        rotateAndDrawImage(canvasCtx, circle(img), {
            x: 0, y: 0, w: 250, h: 250, angleInRad: i * Math.PI / 180, expand: false
        })

        frames.push(canvas.toBuffer('png'))
    }

    if (Random.int(0, 1)) frames.reverse()

    return makeGif(await Promise.all(frames), 250, 250, 1)
}

export const littleAngel: PetPetFunction = async ({ users = [], args = [] }: PetPetFunctionParams) => {
    const img = limitSize(await loadImage(users[0].avatar), 500, 500, FitSizeMode.INSIDE)

    const imgW = img.width
    const imgH = img.height


    canvas.width = 600
    canvas.height = imgH + 230

    clearCanvas('#fff')

    canvasCtx.drawImage(img, Math.floor(300 - imgW / 2), 110)

    canvasCtx.font = '48px BOLD'
    canvasCtx.fillStyle = '#000'
    let text = "非常可爱！简直就是小天使"
    let metrics = canvasCtx.measureText(text)
    let textW = metrics.width
    canvasCtx.fillText(text, 300 - textW / 2, imgH + 120 + metrics.actualBoundingBoxAscent)


    canvasCtx.font = '26px BOLD'
    canvasCtx.fillStyle = '#000'
    const ta = users[0].gender == 'male' ? '他' : '她'
    text = `${ta}没失踪也没怎么样  我只是觉得你们都该看一下`
    metrics = canvasCtx.measureText(text)
    textW = metrics.width
    canvasCtx.fillText(text, 300 - textW / 2, imgH + 180 + metrics.actualBoundingBoxAscent)

    const name = args.length > 0 ? args[0] : users[0].nickname
    text = `请问你们看到${name}了吗？`
    const fontSize = fitFontSize(canvasCtx, text, 560, 110, 'BOLD', 70, 25)
    if (fontSize == -1) return "名字太长了哦，改短点再试吧~"

    canvasCtx.font = `${fontSize}px BOLD`
    metrics = canvasCtx.measureText(text)
    const x = 300 - metrics.width / 2
    const y = 55 - (metrics.actualBoundingBoxAscent + metrics.actualBoundingBoxDescent) / 2
    canvasCtx.fillText(text, x, y + metrics.actualBoundingBoxAscent)

    return canvas.toBuffer('png')
}

export const dontTouch: PetPetFunction = async ({ users = [], }: PetPetFunctionParams) => {
    const img = await loadImage(users[0].avatar)

    canvas.width = 600
    canvas.height = 600

    const frame = await getImage(`dont_touch/0.png`)
    clearCanvas()

    canvasCtx.drawImage(frame, 0, 0)

    canvasCtx.drawImage(img, 23, 231, 170, 170)

    return canvas.toBuffer('png')
}

export const alike: PetPetFunction = async ({ users = [], }: PetPetFunctionParams) => {
    const img = await loadImage(users[0].avatar)

    const frame = await getImage(`alike/0.png`)
    canvas.width = frame.width
    canvas.height = frame.height

    clearCanvas()
    canvasCtx.drawImage(frame, 0, 0)
    canvasCtx.drawImage(img, 131, 14, 90, 90)

    return canvas.toBuffer('png')
}

export const roll: PetPetFunction = async ({ users = [], }: PetPetFunctionParams) => {
    const img = await loadImage(users[0].avatar)

    const locs = [
        [87, 77, 0], [96, 85, -45], [92, 79, -90], [92, 78, -135],
        [92, 75, -180], [92, 75, -225], [93, 76, -270], [90, 80, -315]
    ]

    canvas.width = 300
    canvas.height = 300

    const frames: Promise<Buffer>[] = []

    for (let i = 0; i < 8; i++) {
        clearCanvas()

        const [x, y, angle] = locs[i]

        rotateAndDrawImage(canvasCtx, img, {
            x, y, w: 210, h: 210, angleInRad: - angle * Math.PI / 180, expand: false
        })

        const bg = await getImage(`roll/${i}.png`)
        canvasCtx.drawImage(bg, 0, 0)

        frames.push(canvas.toBuffer('png'))
    }

    return makeGif(await Promise.all(frames), 300, 300, 1)
}

export const playGame: PetPetFunction = async ({ users = [], args = [] }: PetPetFunctionParams) => {
    const bg = await getImage(`play_game/1.png`)
    const text = args.length ? args[0] : '来玩休闲游戏啊'

    const fontSize = fitFontSize(canvasCtx, text, 520, 110, 'DEFAULT', 35, 25)
    if (fontSize == -1) return "描述太长了哦，改短点再试吧~"

    canvasCtx.font = `${fontSize}px DEFAULT`

    canvas.width = 526
    canvas.height = 503

    const make: MakeFunction = async (imgBuffer: Buffer) => {
        clearCanvas()

        canvasCtx.save()
        canvasCtx.setTransform(canvasCtx.createProjection([164, 160, 384, 121, 396, 263, 188, 315]))

        const newImg = fitSize(await loadImage(imgBuffer), 220, 160)

        canvasCtx.drawImage(newImg, 0, 0, 220 * 2.4, 160 * 3.2)
        canvasCtx.restore()

        canvasCtx.drawImage(bg, 0, 0)

        return canvas.toBuffer('png')
    }

    return makePngOrGif(base64ToBuffer(users[0].avatar), make, 526, 503)
}

export const worship: PetPetFunction = async ({ users = [], }: PetPetFunctionParams) => {
    const img = await loadImage(users[0].avatar)

    canvas.width = 300
    canvas.height = 169

    const frames: Promise<Buffer>[] = []

    for (let i = 0; i < 10; i++) {
        clearCanvas()

        canvasCtx.save()
        canvasCtx.setTransform(canvasCtx.createProjection([0, -30, 135, 17, 135, 145, 0, 140]))
        canvasCtx.drawImage(img, 0, 0, 275, 165)
        canvasCtx.restore()
        canvasCtx.drawImage(await getImage(`worship/${i}.png`), 0, 0)

        frames.push(canvas.toBuffer('png'))
    }

    return makeGif(await Promise.all(frames), 300, 169, 0.04)
}

export const eat: PetPetFunction = async ({ users = [], }: PetPetFunctionParams) => {
    const img = await loadImage(users[0].avatar)

    canvas.width = 60
    canvas.height = 67

    const frames: Promise<Buffer>[] = []

    for (let i = 0; i < 3; i++) {
        clearCanvas()

        const bg = await getImage(`eat/${i}.png`)

        canvasCtx.drawImage(img, 1, 38, 32, 32)
        canvasCtx.drawImage(bg, 0, 0)

        frames.push(canvas.toBuffer('png'))
    }

    return makeGif(await Promise.all(frames), 60, 67, 0.05)
}

export const bite: PetPetFunction = async ({ users = [], }: PetPetFunctionParams) => {
    const img = await loadImage(users[0].avatar)

    canvas.width = 362
    canvas.height = 364

    const rawFrames = []

    const locs = [
        [90, 90, 105, 150], [90, 83, 96, 172], [90, 90, 106, 148],
        [88, 88, 97, 167], [90, 85, 89, 179], [90, 90, 106, 151]
    ]

    for (let i = 0; i < 16; i++) {
        clearCanvas()

        const frame = await getImage(`bite/${i}.png`)
        canvasCtx.drawImage(frame, 0, 0)
        rawFrames.push(canvas.toBuffer('png'))
    }

    let frames: Promise<Buffer>[] = []

    for (let i = 0; i < 6; i++) {
        clearCanvas()

        const [x, y, w, h] = locs[i]
        canvasCtx.drawImage(img, x, y, w, h)
        canvasCtx.drawImage(await getImage(`bite/${i}.png`), 0, 0)

        frames.push(canvas.toBuffer('png'))
    }

    frames = frames.concat(rawFrames.slice(6, rawFrames.length))

    return makeGif(await Promise.all(frames), 362, 364, 0.07)
}

export const police: PetPetFunction = async ({ users = [], }: PetPetFunctionParams) => {
    const img = await loadImage(users[0].avatar)

    const bg = await getImage(`police/0.png`)

    canvas.width = bg.width
    canvas.height = bg.height

    clearCanvas()
    canvasCtx.drawImage(img, 224, 46, 245, 245)
    canvasCtx.drawImage(bg, 0, 0)

    return canvas.toBuffer('png')
}


export const police1: PetPetFunction = async ({ users = [], }: PetPetFunctionParams) => {
    const img = await loadImage(users[0].avatar)

    const bg = await getImage(`police/1.png`)

    canvas.width = bg.width
    canvas.height = bg.height

    clearCanvas()
    rotateAndDrawImage(canvasCtx, img, {
        x: 37, y: 291, w: 60, h: 75, angleInRad: -16 * Math.PI / 180
    })
    canvasCtx.drawImage(bg, 0, 0)

    return canvas.toBuffer('png')
}

export const ask: PetPetFunction = async ({ users = [], args = [], }: PetPetFunctionParams) => {

    const name = args.length ? args[0] : users[0].nickname
    const ta = users[0].gender === 'female' ? '她' : '他'
    const img = await loadImage(users[0].avatar)

    const aspect = img.width / img.height
    const imgH = 640 / aspect

    const maskH = 150, startT = 180, sepW = 30, sepH = 80

    canvas.width = 640 + sepW * 2
    canvas.height = imgH + sepH * 2

    canvasCtx.fillStyle = '#fff'
    canvasCtx.fillRect(0, 0, canvas.width, canvas.height)

    canvasCtx.font = '35px DEFAULT'
    canvasCtx.fillStyle = '#000'

    let metrics = canvasCtx.measureText(name)

    canvasCtx.fillText(`让${name}告诉你吧`, sepW, 10 + metrics.actualBoundingBoxAscent)
    canvasCtx.fillText(`啊这，${ta}说不知道`, sepW, sepH + imgH + 10 + metrics.actualBoundingBoxAscent)
    canvasCtx.drawImage(img, sepW, sepH, 640, imgH)


    const gradient = canvasCtx.createLinearGradient(0, 0, 0, imgH)
    for (let y = 0; y <= imgH; y++) {
        const t = y < imgH - maskH ? 0 : imgH - y + startT - maskH
        gradient.addColorStop(y / imgH, `rgba(0,0,0,${t / 255})`)
    }

    canvasCtx.fillStyle = gradient
    canvasCtx.filter = 'blur(3px)'
    canvasCtx.fillRect(sepW, sepH, 640, imgH)
    canvasCtx.filter = 'none'


    const startH = imgH - maskH
    const startW = 30 + sepW
    canvasCtx.font = '25px BOLD'

    metrics = canvasCtx.measureText(name)

    let textW = canvasCtx.measureText(name).width
    const lineW = textW + 200
    canvasCtx.fillStyle = 'orange'
    canvasCtx.fillText(name, startW + (lineW - textW) / 2, startH + 5 + metrics.actualBoundingBoxAscent)

    canvasCtx.fillRect(startW, startH + 44, startW + lineW, 2)
    textW = canvasCtx.measureText(`${name}不知道哦。`).width
    canvasCtx.fillStyle = '#fff'
    canvasCtx.fillText(`${name}不知道哦。`, startW + (lineW - textW) / 2, startH + 50 + metrics.actualBoundingBoxAscent)

    return canvas.toBuffer('png')
}

export const prpr: PetPetFunction = async ({ users = [], }: PetPetFunctionParams) => {
    const bg = await getImage(`prpr/0.png`)

    canvas.width = bg.width
    canvas.height = bg.height

    const make: MakeFunction = async (imgBuffer: Buffer) => {
        clearCanvas()

        canvasCtx.save()
        canvasCtx.setTransform(canvasCtx.createProjection([56, 304, 276, 285, 325, 549, 121, 630]))

        const newImg = fitSize(await loadImage(imgBuffer), 330, 330)

        canvasCtx.drawImage(newImg, 0, 0, 660, 670)
        canvasCtx.restore()

        canvasCtx.drawImage(bg, 0, 0)

        return canvas.toBuffer('png')
    }

    return makePngOrGif(base64ToBuffer(users[0].avatar), make, bg.width, bg.height)
}

export const twist: PetPetFunction = async ({ users = [], }: PetPetFunctionParams) => {
    const img = await loadImage(users[0].avatar)

    const frames: Promise<Buffer>[] = []

    const locs = [
        [25, 66, 0], [25, 66, 60], [23, 68, 120],
        [20, 69, 180], [22, 68, 240], [25, 66, 300]
    ]

    canvas.width = 166
    canvas.height = 168

    for (let i = 0; i < 5; i++) {
        clearCanvas()

        const [x, y, a] = locs[i]

        rotateAndDrawImage(canvasCtx, img, {
            x, y, w: 78, h: 78, angleInRad: - a * Math.PI / 180, expand: false
        })

        canvasCtx.drawImage(await getImage(`twist/${i}.png`), 0, 0)

        frames.push(canvas.toBuffer('png'))
    }

    return makeGif(await Promise.all(frames), 166, 168, 1)
}

export const wallpaper: PetPetFunction = async ({ users = [], }: PetPetFunctionParams) => {
    const bg = await getImage(`wallpaper/0.png`)

    canvas.width = bg.width
    canvas.height = bg.height

    const make: MakeFunction = async (imgBuffer: Buffer) => {
        clearCanvas()

        const newImg = fitSize(await loadImage(imgBuffer), 775, 496)

        canvasCtx.drawImage(newImg, 260, 580)
        canvasCtx.drawImage(bg, 0, 0)

        return canvas.toBuffer('png')
    }

    return makePngOrGif(base64ToBuffer(users[0].avatar), make, 166, 168)
}

export const chinaFlag: PetPetFunction = async ({ users = [], }: PetPetFunctionParams) => {
    const img = await loadImage(users[0].avatar)
    const bg = await getImage(`china_flag/0.png`)

    canvas.width = bg.width
    canvas.height = bg.height

    clearCanvas()

    canvasCtx.drawImage(img, 0, 0, bg.width, bg.height)
    canvasCtx.drawImage(bg, 0, 0)

    return canvas.toBuffer('png')
}

export const makeFriend: PetPetFunction = async ({ users = [], args = [] }: PetPetFunctionParams) => {
    const img = limitSize(await loadImage(users[0].avatar), 1000, 0)
    const bg = await getImage(`make_friend/0.png`)

    const imgW = img.width
    const imgH = img.height

    canvas.width = bg.width
    canvas.height = bg.height

    clearCanvas()

    canvasCtx.drawImage(img, 0, 0)

    rotateAndDrawImage(canvasCtx, limitSize(img, 250, 0), {
        x: 743, y: imgH - 155, angleInRad: -9 * Math.PI / 180
    })
    rotateAndDrawImage(canvasCtx, square(img), {
        x: 836, y: imgH - 278, w: 55, h: 55, angleInRad: -9 * Math.PI / 180
    })
    canvasCtx.drawImage(bg, 0, 0)

    const name = args[0] || users[0].nickname
    if (!name) return "找不到名字，加上名字再试吧~"

    const textCanvas = new Canvas(500, 50)
    const textCtx = textCanvas.getContext('2d')
    textCtx.fillStyle = '#fff'
    textCtx.font = '40px DEFAULT'
    textCtx.fillText(name, 0, -10 + textCtx.measureText(name).actualBoundingBoxAscent)
    const textImage = canvasToImage(textCanvas)

    rotateAndDrawImage(canvasCtx, textImage, {
        x: 710, y: imgH - 340, w: 250, h: 25, angleInRad: -9 * Math.PI / 180
    })

    return canvas.toBuffer('png')
}

export const backToWork: PetPetFunction = async ({ users = [], }: PetPetFunctionParams) => {
    const img = await loadImage(users[0].avatar)
    const bg = await getImage(`back_to_work/1.png`)

    canvas.width = bg.width
    canvas.height = bg.height

    clearCanvas()

    const newImg = fitSize(img, 220, 310, { direction: FitSizeDir.NORTH })

    rotateAndDrawImage(canvasCtx, newImg, {
        x: 56, y: 32, angleInRad: -25 * Math.PI / 180
    })
    canvasCtx.drawImage(bg, 0, 0)

    return canvas.toBuffer('png')
}

export const paint: PetPetFunction = async ({ users = [], }: PetPetFunctionParams) => {
    const img = await loadImage(users[0].avatar)
    const bg = await getImage(`paint/0.png`)

    canvas.width = bg.width
    canvas.height = bg.height

    clearCanvas()

    const newImg = fitSize(img, 117, 135)

    rotateAndDrawImage(canvasCtx, newImg, {
        x: 95, y: 107, angleInRad: -4 * Math.PI / 180
    })

    canvasCtx.drawImage(bg, 0, 0)

    return canvas.toBuffer('png')
}

export const perfect: PetPetFunction = async ({ users = [], }: PetPetFunctionParams) => {
    const img = await loadImage(users[0].avatar)
    const bg = await getImage(`perfect/0.png`)

    canvas.width = bg.width
    canvas.height = bg.height

    clearCanvas()

    const newImg = fitSize(img, 310, 460, { mode: FitSizeMode.INSIDE })

    canvasCtx.drawImage(bg, 0, 0)
    canvasCtx.drawImage(newImg, 313, 64)

    return canvas.toBuffer('png')
}

export const follow: PetPetFunction = async ({ users = [], args = [] }: PetPetFunctionParams) => {
    const img = circle(await loadImage(users[0].avatar))

    canvasCtx.font = '60px DEFAULT'
    const ta = users[0].gender == 'female' ? '女同' : '男同'
    const name = args[0] || users[0].nickname || ta
    const metrics = canvasCtx.measureText(name)
    const textFollow = '关注了你'
    const textW = Math.max(metrics.width, canvasCtx.measureText(textFollow).width)
    if (textW >= 1000) return "名字太长了哦，改短点再试吧~"

    canvas.width = 300 + textW + 50
    canvas.height = 300
    clearCanvas('#fff')

    canvasCtx.drawImage(img, 50, 50, 200, 200)

    const textCanvas = new Canvas(300 + textW, 300)
    const textCtx = textCanvas.getContext('2d')
    textCtx.font = '60px DEFAULT'
    textCtx.fillStyle = 'black'
    textCtx.fillText(name, 0, 135 - textCtx.measureText(name).actualBoundingBoxDescent)
    textCtx.fillStyle = 'grey'
    textCtx.fillText(textFollow, 0, 145 + textCtx.measureText(textFollow).actualBoundingBoxAscent)

    canvasCtx.drawCanvas(textCanvas, 300, 0)

    return canvas.toBuffer('png')
}

export const coupon: PetPetFunction = async ({ users = [], args = [] }: PetPetFunctionParams) => {
    const img = circle(await loadImage(users[0].avatar))
    const bg = await getImage(`coupon/0.png`)

    canvas.width = bg.width
    canvas.height = bg.height
    clearCanvas()

    canvasCtx.drawImage(bg, 0, 0)
    rotateAndDrawImage(canvasCtx, img, {
        x: 164, y: 85, w: 60, h: 60, angleInRad: -22 * Math.PI / 180
    })

    canvasCtx.font = '30px DEFAULT'
    const ta = users[0].gender == 'female' ? '女同' : '男同'
    const name = args[0] || users[0].nickname || ta
    const metrics = canvasCtx.measureText(name)
    const textFollow = '关注了你'
    const textW = Math.max(metrics.width, canvasCtx.measureText(textFollow).width)
    if (textW >= 1000) return "名字太长了哦，改短点再试吧~"

    canvas.width = 300 + textW + 50
    canvas.height = 300

    return canvas.toBuffer('png')
}

export const listenMusic: PetPetFunction = async ({ users = [], }: PetPetFunctionParams) => {
    const img = await loadImage(users[0].avatar)
    const bg = await getImage(`listen_music/0.png`)

    canvas.width = bg.width
    canvas.height = bg.height

    const frames: Promise<Buffer>[] = []

    for (let i = 0; i < 360; i += 10) {
        clearCanvas()

        rotateAndDrawImage(canvasCtx, img, {
            x: 100, y: 100, w: 215, h: 215, angleInRad: - i * Math.PI / 180, expand: false
        })

        canvasCtx.drawImage(bg, 0, 0)

        frames.push(canvas.toBuffer('png'))
    }

    return makeGif(await Promise.all(frames), bg.width, bg.height, 5)
}

export const loveYou: PetPetFunction = async ({ users = [], }: PetPetFunctionParams) => {
    const img = await loadImage(users[0].avatar)

    const frames: Promise<Buffer>[] = []

    const locs = [
        [68, 65, 70, 70], [63, 59, 80, 80]
    ]

    canvas.width = 202
    canvas.height = 205

    for (let i = 0; i < 2; i++) {
        clearCanvas()

        const [x, y, w, h] = locs[i]

        canvasCtx.drawImage(img, x, y, w, h)
        canvasCtx.drawImage(await getImage(`love_you/${i}.png`), 0, 0)

        frames.push(canvas.toBuffer('png'))
    }

    return makeGif(await Promise.all(frames), 202, 205, 20)
}

export const interview: PetPetFunction = async ({ users = [], args = [], }: PetPetFunctionParams) => {
    let selfImg: Image, userImg: Image
    if (users.length >= 2) {
        selfImg = await loadImage(users[0].avatar)
        userImg = await loadImage(users[1].avatar)
    } else {
        selfImg = await getImage(`interview/huaji.png`)
        userImg = await loadImage(users[0].avatar)
    }

    const microphone = await getImage(`interview/microphone.png`)

    canvas.width = 600
    canvas.height = 310

    clearCanvas('#fff')

    canvasCtx.drawImage(microphone, 330, 103)
    canvasCtx.drawImage(selfImg, 419, 40, 124, 124)
    canvasCtx.drawImage(userImg, 57, 40, 124, 124)

    canvasCtx.textAlign = 'start'

    const text = args.length ? args[0] : '采访大佬经验'
    canvasCtx.fillStyle = '#000'

    const fontSize = fitFontSize(canvasCtx, text, 550, 100, 'DEFAULT', 50, 20)
    if (fontSize == -1) return "文字太长了哦，改短点再试吧~"

    canvasCtx.font = `${fontSize}px DEFAULT`

    const metrics = canvasCtx.measureText(text)

    const textW = metrics.width
    const textH = metrics.actualBoundingBoxAscent + metrics.actualBoundingBoxDescent

    canvasCtx.fillText(text, (canvas.width - textW) / 2, 200 + (100 - textH) / 2 + metrics.actualBoundingBoxAscent)

    return canvas.toBuffer('png')
}

export const punch: PetPetFunction = async ({ users = [], }: PetPetFunctionParams) => {
    let img = await loadImage(users[0].avatar)

    img = limitSize(img, 260, 230)

    const x = Math.floor((260 - img.width) / 2)
    const y = Math.floor((230 - img.height) / 2)

    canvas.width = 260
    canvas.height = 230

    const frames: Promise<Buffer>[] = []
    const locs = [
        [-50, 20], [-40, 10], [-30, 0], [-20, -10], [-10, -10], [0, 0],
        [10, 10], [20, 20], [10, 10], [0, 0], [-10, -10], [10, 0], [-30, 10]
    ]

    for (let i = 0; i < locs.length; i++) {
        const [dx, dy] = locs[i]

        clearCanvas()
        canvasCtx.drawImage(img, x + dx, y + dy)
        canvasCtx.drawImage(await getImage(`punch/${i}.png`), 0, 0)

        frames.push(canvas.toBuffer('png'))
    }

    return makeGif(await Promise.all(frames), 260, 230, 3)
}

export const cyan: PetPetFunction = async ({ users = [], }: PetPetFunctionParams) => {
    const img = await loadImage(users[0].avatar)

    canvas.width = 500
    canvas.height = 500

    const color = [78, 114, 184]

    clearCanvas()

    canvasCtx.drawImage(img, 0, 0, 500, 500)
    colorMask(canvasCtx, color)

    canvasCtx.fillStyle = '#fff'
    canvasCtx.strokeStyle = 'rgb(78, 114, 184)'
    canvasCtx.lineWidth = 2
    canvasCtx.font = '80px BOLD'
    let metrics = canvasCtx.measureText('M')
    drawMultilineText(canvasCtx, '群\n青', 400, 50 + metrics.actualBoundingBoxAscent, true)
    canvasCtx.font = '40px DEFAULT'
    metrics = canvasCtx.measureText('M')
    canvasCtx.strokeText('YOASOBI', 310, 270 + metrics.actualBoundingBoxAscent)
    canvasCtx.fillText('YOASOBI', 310, 270 + metrics.actualBoundingBoxAscent)

    return canvas.toBuffer('png')
}