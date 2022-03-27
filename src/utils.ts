import { GifCodec, GifFrame, GifUtil } from "gifwrap"
import { colord } from "colord"
import sharp from "sharp"
import { Canvas, CanvasRenderingContext2D, FontLibrary, Image, loadImage } from "skia-canvas/lib"
import { config, ctx } from "."
import { MakeFunction } from "./function"
import { PetPetCommand } from "./models"

export const canvas = new Canvas();
export const canvasCtx = canvas.getContext('2d');

export const base64ToBuffer = (base64: string) => Buffer.from(base64, 'base64')
export const bufferToBase64 = (buffer: Buffer) => buffer.toString('base64')

export const canvasToImage = (canvas: Canvas) => {
    const image = new Image()
    image.src = canvas.toDataURLSync('png')
    return image
}

export enum FitSizeMode {
    INSIDE,
    INCLUDE
}

export enum FitSizeDir {
    CENTER,
    NORTH,
    SOUTH,
    WEST,
    EAST,
    NORTH_WEST,
    NORTH_EAST,
    SOUTH_WEST,
    SOUTH_EAST
}

export function circle(img: Image): Image {
    const size = Math.min(img.width, img.height)

    const tmpCanvas = new Canvas(size, size);
    const tmpCtx = tmpCanvas.getContext('2d');

    tmpCtx.drawImage(img, 0, 0)

    tmpCtx.globalCompositeOperation = 'destination-in'
    tmpCtx.fillStyle = '#000'
    tmpCtx.beginPath()
    tmpCtx.arc(
        size * 0.5, // x
        size * 0.5, // y
        size * 0.5, // radius
        0, // start angle
        2 * Math.PI // end angle
    );
    tmpCtx.fill()

    // restore to default composite operation (is draw over current image)
    tmpCtx.globalCompositeOperation = 'source-over'

    return canvasToImage(tmpCanvas)
}

export async function makeGif(frames: Buffer[], width: number, height: number, delay: number | number[]): Promise<Buffer> {

    let GifFrames: GifFrame[]

    if (typeof delay == 'number') {
        GifFrames = await Promise.all(frames.map(async frame => {
            return new GifFrame(width, height, await sharp(frame).raw().toBuffer(), {
                delayCentisecs: delay
            })
        }))
    } else {
        GifFrames = await Promise.all(frames.map(async (frame, index) => {
            return new GifFrame(width, height, await sharp(frame).raw().toBuffer(), {
                delayCentisecs: delay[index]
            })
        }))
    }

    GifUtil.quantizeSorokin(GifFrames, 256)

    return (await new GifCodec().encodeGif(GifFrames, {})).buffer
}

export function clearCanvas(color?: string) {
    canvasCtx.clearRect(0, 0, canvas.width, canvas.height)
    if (color) {
        canvasCtx.save()
        canvasCtx.fillStyle = color
        canvasCtx.fillRect(0, 0, canvas.width, canvas.height)
        canvasCtx.restore()
    }
}

export function rotateAndDrawImage(context: CanvasRenderingContext2D, image: Image, {
    angleInRad = 0, x = 0, y = 0, w = 0, h = 0, expand = true
}: {
    angleInRad?: number,
    x?: number,
    y?: number,
    w?: number,
    h?: number,
    expand?: boolean
} = {}) {
    context.save()

    w = w || image.width
    h = h || image.height

    if (!expand) {
        context.translate(x + w / 2, y + h / 2)
        context.rotate(angleInRad)
        context.drawImage(image, - w / 2, -h / 2, w, h)

        context.restore()
        return
    }

    angleInRad += Math.PI * 2
    angleInRad %= Math.PI * 2

    if (angleInRad < Math.PI * 0.5) {
        context.translate(x + Math.sin(angleInRad) * h, y)
    } else if (angleInRad < Math.PI) {
        context.translate(x + Math.sin(Math.PI - angleInRad) * h + Math.cos(Math.PI - angleInRad) * w, y + Math.cos(Math.PI - angleInRad) * w)
    } else if (angleInRad < Math.PI * 1.5) {
        context.translate(x + Math.cos(angleInRad - Math.PI) * w, y + Math.cos(angleInRad - Math.PI) * h + Math.sin(angleInRad - Math.PI) * w)
    } else {
        context.translate(x, y + Math.sin(Math.PI * 2 - angleInRad) * w)
    }
    context.rotate(angleInRad)
    context.drawImage(image, 0, 0, w, h)

    context.restore()
}

