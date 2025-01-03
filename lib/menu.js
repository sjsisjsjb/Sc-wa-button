/*
⚠️ PERINGATAN ⚠️  
Script bot WhatsApp Mora AI ini dibuat oleh Khalid untuk keperluan pribadi dan pembelajaran.  
Dilarang keras untuk memperjualbelikan, mendistribusikan ulang, atau mengklaim sebagai milik sendiri.  

Hak Cipta © 2024 Khalid & Mora AI  
*/

const chalk = require('chalk')
const fs = require('fs')
const petik = '```';

global.allMenu = (prefix, hituet) => {
return`
*GROUP MENU* ${petik}
 • ${prefix}out
 • ${prefix}pushcontact
 • ${prefix}savecontact
 • ${prefix}sendcontact
 • ${prefix}getcontact
 • ${prefix}contacttag
 • ${prefix}antibadword
 • ${prefix}nsfw
 • ${prefix}antiaudio
 • ${prefix}antiforeign
 • ${prefix}antisticker
 • ${prefix}antiimage
 • ${prefix}antivideo
 • ${prefix}antiviewonce
 • ${prefix}antispam
 • ${prefix}antimedia
 • ${prefix}antidocument
 • ${prefix}anticontact
 • ${prefix}antilocation
 • ${prefix}antilocation
 • ${prefix}antilink
 • ${prefix}antilinkgc
 • ${prefix}mute
 • ${prefix}welcome
 • ${prefix}left
 • ${prefix}adminevent
 • ${prefix}groupevent
 • ${prefix}kick
 • ${prefix}add
 • ${prefix}promote
 • ${prefix}demote
 • ${prefix}setnamegc
 • ${prefix}setppgc
 • ${prefix}deleteppgc
 • ${prefix}setdesk
 • ${prefix}hidetag
 • ${prefix}listonline
 • ${prefix}group
 • ${prefix}editinfo
 • ${prefix}linkgc
 • ${prefix}resetlink
 • ${prefix}afk
 • ${prefix}addlist
 • ${prefix}dellist
 • ${prefix}ceklist${petik}

*SEARCH MENU* ${petik}
 • ${prefix}anime
 • ${prefix}imdb
 • ${prefix}bukalapak
 • ${prefix}playstore
 • ${prefix}umma
 • ${prefix}happymod
 • ${prefix}ytsearch
 • ${prefix}tiktoksearch
 • ${prefix}pinterest
 • ${prefix}wallpaper
 • ${prefix}wikipedia
 • ${prefix}wikimedia
 • ${prefix}ringtone
 • ${prefix}traceanime
 • ${prefix}weather
 • ${prefix}presetam
 • ${prefix}soundcloud
 • ${prefix}lyrics${petik}

*DOWNLOAD MENU* ${petik}
 • ${prefix}play
 • ${prefix}ytaudio
 • ${prefix}ytvideo
 • ${prefix}tiktokmp4
 • ${prefix}tiktokmp3
 • ${prefix}tiktokslide
 • ${prefix}instagram
 • ${prefix}gitclone
 • ${prefix}gdrive
 • ${prefix}savepin
 • ${prefix}mediafire${petik}

*CONVERTER/TOOLS* ${petik}
 • ${prefix}brat
 • ${prefix}ssweb
 • ${prefix}qc
 • ${prefix}s
 • ${prefix}swm
 • ${prefix}tourl
 • ${prefix}toimage
 • ${prefix}remini
 • ${prefix}fetch
 • ${prefix}toaudio
 • ${prefix}bass
 • ${prefix}blown
 • ${prefix}deep
 • ${prefix}earrape
 • ${prefix}fast
 • ${prefix}fat
 • ${prefix}nightcore
 • ${prefix}reverse
 • ${prefix}robot
 • ${prefix}slow
 • ${prefix}smooth
 • ${prefix}squirrel${petik}

*STORE MENU* ${petik}
 • ${prefix}list
 • ${prefix}store
 • ${prefix}shop
 • ${prefix}addlist
 • ${prefix}dellist
 • ${prefix}ceklist${petik}

*OTHERS MENU* ${petik}
 • ${prefix}ping
 • ${prefix}speedtest
 • ${prefix}otakudesu
 • ${prefix}gempa
 • ${prefix}quotesanime
 • ${prefix}githubstalk
 • ${prefix}npmstalk
 • ${prefix}mlstalk
 • ${prefix}runtime
 • ${prefix}donate
 • ${prefix}script
 • ${prefix}repository
 • ${prefix}infobot
 • ${prefix}owner
 • ${prefix}getch
 • ${prefix}getgc${petik}
`}

