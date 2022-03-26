import { alike, always, ask, backToWork, bite, chinaFlag, crawl, cyan, dontTouch, eat, follow, interview, kiss, listenMusic, littleAngel, loading, loveYou, makeFriend, paint, pat, perfect, petpet, play, playGame, police, police1, prpr, punch, rip, roll, rub, support, throwGif, throwUser, turn, twist, wallpaper, worship } from "./function"
import { PetPetCommand, UserInfo } from "./models"


export const commands = [
    new PetPetCommand(["摸", "摸摸", "摸头", "摸摸头", "rua"], { func: petpet, arg_num: 1 }),
    new PetPetCommand(["亲", "亲亲"], { func: kiss }),
    new PetPetCommand(["贴", "贴贴", "蹭", "蹭蹭"], { func: rub }),
    new PetPetCommand(["顶", "玩"], { func: play }),
    new PetPetCommand(["拍"], { func: pat }),
    new PetPetCommand(["撕"], { func: rip, arg_num: 2 }),
    new PetPetCommand(["丢", "扔"], { func: throwUser }),
    new PetPetCommand(["抛", "掷"], { func: throwGif }),
    new PetPetCommand(["爬"], { func: crawl, arg_num: 1 }),
    new PetPetCommand(["精神支柱"], { func: support }),
    new PetPetCommand(["一直", "要我一直"], { func: always }),
    new PetPetCommand(["加载中"], { func: loading }),
    new PetPetCommand(["转"], { func: turn }),
    new PetPetCommand(["小天使"], { func: littleAngel, arg_num: 1 }),
    new PetPetCommand(["不要靠近"], { func: dontTouch }),
    new PetPetCommand(["一样"], { func: alike }),
    new PetPetCommand(["滚"], { func: roll }),
    new PetPetCommand(["来玩游戏", "玩游戏"], { func: playGame }),
    new PetPetCommand(["膜", "膜拜"], { func: worship }),
    new PetPetCommand(["吃"], { func: eat }),
    new PetPetCommand(["啃"], { func: bite }),
    new PetPetCommand(["出警"], { func: police }),
    new PetPetCommand(["警察"], { func: police1 }),
    new PetPetCommand(["舔", "舔屏", "prpr"], { func: prpr }),
    new PetPetCommand(["问问", "去问问"], { func: ask, arg_num: 1 }),
    new PetPetCommand(["搓"], { func: twist }),
    new PetPetCommand(["墙纸"], { func: wallpaper }),
    new PetPetCommand(["国旗"], { func: chinaFlag }),
    new PetPetCommand(["交个朋友"], { func: makeFriend, arg_num: 1 }),
    new PetPetCommand(["继续干活"], { func: backToWork }),
    new PetPetCommand(["完美", "完美的"], { func: perfect }),
    new PetPetCommand(["关注"], { func: follow }),
    //TODO myFriend
    new PetPetCommand(["这像画吗"], { func: paint }),
    //TODO shock, coupon
    new PetPetCommand(["听音乐"], { func: listenMusic }),
    //TODO danZhongDian, funnyMirror
    new PetPetCommand(["永远爱你"], { func: loveYou }),
    //TODO symmetric, safeSense, alwaysLike
    new PetPetCommand(["采访"], { func: interview, arg_num: 1 }),
    new PetPetCommand(["打拳"], { func: punch }),
    new PetPetCommand(["群青"], { func: cyan }),
]

export function makeImage(command: PetPetCommand, sender: UserInfo, users: UserInfo[], args: string[] = []) {
    return command.func({ users, sender, args })
}