export function zeroPad(num: number, places: number) {
    const zero = places - num.toString().length + 1
    return Array(+(zero > 0 && zero)).join("0") + num
}

export async function makePngOrGif(buffer: Buffer, func: MakeFunction, width:number, height:number, {
    gifZoom = 1,
    gifMaxFrames = 50
}: {
    gifZoom?: number,
    gifMaxFrames?: number
} = {}) {
    const img = sharp(buffer, {pages: -1})
    const metadata = await img.metadata()

    if (!metadata.pages) return func(buffer)

    const frames:Promise<Buffer>[] = []

    const allFramesBuffer = await img.png().toBuffer()

    const w = metadata.width
    const h = metadata.pageHeight

    for (let i = 0; i < metadata.pages; i++) {
        const frameBuffer = await sharp(allFramesBuffer).extract({
            left: 0,
            top: i * h,
            width: w,
            height: h
        }).png().toBuffer()

        frames.push(func(frameBuffer))
    }

    return await makeGif(await Promise.all(frames), width, height, metadata.delay.map(d => d / 10))
}

export function square(img: Image): Image {
    const length = Math.min(img.width, img.height)
    return cutSize(img, length, length)
}

export function limitSize(img: Image, w: number, h: number, mode: FitSizeMode = FitSizeMode.INCLUDE) {
    const imgW = img.width
    const imgH = img.height

    let ratio: number

    if (mode == FitSizeMode.INSIDE)
        ratio = Math.min(w / imgW, h / imgH)
    else ratio = Math.max(w / imgW, h / imgH)

    const width = imgW * ratio
    const height = imgH * ratio

    const tmpCanvas = new Canvas(width, height)
    const tmpCtx = tmpCanvas.getContext('2d')
    tmpCtx.drawImage(img, 0, 0, width, height)
    return canvasToImage(tmpCanvas)
}

export function cutSize(img: Image, w: number, h: number, {
    direction = FitSizeDir.CENTER, bg_color = '#fff'
}: {
    direction?: FitSizeDir,
    bg_color?: string
} = {}) {
    const imgW = img.width
    const imgH = img.height

    let x = Math.floor((w - imgW) / 2)
    let y = Math.floor((h - imgH) / 2)
    if ([FitSizeDir.NORTH, FitSizeDir.NORTH_WEST, FitSizeDir.NORTH_EAST].includes(direction))
        y = 0
    if ([FitSizeDir.SOUTH, FitSizeDir.SOUTH_WEST, FitSizeDir.SOUTH_EAST].includes(direction))
        y = h - imgH
    if ([FitSizeDir.WEST, FitSizeDir.NORTH_WEST, FitSizeDir.SOUTH_WEST].includes(direction))
        x = 0
    if ([FitSizeDir.EAST, FitSizeDir.NORTH_EAST, FitSizeDir.SOUTH_EAST].includes(direction))
        x = w - imgW

    const tmpCanvas = new Canvas(w, h)
    const tmpCtx = tmpCanvas.getContext('2d')
    tmpCtx.fillStyle = bg_color
    tmpCtx.fillRect(0, 0, w, h)
    tmpCtx.drawImage(img, x, y, imgW, imgH)

    return canvasToImage(tmpCanvas)
}

export function fitSize(img: Image, w: number, h: number, {
    direction = FitSizeDir.CENTER, bg_color = '#fff', mode = FitSizeMode.INCLUDE
}: {
    direction?: FitSizeDir,
    bg_color?: string,
    mode?: FitSizeMode
} = {}) {
    return cutSize(limitSize(img, w, h, mode), w, h, { direction, bg_color })
}

export function fitFontSize(ctx: CanvasRenderingContext2D, text: string, maxWidth: number, maxHeight: number, fontName: string, maxFontSize: number, minFontSize: number) {
    let fontSize = maxFontSize

    while (fontSize >= minFontSize) {
        ctx.font = `${fontSize}px ${fontName}`
        const metrics = ctx.measureText(text)
        if (metrics.width > maxWidth || metrics.actualBoundingBoxAscent + metrics.actualBoundingBoxDescent > maxHeight)
            fontSize--
        else return fontSize
    }
    return -1
}