global.ownerMenu = (prefix, hituet) => {
return`
*OWNER MENU* ${petik}
 • ${prefix}backup
 • ${prefix}addbadword
 • ${prefix}delbadword
 • ${prefix}listbadword
 • ${prefix}resetdbuser
 • ${prefix}resethit
 • ${prefix}setmenu
 • ${prefix}setreply
 • ${prefix}statustext
 • ${prefix}statusvideo
 • ${prefix}statusimage
 • ${prefix}statusaudio
 • ${prefix}upsaluran
 • ${prefix}setimgmenu
 • ${prefix}setvidmenu
 • ${prefix}addtitle
 • ${prefix}deltitle
 • ${prefix}addlimit
 • ${prefix}dellimit
 • ${prefix}addpremium
 • ${prefix}delpremium
 • ${prefix}listpremium
 • ${prefix}addowner
 • ${prefix}delowner
 • ${prefix}clearsession
 • ${prefix}join
 • ${prefix}getsession
 • ${prefix}myip
 • ${prefix}shutdown
 • ${prefix}autoread
 • ${prefix}unavailable
 • ${prefix}autorecordtype
 • ${prefix}autorecord
 • ${prefix}autotype
 • ${prefix}autobio
 • ${prefix}autosticker
 • ${prefix}safesearch
 • ${prefix}autodownload
 • ${prefix}autoblock
 • ${prefix}onlygc
 • ${prefix}onlypc
 • ${prefix}self
 • ${prefix}public
 • ${prefix}setexif
 • ${prefix}setprefix
 • ${prefix}setautoblock
 • ${prefix}setantiforeign
 • ${prefix}out
 • ${prefix}pushcontact
 • ${prefix}savecontact
 • ${prefix}sendcontact
 • ${prefix}getcontact
 • ${prefix}contacttag
 • ${prefix}ban
 • ${prefix}unban
 • ${prefix}getcase
 • ${prefix}setppbot
 • ${prefix}deleteppbot
 • ${prefix}setbiobot
 • ${prefix}listpc
 • ${prefix}listgc
 • ${prefix}creategc
 • ${prefix}autostatusview
 • ${prefix}anticall
 • ${prefix}addvideo
 • ${prefix}delvideo
 • ${prefix}listvideo
 • ${prefix}addimage
 • ${prefix}delimage
 • ${prefix}listimage
 • ${prefix}addsticker
 • ${prefix}delsticker
 • ${prefix}liststicker
 • ${prefix}addaudio
 • ${prefix}delaudio
 • ${prefix}listaudio
 • ${prefix}addlist
 • ${prefix}dellist
 • ${prefix}ceklist${petik}
`}

