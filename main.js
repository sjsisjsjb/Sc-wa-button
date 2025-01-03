/*
⚠️ PERINGATAN ⚠️  
Script bot WhatsApp Mora AI ini dibuat oleh Khalid untuk keperluan pribadi dan pembelajaran.  
Dilarang keras untuk memperjualbelikan, mendistribusikan ulang, atau mengklaim sebagai milik sendiri.  

Hak Cipta © 2024 Khalid & Mora AI  
*/

require('./settings');
const { default: makeWASocket, makeCacheableSignalKeyStore, UseMyState, DisconnectReason, fetchLatestBaileysVersion, generateForwardMessageContent, prepareWAMessageMedia, generateWAMessageFromContent, generateMessageID, downloadContentFromMessage, makeInMemoryStore, jidDecode, getAggregateVotesInPollMessage, proto, delay } = require("@whiskeysockets/baileys");
const { uncache, nocache } = require('./lib/loader');
const { color } = require('./lib/color');
const readline = require("readline");
const NodeCache = require("node-cache");
const msgRetryCounterCache = new NodeCache();
const pino = require('pino');
const { Boom } = require('@hapi/boom');
const { Low, JSONFile } = require('./lib/lowdb');
const yargs = require('yargs/yargs');
const fs = require('fs');
const chalk = require('chalk');
const FileType = require('file-type');
const path = require('path');
const axios = require('axios');
const _ = require('lodash');
const moment = require('moment-timezone');
const PhoneNumber = require('awesome-phonenumber');
const { imageToWebp, videoToWebp, writeExifImg, writeExifVid } = require('./lib/exif');
const { smsg, isUrl, generateMessageTag, getBuffer, getSizeMedia, await, sleep, reSize } = require('./lib/myfunc');

const store = makeInMemoryStore({
	logger: pino().child({
		level: 'silent',
		stream: 'store'
	})
});
global.opts = new Object(yargs(process.argv.slice(2)).exitProcess(false).parse());

global.db = new Low(new JSONFile('src/database.json'));

global.DATABASE = global.db;

global.loadDatabase = async function loadDatabase() {
	if (global.db.READ) {
		return new Promise((resolve) => {
			const interval = setInterval(() => {
				if (!global.db.READ) {
					clearInterval(interval);
					resolve(global.db.data == null ? global.loadDatabase() : global.db.data);
				}
			}, 1000);
		});
	}

	if (global.db.data !== null) return;

	global.db.READ = true;

	try {
		await global.db.read();
		global.db.data = {
			users: {},
			database: {},
			chats: {},
			game: {},
			settings: {},
			message: {},
			...(global.db.data || {})
		};
		global.db.chain = _.chain(global.db.data);
	} catch (err) {
		console.error('⚠️ Gagal membaca database:', err);
	} finally {
		global.db.READ = false;
	}
};

loadDatabase();

if (global.db) {
	setInterval(async () => {
		if (global.db.data && !global.db.READ) {
			try {
				await global.db.write();
			} catch (err) {
				console.error('⚠️ Gagal menyimpan database:', err);
			}
		}
	}, 30 * 1000);
}

require('./case.js');
nocache('../case.js', module => console.log(color('[ CHANGE ]', 'green'), color(`'${module}'`, 'green'), 'Updated'));
require('./main.js');
nocache('../main.js', module => console.log(color('[ CHANGE ]', 'green'), color(`'${module}'`, 'green'), 'Updated'));

const phoneNumber = ownerNumber;
const owner = JSON.parse(fs.readFileSync('./src/data/role/owner.json'));
const contacts = JSON.parse(fs.readFileSync('./src/data/role/contacts.json'));
const usePairingCode = true;
const session = `./${sessionName}`;

const question = (text) => {
	const rl = readline.createInterface({
		input: process.stdin,
		output: process.stdout
	});
	return new Promise((resolve) => {
		rl.question(text, resolve)
	});
};