export async function helpImage(commands: PetPetCommand[]) {

    const padding = 10

    async function textImg(text: string) {
        clearCanvas()

        const lines = text.split('\n')

        canvasCtx.font = '30px DEFAULT'
        const width = lines.reduce((acc, line) => Math.max(acc, canvasCtx.measureText(line).width), 0) + padding * 2
        const metrics = canvasCtx.measureText('M')
        const height = lines.length * (metrics.actualBoundingBoxAscent + metrics.actualBoundingBoxDescent) + padding * 2

        canvas.width = width
        canvas.height = height

        canvasCtx.fillStyle = 'black'
        canvasCtx.font = '30px DEFAULT'  // Change canvas size will reset ctx.font
        drawMultilineText(canvasCtx, text, padding / 2, metrics.actualBoundingBoxAscent)

        return loadImage(await canvas.toBuffer('png'))
    }

    function cmdText(cmds: PetPetCommand[], start = 1) {
        const text = cmds.map(cmd => `${start++}. ${cmd.keywords.join('/')}`).join('\n')
        return text
    }

    const text1 = `触发方式：${config.prefix}指令 + @user/['自己', '.', '。']/图片\n支持的指令：`

    const idx = Math.ceil(commands.length / 2)

    canvas.width = 0
    canvas.height = 0

    const img1 = await textImg(text1)
    const text2 = cmdText(commands.slice(0, idx))
    const img2 = await textImg(text2)
    const text3 = cmdText(commands.slice(idx), idx + 1)
    const img3 = await textImg(text3)

    const w = Math.max(img1.width, img2.width + img3.width)
    const h = img1.height + padding + Math.max(img2.height, img3.height)

    canvas.width = w + padding * 2
    canvas.height = h + padding

    clearCanvas()

    canvasCtx.fillStyle = '#fff'
    canvasCtx.fillRect(0, 0, canvas.width, canvas.height)
    canvasCtx.drawImage(img1, padding, padding)
    canvasCtx.drawImage(img2, padding, img1.height + padding)
    canvasCtx.drawImage(img3, img2.width + padding, img1.height + padding)

    return canvas.toBuffer('png')
}

export function drawMultilineText(ctx: CanvasRenderingContext2D, text: string, x: number, y: number, stroke = false) {
    const lines = text.split('\n')
    for (let i = 0; i < lines.length; i++) {
        const line = lines[i]
        const metrics = ctx.measureText(line)
        ctx.fillText(line, x, y + (metrics.actualBoundingBoxAscent + metrics.actualBoundingBoxDescent) * i)
        if (stroke) ctx.strokeText(line, x, y + (metrics.actualBoundingBoxAscent + metrics.actualBoundingBoxDescent) * i)
    }
}

export function colorMask(ctx: CanvasRenderingContext2D, color: number[]) {
    const imgData = ctx.getImageData(0, 0, ctx.canvas.width, ctx.canvas.height)
    const pixels = imgData.data
    const rgbSum = color[0] + color[1] + color[2]

    for (let i = 0; i < pixels.length; i += 4) {
        const r = pixels[i]
        const g = pixels[i + 1]
        const b = pixels[i + 2]

        const hsl = colord({ r, g, b }).toHsl()
        const gray = hsl.l

        const newR = gray * color[0] / rgbSum
        const newG = gray * color[1] / rgbSum
        const newB = gray * color[2] / rgbSum

        const newHsl = colord({
            r: newR, g: newG, b: newB
        }).toHsl()

        const newColor = colord({
            h: newHsl.h, s: newHsl.s, l: hsl.l
        }).toRgb()

        pixels[i] = newColor.r
        pixels[i + 1] = newColor.g
        pixels[i + 2] = newColor.b
    }

    ctx.putImageData(imgData, 0, 0)
}

export async function translate(text: string) {
    const url = "http://fanyi.youdao.com/translate"
    const params = { "type": "ZH_CN2JA", "i": text, "doctype": "json" }
    try {
        const resp = await ctx.http.get(url, { params })
        return resp["translateResult"][0][0]["tgt"]
    } catch (error) {
        return ""
    }
}