global.groupMenu = (prefix, hituet) => {
return`
*GROUP MENU* ${petik}
 • ${prefix}out
 • ${prefix}pushcontact
 • ${prefix}savecontact
 • ${prefix}sendcontact
 • ${prefix}getcontact
 • ${prefix}contacttag
 • ${prefix}antibadword
 • ${prefix}nsfw
 • ${prefix}antiaudio
 • ${prefix}antiforeign
 • ${prefix}antisticker
 • ${prefix}antiimage
 • ${prefix}antivideo
 • ${prefix}antiviewonce
 • ${prefix}antispam
 • ${prefix}antimedia
 • ${prefix}antidocument
 • ${prefix}anticontact
 • ${prefix}antilocation
 • ${prefix}antilocation
 • ${prefix}antilink
 • ${prefix}antilinkgc
 • ${prefix}mute
 • ${prefix}welcome
 • ${prefix}left
 • ${prefix}adminevent
 • ${prefix}groupevent
 • ${prefix}kick
 • ${prefix}add
 • ${prefix}promote
 • ${prefix}demote
 • ${prefix}setnamegc
 • ${prefix}setppgc
 • ${prefix}deleteppgc
 • ${prefix}setdesk
 • ${prefix}hidetag
 • ${prefix}listonline
 • ${prefix}group
 • ${prefix}editinfo
 • ${prefix}linkgc
 • ${prefix}resetlink
 • ${prefix}afk
 • ${prefix}addlist
 • ${prefix}dellist
 • ${prefix}ceklist${petik}
`}

global.searchMenu = (prefix, hituet) => {
return`
*SEARCH MENU* ${petik}
 • ${prefix}anime
 • ${prefix}imdb
 • ${prefix}bukalapak
 • ${prefix}playstore
 • ${prefix}umma
 • ${prefix}happymod
 • ${prefix}ytsearch
 • ${prefix}tiktoksearch
 • ${prefix}pinterest
 • ${prefix}wallpaper
 • ${prefix}wikipedia
 • ${prefix}wikimedia
 • ${prefix}ringtone
 • ${prefix}traceanime
 • ${prefix}weather
 • ${prefix}presetam
 • ${prefix}soundcloud
 • ${prefix}lyrics${petik}
`}

global.downloadMenu = (prefix, hituet) => {
return`
*DOWNLOAD MENU* ${petik}
 • ${prefix}play
 • ${prefix}ytaudio
 • ${prefix}ytvideo
 • ${prefix}tiktokmp4
 • ${prefix}tiktokmp3
 • ${prefix}tiktokslide
 • ${prefix}instagram
 • ${prefix}gitclone
 • ${prefix}gdrive
 • ${prefix}savepin
 • ${prefix}mediafire${petik}
`}

global.convertMenu = (prefix, hituet) => {
return`
*CONVERTER/TOOLS* ${petik}
 • ${prefix}brat
 • ${prefix}ssweb
 • ${prefix}qc
 • ${prefix}s
 • ${prefix}swm
 • ${prefix}tourl
 • ${prefix}toimage
 • ${prefix}remini
 • ${prefix}fetch
 • ${prefix}toaudio
 • ${prefix}bass
 • ${prefix}blown
 • ${prefix}deep
 • ${prefix}earrape
 • ${prefix}fast
 • ${prefix}fat
 • ${prefix}nightcore
 • ${prefix}reverse
 • ${prefix}robot
 • ${prefix}slow
 • ${prefix}smooth
 • ${prefix}squirrel${petik}
`}

global.storeMenu = (prefix, hituet) => {
return`
*STORE MENU* ${petik}
 • ${prefix}list
 • ${prefix}store
 • ${prefix}shop
 • ${prefix}addlist
 • ${prefix}dellist
 • ${prefix}ceklist${petik}
`}

global.otherMenu = (prefix, hituet) => {
return`
*OTHERS MENU* ${petik}
 • ${prefix}ping
 • ${prefix}speedtest
 • ${prefix}otakudesu
 • ${prefix}kusonimeinfo
 • ${prefix}kusonimesearch
 • ${prefix}quotesanime
 • ${prefix}gempa
 • ${prefix}githubstalk
 • ${prefix}npmstalk
 • ${prefix}mlstalk
 • ${prefix}runtime
 • ${prefix}donate
 • ${prefix}script
 • ${prefix}repository
 • ${prefix}infobot
 • ${prefix}owner
 • ${prefix}getch
 • ${prefix}getgc${petik}
`}

let file = require.resolve(__filename)
fs.watchFile(file, () => {
	fs.unwatchFile(file)
	console.log(chalk.redBright(`Update ${__filename}`))
	delete require.cache[file]
	require(file)
})