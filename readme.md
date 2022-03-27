# koishi-plugin-petpet

[![npm](https://img.shields.io/npm/v/koishi-plugin-petpet?style=flat-square)](https://www.npmjs.com/package/koishi-plugin-petpet)

制作头像相关的表情包插件 For [koishi](https://github.com/koishijs/koishi)

移植自[nonebot-plugin-petpet](https://github.com/MeetWq/nonebot-plugin-petpet)

此插件对配置有一定要求，配置在2c4g以下的服务器运行效果无法保证。
原插件中的一些指令尚未实现，欢迎pr。

## 配置项
| 名字       | 类型    | 默认值 | 描述                                                                     |
|------------|---------|--------|--------------------------------------------------------------------------|
| prefix     | string  | "#"      | 头像表情包的指令前缀。                                                   |
| saveOnDisk | boolean | true  | 是否将模板图片保存到本地。启用此选项会加快生成速度，但会占用额外的硬盘空间。 |
| normalFontPath | string | ""  | 字体绝对路径，留空则会自动下载并保存默认字体在本地。 |
| boldFontPath | string | ""  | 字体绝对路径，留空则会自动下载并保存默认字体在本地。 |
| repositoryEndpoint | string | "https://cdn.jsdelivr.net/gh/univeous/koishi-plugin-petpet@master/assets"  | 图片、字体等资源的仓库地址。 |

## 使用
发送"头像表情包"或"help petpet"查看指令列表。

### 触发方式
- 指令 + @用户
- 指令 + ./。/自己
- 指令 + 图片

### 支持的指令

| 指令 | 效果 | 备注 |
| --- | --- | --- |
| 摸<br>摸摸<br>摸头<br>摸摸头<br>rua | <img src="https://s2.loli.net/2022/02/23/oNGVO4iuCk73g8S.gif" width="200" /> | 可使用参数“圆”让头像为圆形<br>如：摸头 圆 自己 |
| 亲<br>亲亲 | <img src="https://s2.loli.net/2022/02/23/RuoiqP8plJBgw9K.gif" width="200" /> | 可指定一个或两个目标<br>若为一个则为 发送人 亲 目标<br>若为两个则为 目标1 亲 目标2<br>如：亲 @a 自己 |
| 贴<br>贴贴<br>蹭<br>蹭蹭 | <img src="https://s2.loli.net/2022/02/23/QDCE5YZIfroavub.gif" width="200" /> | 可指定一个或两个目标<br>类似 亲 |
| 顶<br>玩 | <img src="https://s2.loli.net/2022/02/23/YwxA7fFgWyshuZX.gif" width="200" /> |  |
| 拍 | <img src="https://s2.loli.net/2022/02/23/5mv6pFJMNtzHhcl.gif" width="200" /> |  |
| 撕 | <img src="https://s2.loli.net/2022/03/12/eJKIRrpG82LaMoW.jpg" width="200" > | 默认为 发送人 撕 目标<br>可使用参数“滑稽”替换发送人头像为滑稽<br>如：撕 滑稽 @a<br>可在图片上添加文本<br>如：撕 拜托你很弱哎 @a |
| 丢<br>扔 | <img src="https://s2.loli.net/2022/02/23/LlDrSGYdpcqEINu.jpg" width="200" /> |  |
| 抛<br>掷 | <img src="https://s2.loli.net/2022/03/10/W8X6cGZS5VMDOmh.gif" width="200" /> |  |
| 爬 | <img src="https://s2.loli.net/2022/02/23/hfmAToDuF2actC1.jpg" width="200" /> | 默认为随机选取一张爬表情<br>可使用数字指定特定表情<br>如：爬 13 自己 |
| 精神支柱 | <img src="https://s2.loli.net/2022/02/23/WwjNmiz4JXbuE1B.jpg" width="200" /> |  |
| 一直 | <img src="https://s2.loli.net/2022/02/23/dAf9Z3kMDwYcRWv.gif" width="200" /> | 支持gif |
| 加载中 | <img src="https://s2.loli.net/2022/02/23/751Oudrah6gBsWe.gif" width="200" /> | 支持gif |
| 转 | <img src="https://s2.loli.net/2022/02/23/HoZaCcDIRgs784Y.gif" width="200" /> |  |
| 小天使 | <img src="https://s2.loli.net/2022/02/23/ZgD1WSMRxLIymCq.jpg" width="200" /> | 图中名字为目标昵称<br>可指定名字，如：小天使 meetwq 自己 |
| 不要靠近 | <img src="https://s2.loli.net/2022/02/23/BTdkAzvhRDLOa3U.jpg" width="200" /> |  |
| 一样 | <img src="https://s2.loli.net/2022/02/23/SwAXoOgfdjP4ecE.jpg" width="200" /> |  |
| 滚 | <img src="https://s2.loli.net/2022/02/23/atzZsSE53UDIlOe.gif" width="200" /> |  |
| 玩游戏<br>来玩游戏 | <img src="https://s2.loli.net/2022/02/23/Xx34I7nT8HjtfKi.png" width="200" /> | 图中描述默认为：来玩休闲游戏啊<br>可指定描述<br>支持gif |
| 膜<br>膜拜 | <img src="https://s2.loli.net/2022/02/23/nPgBJwV5qDb1s9l.gif" width="200" /> |  |
| 吃 | <img src="https://s2.loli.net/2022/02/23/ba8cCtIWEvX9sS1.gif" width="200" /> |  |
| 啃 | <img src="https://s2.loli.net/2022/02/23/k82n76U4KoNwsr3.gif" width="200" /> |  |
| 出警 | <img src="https://s2.loli.net/2022/02/23/3OIxnSZymAfudw2.jpg" width="200" /> |  |
| 警察 | <img src="https://s2.loli.net/2022/03/12/xYLgKVJcd3HvqfM.jpg" width="200" > |  |
| 问问<br>去问问 | <img src="https://s2.loli.net/2022/02/23/GUyax1BF6q5Hvin.jpg" width="200" /> | 名字为昵称，可指定名字 |
| 舔<br>舔屏<br>prpr | <img src="https://s2.loli.net/2022/03/05/WMHpwygtmN5bdEV.jpg" width="200" /> | 支持gif |
| 搓 | <img src="https://s2.loli.net/2022/03/09/slRF4ue56xSQzra.gif" width="200" /> |  |
| 墙纸 | <img src="https://s2.loli.net/2022/03/10/tQRXzLamGyWi24s.jpg" width="200" /> | 支持gif |
| 国旗 | <img src="https://s2.loli.net/2022/03/10/p7nwCvgsU3LxBDI.jpg" width="200" /> |  |
| 交个朋友 | <img src="https://s2.loli.net/2022/03/10/SnmkNrjKuFeZvbA.jpg" width="200" /> | 名字为昵称，可指定名字 |
| 继续干活 | <img src="https://s2.loli.net/2022/03/12/DnZdAo9IL7q3lXW.jpg" width="200" > |  |
| 完美<br>完美的 | <img src="https://s2.loli.net/2022/03/10/lUS1nmPAKIYtwih.jpg" width="200" /> |  |
| 关注 | <img src="https://s2.loli.net/2022/03/12/FlpjRWCte72ozqs.jpg" width="200" > | 名字为昵称，可指定名字 |
| 这像画吗 | <img src="https://s2.loli.net/2022/03/12/PiSAM1T6EvxXWgD.jpg" width="200" > |  |
| 听音乐 | <img src="https://s2.loli.net/2022/03/15/rjgvbXeOJtIW8fF.gif" width="200" > |  |
| 永远爱你 | <img src="https://s2.loli.net/2022/03/15/o6mhWk7crwdepU5.gif" width="200" > |  |
| 采访 | <img src="https://s2.loli.net/2022/03/15/AYpkWEc2BrXhKeU.jpg" width="200" > | 可指定描述 |
| 打拳 | <img src="https://s2.loli.net/2022/03/18/heA9fCPMQWXBxTn.gif" width="200" > |  |
| 群青 | <img src="https://s2.loli.net/2022/03/18/drwXx3yK14IMVCf.jpg" width="200" > |  |