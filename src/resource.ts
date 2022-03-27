import { default as Keyv } from 'keyv'
import { Time } from 'koishi'
import { FontLibrary, loadImage } from 'skia-canvas/lib'
import { config, ctx } from '.'
import fs from 'fs'
import path from 'path'

const keyv = new Keyv()

export async function getImage(name: string) {
    return loadImage(await getResource('images', name))
}

export async function getResource(type: string, name: string) {
    const key = `${type}/${name}`

    const resPath = path.join(__dirname, `../assets/${key}`)

    if (fs.existsSync(resPath)) {
        return fs.readFileSync(resPath)
    }
    
    const imgBuffer = await ctx.http.get(`${config.repositoryEndpoint}/${key}`, { responseType: 'arraybuffer' })

    if (config.saveOnDisk) {
        fs.mkdirSync(path.dirname(resPath), { recursive: true })
        fs.writeFileSync(resPath, imgBuffer)
        return imgBuffer
    }

    if (!await keyv.get(key)) {
        await keyv.set(key, imgBuffer, 10 * Time.minute)
    }

    return imgBuffer
}

export function deleteFont(name:string){
    const fontPath = path.join(__dirname, `../assets/fonts/${name}`)
    if(fs.existsSync(fontPath)) fs.rmSync(fontPath)
}

export async function loadFonts(){
    let normalFontPath = config.normalFontPath
    let boldFontPath = config.boldFontPath

    if(normalFontPath == ''){
        await getResource('fonts', 'SourceHanSansSC-Regular.otf')
        normalFontPath = path.join(__dirname, `../assets/fonts/SourceHanSansSC-Regular.otf`)
    }
    if(boldFontPath == ''){
        await getResource('fonts', 'SourceHanSansSC-Bold.otf')
        boldFontPath = path.join(__dirname, `../assets/fonts/SourceHanSansSC-Bold.otf`)
    }
    FontLibrary.use('DEFAULT', normalFontPath)
    FontLibrary.use('BOLD', boldFontPath)
}

export function clearRes() {
    fs.rmSync(path.join(__dirname, `../assets/images/`), {
        recursive: true,
        force: true
    })
}