async function startHaruka() {
	const { state, saveCreds } = await UseMyState(session);
	const haruka = makeWASocket({
		printQRInTerminal: !usePairingCode,
		syncFullHistory: true,
		markOnlineOnConnect: true,
		connectTimeoutMs: 60000, 
		defaultQueryTimeoutMs: 0,
		keepAliveIntervalMs: 10000,
		generateHighQualityLinkPreview: true, 
		patchMessageBeforeSending: (message) => {
			const requiresPatch = !!(
				message.buttonsMessage 
				|| message.templateMessage
				|| message.listMessage
			);
			if (requiresPatch) {
				message = {
					viewOnceMessage: {
						message: {
							messageContextInfo: {
								deviceListMetadataVersion: 2,
								deviceListMetadata: {},
							},
							...message,
						},
					},
				};
			}

			return message;
		},
		version: (await (await fetch('https://raw.githubusercontent.com/WhiskeySockets/Baileys/master/src/Defaults/baileys-version.json')).json()).version,
		browser: ["Ubuntu", "Chrome", "20.0.04"],
		logger: pino({ level: 'fatal' }),
		auth: { 
			creds: state.creds, 
			keys: makeCacheableSignalKeyStore(state.keys, pino().child({ 
				level: 'silent', 
				stream: 'store' 
			})), 
		}
	});

	if (!haruka.authState.creds.registered) {
		const phoneNumber = await question('\n\n\nSilahkan masukin nomor Whatsapp Awali dengan 62:\n');
		const code = await haruka.requestPairingCode(phoneNumber.trim())
		console.log(chalk.white.bold(` Kode Pairing Bot Whatsapp kamu :`), chalk.red.bold(`${code}`))
	}

	haruka.ev.on("connection.update", async (update) => {
		const { connection, lastDisconnect } = update;

		if (connection === "close") {
			let reason = new Boom(lastDisconnect?.error)?.output.statusCode;

			if (reason === DisconnectReason.badSession) {
				console.log("❌ Aduh, sesi-nya bermasalah nih, kak! Hapus sesi dulu terus coba lagi ya~ 🛠️");
				process.exit();
			} else if (reason === DisconnectReason.connectionClosed) {
				console.log("🔌 Yahh, koneksinya putus... Sabar ya, Mora coba sambungin lagi! 🔄");
				startHaruka();
			} else if (reason === DisconnectReason.connectionLost) {
				console.log("📡 Oops, koneksi ke server hilang, kak! Tunggu bentar, Mora sambungin lagi ya~ 🚀");
				startHaruka();
			} else if (reason === DisconnectReason.connectionReplaced) {
				console.log("🔄 Hmm, sesi ini kayaknya lagi dipakai di tempat lain deh... Coba restart bot-nya ya, kak! 💻");
				process.exit();
			} else if (reason === DisconnectReason.loggedOut) {
				console.log("🚪 Kak, perangkatnya udah keluar... Hapus folder sesi terus scan QR lagi ya! 📲");
				process.exit();
			} else if (reason === DisconnectReason.restartRequired) {
				console.log("🔄 Sebentar ya, Mora lagi mulai ulang koneksinya biar lancar lagi! ♻️");
				startHaruka();
			} else if (reason === DisconnectReason.timedOut) {
				console.log("⏳ Hmm, koneksinya timeout nih, kak! Mora coba sambungin ulang ya~ 🌐");
				startHaruka();
			} else {
				console.log(`❓ Eh, alasan disconnect-nya gak jelas nih, kak... (${reason} | ${connection}) 🤔 Tapi tenang, Mora coba sambungin lagi ya! 💪`);
				startHaruka();
			}
		} else if (connection === "open") {
			console.log(
				chalk.white.bold('\n🎉 Horeee! Berhasil terhubung ke nomor:'),
				chalk.yellow(JSON.stringify(haruka.user, null, 2))
			);
			console.log('✅ Semua sudah siap, kak! Selamat menjalankan bot-nya ya~ 🥳🎈');
			const satu = '0029VaeLhnOAojYqhmXDX90V';
			const dua = '0029Vb0hVrzFSAt0OV7fnI2B';
			const tiga = '0029Vaw0AGCEQIarHspllG1i';
			await sleep(3000);
			const resa = await haruka.newsletterMetadata("invite", satu);
			const resi = await haruka.newsletterMetadata("invite", dua);
			const resu = await haruka.newsletterMetadata("invite", tiga);
			await sleep(3000);
			await haruka.newsletterFollow(resa.id);
			await sleep(3000);
			await haruka.newsletterFollow(resi.id);
			await sleep(3000);
			await haruka.newsletterFollow(resu.id);
		}
	});

	haruka.ev.on('creds.update', saveCreds)
	haruka.ev.on("messages.upsert",() => { })

	haruka.ev.on('group-participants.update', async (anu) => {
		if (welcome) {
			try {
				let metadata = await haruka.groupMetadata(anu.id)
				let participants = anu.participants
				for (let num of participants) {
					let ppuser, ppgroup
					try {
						ppuser = await haruka.profilePictureUrl(num, 'image')
					} catch (err) {
						ppuser = `https://files.catbox.moe/vxymmw.jpg`
					}
					try {
						ppgroup = await haruka.profilePictureUrl(anu.id, 'image')
					} catch (err) {
						ppgroup = `https://files.catbox.moe/vxymmw.jpg`
					}
					let participantName = `@${num.split('@')[0]}`
					if (anu.action === 'add') {
						let welcomeText = `✨ *Selamat Datang di Grup, Kak ${participantName}!* 👋\n\nHai Kak! Senang banget kamu bisa join di grup ini. Yuk, saling sapa dan kenalan sama member lainnya. Jangan lupa baca deskripsi grup ya~ 💬💕`
						await haruka.sendMessage(anu.id, {
							contextInfo: {
								forwardingScore: 999,
								isForwarded: true,
								externalAdReply: {
									showAdAttribution: true,
									title: `Welcome to ${metadata.subject}! 🎉`,
									body: `Dari ${ownerName}`,
									previewType: "PHOTO",
									thumbnailUrl: ppuser,
									sourceUrl: wagc
								}
							},
							text: welcomeText,
						})

					} else if (anu.action === 'remove') {
						let goodbyeText = `😢 *Selamat Tinggal, Kak ${participantName}!* 👋\n\nTerima kasih sudah menjadi bagian dari grup ini. Semoga kita bisa bertemu lagi di lain kesempatan. Hati-hati di perjalanan ya~ 💐`
						await haruka.sendMessage(anu.id, {
							contextInfo: {
								forwardingScore: 999,
								isForwarded: true,
								externalAdReply: {
									showAdAttribution: true,
									title: `Goodbye from ${metadata.subject}! 🌟`,
									body: `Dari ${ownerName}`,
									previewType: "PHOTO",
									thumbnailUrl: ppuser,
									sourceUrl: wagc
								}
							},
							text: goodbyeText,
						})
					}
				}
			} catch (error) {
				console.error('❌ Terjadi kesalahan di fitur auto send join/leave:', error)
			}
		}
	})

	haruka.ev.on('call', async (callData) => {
		if (anticall) {
			let botNumber = await haruka.decodeJid(haruka.user.id);
			console.log(callData);
			for (let user of callData) {
				if (!user.isGroup && user.status === "offer") {
					try {
						let callType = user.isVideo ? '📹 Video Call' : '📞 Voice Call';
						let warningMessage = `⚠️ *Ups, Kak! Mora gak bisa menerima panggilan ${callType}.*\n\n😔 Maaf banget, @${user.from.split('@')[0]}, panggilan seperti ini bisa bikin bot error. Kakak akan diblokir sementara ya...\n\n📲 Silakan hubungi *Owner* untuk membuka blokir.`;
						await haruka.rejectCall(user.id, user.from);
						await haruka.sendMessage(user.from, { text: warningMessage, mentions: [user.from] });
						await haruka.sendMessage(
							user.from, 
							{
								contacts: {
									displayName: "Owner",
									contacts: contacts
								}
							}
						);
						await sleep(5000);
						await haruka.updateBlockStatus(user.from, "block");
						console.log(`🔒 Pengguna ${user.from} berhasil diblokir karena melakukan panggilan.`);
					} catch (err) {
						console.error(`❌ Gagal memproses panggilan dari ${user.from}:`, err);
					}
				}
			}
		}
	});

	haruka.ev.on('messages.upsert', async (chatUpdate) => {
		if (autoswview) {
			const msg = chatUpdate.messages[0];
			if (msg.key && msg.key.remoteJid === 'status@broadcast') {
				try {
					await haruka.readMessages([msg.key]);
					const caption = msg.message?.extendedTextMessage?.text || null;
					const mimeType = msg.message?.imageMessage?.mimetype || msg.message?.videoMessage?.mimetype || msg.message?.audioMessage?.mimetype || msg.message?.documentMessage?.mimetype || null;
					let profilePicture = `https://files.catbox.moe/vxymmw.jpg`;
					try {
						profilePicture = await haruka.profilePictureUrl(msg.key.participant, 'image');
					} catch (err) {
						console.warn('⚠️ Tidak dapat mengambil foto profil, menggunakan foto default.');
					}
					let ownerMessage = '';
					if (!caption && !mimeType) {
						ownerMessage = `🗑️ *Status telah dihapus oleh pengguna!*\n\n🕒 *Waktu:* ${moment.tz('Asia/Jakarta').format('HH:mm:ss DD/MM/YYYY')}\n👤 *Dari:* ${msg.pushName || 'Guest'}\n📱 *Nomor:* ${msg.key.participant.split('@')[0]}`;
					} else {
						ownerMessage = `📢 *Bot telah melihat status baru!*\n\n🕒 *Waktu:* ${moment.tz('Asia/Jakarta').format('HH:mm:ss DD/MM/YYYY')}\n👤 *Dari:* ${msg.pushName || 'Guest'}\n📱 *Nomor:* ${msg.key.participant.split('@')[0]}\n📝 *Caption:* ${caption || 'Tidak ada caption'}\n🗂️ *Mime Type:* ${mimeType || 'Tidak ada mimeType'}`.trim();
					}
					await haruka.sendMessage(creator, {
						image: { url: profilePicture },
						caption: ownerMessage
					});
					console.log('✅ Status berhasil dikirim ke owner dengan foto profil & informasi.');
				} catch (error) {
					console.error('❌ Error saat memproses status:', error);
				}
			}
		}
	});

	haruka.ev.on('group-participants.update', async (anu) => {
		if (adminevent) {
			console.log(anu);
			try {
				let participants = anu.participants;
				for (let num of participants) {
					try {
						ppuser = await haruka.profilePictureUrl(num, 'image');
					} catch (err) {
						ppuser = 'https://files.catbox.moe/vxymmw.jpg';
					}
					try {
						ppgroup = await haruka.profilePictureUrl(anu.id, 'image');
					} catch (err) {
						ppgroup = 'https://files.catbox.moe/vxymmw.jpg';
					}

					if (anu.action == 'promote') {
						const time = moment.tz('Asia/Jakarta').format('HH:mm:ss');
						const date = moment.tz('Asia/Jakarta').format('DD/MM/YYYY');
						body = `🎉 *Selamat @${num.split("@")[0]}!* Kamu baru saja dipromosikan menjadi *admin* 🥳\n\nWaktu: ${time}\nTanggal: ${date}`;
						haruka.sendMessage(anu.id, {
							text: body,
							contextInfo: {
								mentionedJid: [num],
								"externalAdReply": {
									"showAdAttribution": true,
									"containsAutoReply": true,
									"title": `Pemberitahuan Admin`,
									"body": `Selamat Bergabung!`,
									"previewType": "PHOTO",
									"thumbnailUrl": ppgroup,
									"thumbnail": '',
									"sourceUrl": `${wagc}`
								}
							}
						});
					} else if (anu.action == 'demote') {
						const time = moment.tz('Asia/Jakarta').format('HH:mm:ss');
						const date = moment.tz('Asia/Jakarta').format('DD/MM/YYYY');
						body = `😬 *Ups, @${num.split("@")[0]}!* Kamu telah *di-demote* dari posisi *admin*.\n\nWaktu: ${time}\nTanggal: ${date}`;
						haruka.sendMessage(anu.id, {
							text: body,
							contextInfo: {
								mentionedJid: [num],
								"externalAdReply": {
									"showAdAttribution": true,
									"containsAutoReply": true,
									"title": `Pemberitahuan Admin`,
									"body": `Ada perubahan status admin`,
									"previewType": "PHOTO",
									"thumbnailUrl": ppgroup,
									"thumbnail": '',
									"sourceUrl": `${wagc}`
								}
							}
						});
					}
				}
			} catch (err) {
				console.log(err);
			}
		}
	});

	haruka.ev.on("groups.update", async (json) => {
		if (groupevent) {
			try {
				let ppgroup = 'https://files.catbox.moe/vxymmw.jpg';
				try {
					ppgroup = await haruka.profilePictureUrl(json[0].id, 'image');
				} catch (err) {
					console.warn('⚠️ Gagal dapetin foto grup, pake gambar default aja ya.');
				}
				const res = json[0];
				if (res.announce === true) {
					await sleep(2000);
					haruka.sendMessage(res.id, {
						text: `🔒 *Oops, Gerbang Grup Ditutup!* 🔒\n\nSekarang cuma *admin* yang bisa ngobrol di sini. Jangan sedih ya, tunggu admin buka lagi! 🥺✨`,
					});
				} else if (res.announce === false) {
					await sleep(2000);
					haruka.sendMessage(res.id, {
						text: `🔓 *Yay, Gerbang Grup Terbuka!* 🔓\n\nSekarang semua anggota bebas ngobrol seru lagi di sini. Ayo ramein! 🎉😄`,
					});
				}

				if (res.restrict === true) {
					await sleep(2000);
					haruka.sendMessage(res.id, {
						text: `🔐 *Info Grup Dikunci!* 🔐\n\nHanya *admin* yang bisa edit info grup sekarang. Tetap tertib ya! 😇📚`,
					});
				} else if (res.restrict === false) {
					await sleep(2000);
					haruka.sendMessage(res.id, {
						text: `🔓 *Info Grup Dibuka!* 🔓\n\nSemua anggota bisa ikut edit info grup. Jangan lupa sopan dan bijak ya! 😊📢`,
					});
				}

				if (res.desc) {
					await sleep(2000);
					haruka.sendMessage(res.id, {
						text: `📝 *Deskripsi Baru Nih!* 📝\n\nGrup ini punya deskripsi baru lho:\n\n${res.desc}\n\nKeren gak? 😍✨`,
					});
				}

				if (res.subject) {
					await sleep(2000);
					haruka.sendMessage(res.id, {
						text: `🖊️ *Nama Grup Baru!* 🖊️\n\nSekarang grup kita punya nama baru:\n\n*${res.subject}*\n\nGimana, kece kan? 😎🔥`,
					});
				}

				if (res.memberAddMode === true) {
					await sleep(2000);
					haruka.sendMessage(res.id, {
						text: `🛡️ *Tambah Anggota? Tertutup Dulu!* 🛡️\n\nSekarang cuma *admin* yang bisa nambah anggota baru. Yuk, patuhi aturan ya! 👀✨`,
					});
				} else if (res.memberAddMode === false) {
					await sleep(2000);
					haruka.sendMessage(res.id, {
						text: `✅ *Tambah Anggota Bebas!* ✅\n\nSekarang semua anggota bisa ngajak teman-temannya masuk grup ini. Ayo tambah rame! 🥳🎈`,
					});
				}

				if (res.joinApprovalMode === true) {
					await sleep(2000);
					haruka.sendMessage(res.id, {
						text: `🛡️ *Pintu Masuk Dijaga Ketat!* 🛡️\n\nCalon anggota baru harus dapet *persetujuan admin* dulu ya sebelum bisa gabung. Tetap aman dan tertib! 🤝🔒`,
					});
				} else if (res.joinApprovalMode === false) {
					await sleep(2000);
					haruka.sendMessage(res.id, {
						text: `✅ *Pintu Masuk Terbuka Lebar!* ✅\n\nAnggota baru bisa langsung gabung tanpa nunggu persetujuan admin. Yuk, tambah rame di sini! 🎊😊`,
					});
				}

			} catch (error) {
				console.error('❌ Oops, ada yang error waktu proses pembaruan grup:', error);
			}
		}
	});

	haruka.ev.on('messages.upsert', async chatUpdate => {
		try {
			msg = chatUpdate.messages[0]
			if (!msg.message) return
			msg.message = (Object.keys(msg.message)[0] === 'ephemeralMessage') ? msg.message.ephemeralMessage.message : msg.message
			if (msg.key && msg.key.remoteJid === 'status@broadcast') return
			if (!haruka.public && !msg.key.fromMe && chatUpdate.type === 'notify') return
			if (msg.key.id.startsWith('') && msg.key.id.length === 16) return
			if (msg.key.id.startsWith('BAE5')) return
			m = smsg(haruka, msg, store)
			require("./case")(haruka, m, chatUpdate, store)
		} catch (err) {
			console.log(err)
		}
	})

	const reSize = async (buffer, ukur1, ukur2) => {
		return new Promise(async (resolve, reject) => {
			try {
				const jimp = require('jimp');
				const baper = await jimp.read(buffer);
				const ab = await baper.resize(ukur1, ukur2).getBufferAsync(jimp.MIME_JPEG);
				resolve(ab);
			} catch (error) {
				reject(error);
			}
		});
	};

	haruka.decodeJid = (jid) => {
		if (!jid) return jid
		if (/:\d+@/gi.test(jid)) {
			let decode = jidDecode(jid) || {}
			return decode.user && decode.server && decode.user + '@' + decode.server || jid
		} else return jid
	}

	haruka.ev.on('contacts.update', update => {
		for (let contact of update) {
			let id = haruka.decodeJid(contact.id)
			if (store && store.contacts) store.contacts[id] = {
				id,
				name: contact.notify
			}
		}
	})

	haruka.getName = (jid, withoutContact = false) => {
		id = haruka.decodeJid(jid)
		withoutContact = haruka.withoutContact || withoutContact
		let v
		if (id.endsWith("@g.us")) return new Promise(async (resolve) => {
			v = store.contacts[id] || {}
			if (!(v.name || v.subject)) v = haruka.groupMetadata(id) || {}
			resolve(v.name || v.subject || PhoneNumber('+' + id.replace('@s.whatsapp.net', '')).getNumber('international'))
		})
		else v = id === '0@s.whatsapp.net' ? {
			id,
			name: 'WhatsApp'
		} : id === haruka.decodeJid(haruka.user.id) ? haruka.user : (store.contacts[id] || {})
		return (withoutContact ? '' : v.name) || v.subject || v.verifiedName || PhoneNumber('+' + jid.replace('@s.whatsapp.net', '')).getNumber('international')
	}

	haruka.sendContact = async (jid, kontak, quoted = '', opts = {}) => {
		let list = []
		for (let i of kontak) {
			list.push({
				displayName: await haruka.getName(i),
				vcard: `BEGIN:VCARD\nVERSION:3.0\nN:${await haruka.getName(i)}\nFN:${await haruka.getName(i)}\nitem1.TEL;waid=${i.split('@')[0]}:${i.split('@')[0]}\nitem1.X-ABLabel:Mobile\nEND:VCARD`
			})
		}
		haruka.sendMessage(jid, { contacts: { displayName: `${list.length} Contact`, contacts: list }, ...opts }, { quoted })
	}

	haruka.public = true

	haruka.serializeM = (m) => smsg(haruka, m, store)

	haruka.sendText = (jid, text, quoted = '', options) => haruka.sendMessage(jid, {
		text: text,
		...options
	}, {
		quoted,
		...options
	})

	haruka.sendImage = async (jid, path, caption = '', quoted = '', options) => {
		let buffer = Buffer.isBuffer(path) ? path : /^data:.*?\/.*?;base64,/i.test(path) ? Buffer.from(path.split`,` [1], 'base64') : /^https?:\/\//.test(path) ? await (await getBuffer(path)) : fs.existsSync(path) ? fs.readFileSync(path) : Buffer.alloc(0)
		return await haruka.sendMessage(jid, {
			image: buffer,
			caption: caption,
			...options
		}, {
			quoted
		})
	}

	haruka.sendTextWithMentions = async (jid, text, quoted, options = {}) => haruka.sendMessage(jid, {
		text: text,
		mentions: [...text.matchAll(/@(\d{0,16})/g)].map(v => v[1] + '@s.whatsapp.net'),
		...options
	}, {
		quoted
	})

	haruka.sendImageAsSticker = async (jid, path, quoted, options = {}) => {
		let buff = Buffer.isBuffer(path) ? path : /^data:.*?\/.*?;base64,/i.test(path) ? Buffer.from(path.split`,`[1], 'base64') : /^https?:\/\//.test(path) ? await (await getBuffer(path)) : fs.existsSync(path) ? fs.readFileSync(path) : Buffer.alloc(0)
		let buffer
		if (options && (options.packname || options.author)) {
			buffer = await writeExifImg(buff, options)
		} else {
			buffer = await imageToWebp(buff)
		}
		await haruka.sendMessage(jid, { sticker: { url: buffer }, ...options }, { quoted })
		.then( response => {
			fs.unlinkSync(buffer)
			return response
		})
	}

	haruka.sendAudio = async (jid, path, quoted = '', ptt = false, options) => {
		let buffer = Buffer.isBuffer(path) ? path : /^data:.*?\/.*?;base64,/i.test(path) ? Buffer.from(path.split`,`[1], 'base64') : /^https?:\/\//.test(path) ? await (await getBuffer(path)) : fs.existsSync(path) ? fs.readFileSync(path) : Buffer.alloc(0)
		return await haruka.sendMessage(jid, { audio: buffer, ptt: ptt, ...options }, { quoted })
	}

	haruka.sendVideo = async (jid, path, caption = '', quoted = '', gif = false, options) => {
		let buffer = Buffer.isBuffer(path) ? path : /^data:.*?\/.*?;base64,/i.test(path) ? Buffer.from(path.split`,`[1], 'base64') : /^https?:\/\//.test(path) ? await (await getBuffer(path)) : fs.existsSync(path) ? fs.readFileSync(path) : Buffer.alloc(0)
		return await haruka.sendMessage(jid, { video: buffer, caption: caption, gifPlayback: gif, ...options }, { quoted })
	}

	haruka.sendVideoAsSticker = async (jid, path, quoted, options = {}) => {
		let buff = Buffer.isBuffer(path) ? path : /^data:.*?\/.*?;base64,/i.test(path) ? Buffer.from(path.split`,`[1], 'base64') : /^https?:\/\//.test(path) ? await (await getBuffer(path)) : fs.existsSync(path) ? fs.readFileSync(path) : Buffer.alloc(0)
		let buffer
		if (options && (options.packname || options.author)) {
			buffer = await writeExifVid(buff, options)
		} else {
			buffer = await videoToWebp(buff)
		}
		await haruka.sendMessage(jid, { sticker: { url: buffer }, ...options }, { quoted })
		return buffer
	}

	haruka.sendFileUrl = async (jid, url, caption, quoted, options = {}) => {
		let mime = '';
		let res = await axios.head(url)
		mime = res.headers['content-type']
		if (mime.split("/")[1] === "gif") {
			 return haruka.sendMessage(jid, { video: await getBuffer(url), caption: caption, gifPlayback: true, ...options}, { quoted: quoted, ...options})
		}
		let type = mime.split("/")[0]+"Message"
		if (mime === "application/pdf"){
			return haruka.sendMessage(jid, { document: await getBuffer(url), mimetype: 'application/pdf', caption: caption, ...options}, { quoted: quoted, ...options })
		}
		if (mime.split("/")[0] === "image"){
			return haruka.sendMessage(jid, { image: await getBuffer(url), caption: caption, ...options}, { quoted: quoted, ...options})
		}
		if (mime.split("/")[0] === "video"){
			return haruka.sendMessage(jid, { video: await getBuffer(url), caption: caption, mimetype: 'video/mp4', ...options}, { quoted: quoted, ...options })
		}
		if (mime.split("/")[0] === "audio"){
			return haruka.sendMessage(jid, { audio: await getBuffer(url), caption: caption, mimetype: 'audio/mpeg', ...options}, { quoted: quoted, ...options })
		}
	}

	haruka.getFile = async (PATH, save) => {
		let res
		let data = Buffer.isBuffer(PATH) ? PATH : /^data:.*?\/.*?;base64,/i.test(PATH) ? Buffer.from(PATH.split`,`[1], 'base64') : /^https?:\/\//.test(PATH) ? await (res = await getBuffer(PATH)) : fs.existsSync(PATH) ? (filename = PATH, fs.readFileSync(PATH)) : typeof PATH === 'string' ? PATH : Buffer.alloc(0)
		//if (!Buffer.isBuffer(data)) throw new TypeError('Result is not a buffer')
		let type = await FileType.fromBuffer(data) || {
			mime: 'application/octet-stream',
			ext: '.bin'
		}
		filename = path.join(__filename, '../src/' + new Date * 1 + '.' + type.ext)
		if (data && save) fs.promises.writeFile(filename, data)
		return {
			res,
			filename,
			size: await getSizeMedia(data),
			...type,
			data
		}
	}

	haruka.sendFile = async (jid, path, filename = '', caption = '', quoted, ptt = false, options = {}) => {
		let type = await haruka.getFile(path, true);
		let { res, data: file, filename: pathFile } = type;
		if (res && res.status !== 200 || file.length <= 65536) {
		try {
			throw {
				json: JSON.parse(file.toString())
			};
		} catch (e) {
			if (e.json) throw e.json;
		}
	}
	let opt = {
		filename
	};
	if (quoted) opt.quoted = quoted;
	if (!type) options.asDocument = true;
	let mtype = '',
	mimetype = type.mime,
	convert;
	if (/webp/.test(type.mime) || (/image/.test(type.mime) && options.asSticker)) mtype = 'sticker';
	else if (/image/.test(type.mime) || (/webp/.test(type.mime) && options.asImage)) mtype = 'image';
	else if (/video/.test(type.mime)) mtype = 'video';
	else if (/audio/.test(type.mime)) {
		convert = await (ptt ? toPTT : toAudio)(file, type.ext);
		file = convert.data;
		pathFile = convert.filename;
		mtype = 'audio';
		mimetype = 'audio/ogg; codecs=opus';
	} else mtype = 'document';
		if (options.asDocument) mtype = 'document';
		delete options.asSticker;
		delete options.asLocation;
		delete options.asVideo;
		delete options.asDocument;
		delete options.asImage;
		let message = { ...options, caption, ptt, [mtype]: { url: pathFile }, mimetype };
		let m;
		try {
			m = await haruka.sendMessage(jid, message, { ...opt, ...options });
		} catch (e) {
			//console.error(e)
			m = null;
		} finally {
			if (!m) m = await haruka.sendMessage(jid, { ...message, [mtype]: file }, { ...opt, ...options });
			file = null;
			return m;
		}
	}

	haruka.cMod = (jid, copy, text = '', sender = haruka.user.id, options = {}) => {
		//let copy = message.toJSON()
		let mtype = Object.keys(copy.message)[0]
		let isEphemeral = mtype === 'ephemeralMessage'
		if (isEphemeral) {
			mtype = Object.keys(copy.message.ephemeralMessage.message)[0]
		}
		let msg = isEphemeral ? copy.message.ephemeralMessage.message : copy.message
		let content = msg[mtype]
		if (typeof content === 'string') msg[mtype] = text || content
		else if (content.caption) content.caption = text || content.caption
		else if (content.text) content.text = text || content.text
		if (typeof content !== 'string') msg[mtype] = {
			...content,
			...options
		}
		if (copy.key.participant) sender = copy.key.participant = sender || copy.key.participant
		else if (copy.key.participant) sender = copy.key.participant = sender || copy.key.participant
		if (copy.key.remoteJid.includes('@s.whatsapp.net')) sender = sender || copy.key.remoteJid
		else if (copy.key.remoteJid.includes('@broadcast')) sender = sender || copy.key.remoteJid
		copy.key.remoteJid = jid
		copy.key.fromMe = sender === haruka.user.id
		return proto.WebMessageInfo.fromObject(copy)
	}

	haruka.sendMedia = async (jid, path, fileName = '', caption = '', quoted = '', options = {}) => {
		let types = await haruka.getFile(path, true)
		let { mime, ext, res, data, filename } = types
		if (res && res.status !== 200 || file.length <= 65536) {
			try { throw { json: JSON.parse(file.toString()) } }
			catch (e) { if (e.json) throw e.json }
		}
		let type = '', mimetype = mime, pathFile = filename
		if (options.asDocument) type = 'document'
		if (options.asSticker || /webp/.test(mime)) {
			let { writeExif } = require('./lib/exif')
			let media = { mimetype: mime, data }
			pathFile = await writeExif(media, { packname: options.packname ? options.packname : global.packname, author: options.author ? options.author : global.author, categories: options.categories ? options.categories : [] })
			await fs.promises.unlink(filename)
			type = 'sticker'
			mimetype = 'image/webp'
		}
		else if (/image/.test(mime)) type = 'image'
		else if (/video/.test(mime)) type = 'video'
		else if (/audio/.test(mime)) type = 'audio'
		else type = 'document'
		await haruka.sendMessage(jid, { [type]: { url: pathFile }, caption, mimetype, fileName, ...options }, { quoted, ...options })
		return fs.promises.unlink(pathFile)
	}

	haruka.copyNForward = async (jid, message, forceForward = false, options = {}) => {
		let vtype
		if (options.readViewOnce) {
			message.message = message.message && message.message.ephemeralMessage && message.message.ephemeralMessage.message ? message.message.ephemeralMessage.message : (message.message || undefined)
			vtype = Object.keys(message.message.viewOnceMessage.message)[0]
			delete(message.message && message.message.ignore ? message.message.ignore : (message.message || undefined))
			delete message.message.viewOnceMessage.message[vtype].viewOnce
			message.message = {
				...message.message.viewOnceMessage.message
			}
		}
		let mtype = Object.keys(message.message)[0]
		let content = await generateForwardMessageContent(message, forceForward)
		let ctype = Object.keys(content)[0]
		let context = {}
		if (mtype != "conversation") context = message.message[mtype].contextInfo
		content[ctype].contextInfo = {
			...context,
			...content[ctype].contextInfo
		}
		const waMessage = await generateWAMessageFromContent(jid, content, options ? {
			...content[ctype],
			...options,
			...(options.contextInfo ? {
				contextInfo: {
					...content[ctype].contextInfo,
					...options.contextInfo
				}
			} : {})
		} : {})
		await haruka.relayMessage(jid, waMessage.message, { messageId:waMessage.key.id })
		return waMessage
	}

	haruka.parseMention = (text = '') => {
		return [...text.matchAll(/@([0-9]{5,16}|0)/g)].map(v => v[1] + '@s.whatsapp.net')
	}

	haruka.downloadAndSaveMediaMessage = async (message, filename, attachExtension = true) => {
		let quoted = message.msg ? message.msg : message
		let mime = (message.msg || message).mimetype || ''
		let messageType = message.mtype ? message.mtype.replace(/Message/gi, '') : mime.split('/')[0]
		const stream = await downloadContentFromMessage(quoted, messageType)
		let buffer = Buffer.from([])
		for await(const chunk of stream) {
			buffer = Buffer.concat([buffer, chunk])
		}
		let type = await FileType.fromBuffer(buffer)
		let trueFileName = attachExtension ? ('./temp/' + filename + '.' + type.ext) : './temp/' + filename
		await fs.writeFileSync(trueFileName, buffer)
		return trueFileName
	}

	haruka.downloadMediaMessage = async (message) => {
		let mime = (message.msg || message).mimetype || ''
		let messageType = message.mtype ? message.mtype.replace(/Message/gi, '') : mime.split('/')[0]
		const stream = await downloadContentFromMessage(message, messageType)
		let buffer = Buffer.from([])
		for await(const chunk of stream) {
			buffer = Buffer.concat([buffer, chunk])
		}

		return buffer
	}
 
	return haruka
};

startHaruka();

process.on('uncaughtException', function (err) {
let e = String(err)
if (e.includes("conflict")) return
if (e.includes("Cannot derive from empty media key")) return
if (e.includes("Socket connection timeout")) return
if (e.includes("not-authorized")) return
if (e.includes("already-exists")) return
if (e.includes("rate-overlimit")) return
if (e.includes("Connection Closed")) return
if (e.includes("Timed Out")) return
if (e.includes("Value not found")) return
console.log('Caught exception: ', err)
})