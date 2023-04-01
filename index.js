const {
  Client,
  Location,
  List,
  Buttons,
  LocalAuth,
} = require("whatsapp-web.js");

const client = new Client({
  authStrategy: new LocalAuth(),
  puppeteer: { headless: false },
});

client.initialize();

client.on("loading_screen", (percent, message) => {
  console.log("LOADING SCREEN", percent, message);
});

client.on("qr", (qr) => {
  // NOTE: This event will not be fired if a session is specified.
  console.log("QR RECEIVED", qr);
});

client.on("authenticated", () => {
  console.log("AUTHENTICATED");
});

client.on("auth_failure", (msg) => {
  // Fired if session restore was unsuccessful
  console.error("AUTHENTICATION FAILURE", msg);
});

client.on("ready", () => {
  console.log("READY");
});

client.on("message", async (message) => {
  if (message.body.startsWith("cuaca")) {
    const location = message.body.slice(7);
    try {
      const response = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=YOUR_API_KEY&units=metric`
      );
      const weather = response.data.weather[0].description;
      const temp = response.data.main.temp;
      client.sendMessage(
        message.from,
        `Cuaca di ${location} saat ini: ${weather} dengan suhu ${temp} derajat Celsius`
      );
    } catch (error) {
      console.error(error);
      client.sendMessage(
        message.from,
        "Maaf, terjadi kesalahan dalam memproses permintaan Anda."
      );
    }
  }
});

client.on("message", async (message) => {
  // Cek jika pesan masuk dari grup
  if (message.isGroupMsg) {
    // Cek jika pesan mengandung nama orang
    if (message.body.includes("nama")) {
      // Dapatkan array nama-nama yang unik
      const names = message.body.match(/\b([A-Z][a-z]+)\b/g);
      if (names) {
        // Iterasi setiap nama dan tambahkan ke dalam uniqueNames
        names.forEach((name) => {
          if (!uniqueNames.includes(name)) {
            uniqueNames.push(name);
          }
        });
        // Balas pesan dengan daftar nama-nama unik
        const reply = `Anjayy nama nya Unik ya, WKWKWK:\n${uniqueNames.join(
          ", "
        )}`;
        await message.reply(reply);
      }
    }
  }
});

client.on("message", (message) => {
  const messageText = message.body.toLowerCase();

  switch (messageText) {
    case "hello":
      client.sendMessage(message.from, "Yow, WhatsApp Bro Ada Apa Nich?");
      break;
    case "pagi":
      client.sendMessage(message.from, "Iya Pagi Juga sayang");
      break;
    case "malam":
      client.sendMessage(message.from, "Iya Malam Juga sayang");
      break;
    case "siang":
      client.sendMessage(message.from, "Iya Siang Juga sayang");
      break;
    case "sore":
      client.sendMessage(message.from, "Iya Sore Juga sayang");
      break;
    case "nama":
      client.sendMessage(
        message.from,
        "Saya tidak punya nama, Saya Bot Asisten Mu!"
      );
      break;
    default:
      break;
  }
});

client.on("message", async (msg) => {
  console.log("MESSAGE RECEIVED", msg);

  if (msg.body === "bot") {
    // Send a new message as a reply to the current one
    msg.reply("iya saya, apakah ada yang bisa dibantu");
  } else if (msg.body === "Info") {
    // Send a new message to the same chat
    client.sendMessage(
      msg.from,
      "Hi! Ketik apa yang kalian inginkan. 1. Surat Penting 2. Jadwal Ronda 3. Kegiatan"
    );
  } else if (msg.body.startsWith("!sendto ")) {
    // Direct send a new message to specific id
    let number = msg.body.split(" ")[1];
    let messageIndex = msg.body.indexOf(number) + number.length;
    let message = msg.body.slice(messageIndex, msg.body.length);
    number = number.includes("@c.us") ? number : `${number}@c.us`;
    let chat = await msg.getChat();
    chat.sendSeen();
    client.sendMessage(number, message);
  } else if (msg.body.startsWith("!subject ")) {
    // Change the group subject
    let chat = await msg.getChat();
    if (chat.isGroup) {
      let newSubject = msg.body.slice(9);
      chat.setSubject(newSubject);
    } else {
      msg.reply("This command can only be used in a group!");
    }
  } else if (msg.body.startsWith("!echo ")) {
    // Replies with the same message
    msg.reply(msg.body.slice(6));
  } else if (msg.body.startsWith("!desc ")) {
    // Change the group description
    let chat = await msg.getChat();
    if (chat.isGroup) {
      let newDescription = msg.body.slice(6);
      chat.setDescription(newDescription);
    } else {
      msg.reply("This command can only be used in a group!");
    }
  } else if (msg.body === "!leave") {
    // Leave the group
    let chat = await msg.getChat();
    if (chat.isGroup) {
      chat.leave();
    } else {
      msg.reply("This command can only be used in a group!");
    }
  } else if (msg.body.startsWith("!join ")) {
    const inviteCode = msg.body.split(" ")[1];
    try {
      await client.acceptInvite(inviteCode);
      msg.reply("Joined the group!");
    } catch (e) {
      msg.reply("That invite code seems to be invalid.");
    }
  } else if (msg.body === "1") {
    let chat = await msg.getChat();
    if (chat.isGroup) {
      msg.reply(`
                *Berikut Pembuatan Surat Penting SKTM*
                1. Fotocopy KTP
                2. Fotocopy Kartu Keluarga
                3. Surat Pengantar RT/RW dan Kadus 
                4. Pas foto rumah yang bersangkutan dari posisi depan dan samping rumah masing-masing ukuran 5R
                
                Tambahan dokumen untuk Urusan Pendidikan:

                1. Surat Pernyataan Tidak Mampu yang bersangkutan disertai materai 6000
                2. Memiliki PIP (Program Indonesia Pintar)/KIP (Kartu Indonesia Pintar)/Bidikmisi
                3. Fotocopy dan asli untuk e-KTP milik orang tua
                4. Fotocopy akta kelahiran anak
                5. Fotocopy KKS atau kartu perlindungan sosial lainnya, jika ada.

                Tambahan dokumen untuk keringanan biaya rawat inap:

                1. Surat Pernyataan tidak mampu disertai materai 6000
                2. Fotocopy Surat Rujukan atau Surat Keterangan Rawat Inap atau Surat Keterangan Sakit dari RS/Dokter
                3. Fotocopy KIS/Kartu BPJS Kesehatan anggota keluarga lain jika ada
                4. Fotocopy KKS jika ada
                
                Tambahan dokumen untuk Jampersal:

                1. Surat pernyataan tidak mampu disertai materai 6000
                2. Fotocopy dan asli e-KTP suami dan istri
                4. Fotocopy surat keterangan lahir dari penolong
                5. Fotocopy surat rujukan atau keterangan rawat inap atau surat keterangan sakit dari RS/Dokter
                6. Fotocopy KIS/Kartu BPJS Kesehatan anggota keluarga lain, jika ada
                7. Fotocopy KKS, jika ada


            `);
    } else {
      msg.reply("Keyword ini untuk di Dalam Grup !");
    }
  } else if (msg.body === "Chats") {
    const chats = await client.getChats();
    client.sendMessage(msg.from, `The bot has ${chats.length} chats open.`);
  } else if (msg.body === "2") {
    let info = client.info;
    client.sendMessage(
      msg.from,
      `
            *INFO JADWAL RONDA*
            1. *Gunung Sulah*
            - Pak Fulan
            - Pak Fulan
            - Pak Fulan
            - Pak Fulan
            2. *Jagabaya I*
            - Pak Fulan
            - Pak Fulan
            - Pak Fulan
            - Pak Fulan
            3. *Jagabaya II*
            - Pak Fulan
            - Pak Fulan
            - Pak Fulan
            - Pak Fulan
            4. *Jagabaya III*
            - Pak Fulan
            - Pak Fulan
            - Pak Fulan
            - Pak Fulan
            5. *Perumnas Way Halim*
            - Pak Fulan
            - Pak Fulan
            - Pak Fulan
            - Pak Fulan
            6. *Way Halim Permai*
            - Pak Fulan
            - Pak Fulan
            - Pak Fulan
            - Pak Fulan
        `
    );
  } else if (msg.body === "Chats") {
    const chats = await client.getChats();
    client.sendMessage(msg.from, `The bot has ${chats.length} chats open.`);
  } else if (msg.body === "3") {
    let info = client.info;
    client.sendMessage(
      msg.from,
      `
        *INFO KEGIATAN BULAN APRIL*
        1. Acara Majelis Sholawat IGFIRLANA 17 April 2023
        2. Bagi-Bagi Takjil di Kelurahan Jagabaya II 20 April 2023
        3. Tadarus Bersama di Masjid AL-IMAN 19 April 2023

        `
    );
  } else if (msg.body === "!quoteinfo" && msg.hasQuotedMsg) {
    const quotedMsg = await msg.getQuotedMessage();

    quotedMsg.reply(`
            ID: ${quotedMsg.id._serialized}
            Type: ${quotedMsg.type}
            Author: ${quotedMsg.author || quotedMsg.from}
            Timestamp: ${quotedMsg.timestamp}
            Has Media? ${quotedMsg.hasMedia}
        `);
  } else if (msg.body === "!resendmedia" && msg.hasQuotedMsg) {
    const quotedMsg = await msg.getQuotedMessage();
    if (quotedMsg.hasMedia) {
      const attachmentData = await quotedMsg.downloadMedia();
      client.sendMessage(msg.from, attachmentData, {
        caption: "Here's your requested media.",
      });
    }
  } else if (msg.body === "!location") {
    msg.reply(
      new Location(37.422, -122.084, "Googleplex\nGoogle Headquarters")
    );
  } else if (msg.location) {
    msg.reply(msg.location);
  } else if (msg.body.startsWith("!status ")) {
    const newStatus = msg.body.split(" ")[1];
    await client.setStatus(newStatus);
    msg.reply(`Status was updated to *${newStatus}*`);
  } else if (msg.body === "!mention") {
    const contact = await msg.getContact();
    const chat = await msg.getChat();
    chat.sendMessage(`Hi @${contact.number}!`, {
      mentions: [contact],
    });
  } else if (msg.body === "!delete") {
    if (msg.hasQuotedMsg) {
      const quotedMsg = await msg.getQuotedMessage();
      if (quotedMsg.fromMe) {
        quotedMsg.delete(true);
      } else {
        msg.reply("I can only delete my own messages");
      }
    }
  } else if (msg.body === "!pin") {
    const chat = await msg.getChat();
    await chat.pin();
  } else if (msg.body === "!archive") {
    const chat = await msg.getChat();
    await chat.archive();
  } else if (msg.body === "!mute") {
    const chat = await msg.getChat();
    // mute the chat for 20 seconds
    const unmuteDate = new Date();
    unmuteDate.setSeconds(unmuteDate.getSeconds() + 20);
    await chat.mute(unmuteDate);
  } else if (msg.body === "!typing") {
    const chat = await msg.getChat();
    // simulates typing in the chat
    chat.sendStateTyping();
  } else if (msg.body === "!recording") {
    const chat = await msg.getChat();
    // simulates recording audio in the chat
    chat.sendStateRecording();
  } else if (msg.body === "!clearstate") {
    const chat = await msg.getChat();
    // stops typing or recording in the chat
    chat.clearState();
  } else if (msg.body === "!jumpto") {
    if (msg.hasQuotedMsg) {
      const quotedMsg = await msg.getQuotedMessage();
      client.interface.openChatWindowAt(quotedMsg.id._serialized);
    }
  } else if (msg.body === "!buttons") {
    let button = new Buttons(
      "Button body",
      [{ body: "bt1" }, { body: "bt2" }, { body: "bt3" }],
      "title",
      "footer"
    );
    client.sendMessage(msg.from, button);
  } else if (msg.body === "!list") {
    let sections = [
      {
        title: "sectionTitle",
        rows: [
          { title: "ListItem1", description: "desc" },
          { title: "ListItem2" },
        ],
      },
    ];
    let list = new List("List body", "btnText", sections, "Title", "footer");
    client.sendMessage(msg.from, list);
  } else if (msg.body === "!reaction") {
    msg.react("👍");
  }
});

client.on("message_create", (msg) => {
  // Fired on all message creations, including your own
  if (msg.fromMe) {
    // do stuff here
  }
});

client.on("message_revoke_everyone", async (after, before) => {
  // Fired whenever a message is deleted by anyone (including you)
  console.log(after); // message after it was deleted.
  if (before) {
    console.log(before); // message before it was deleted.
  }
});

client.on("message_revoke_me", async (msg) => {
  // Fired whenever a message is only deleted in your own view.
  console.log(msg.body); // message before it was deleted.
});

client.on("message_ack", (msg, ack) => {
  /*
        == ACK VALUES ==
        ACK_ERROR: -1
        ACK_PENDING: 0
        ACK_SERVER: 1
        ACK_DEVICE: 2
        ACK_READ: 3
        ACK_PLAYED: 4
    */

  if (ack == 3) {
    // The message was read
  }
});

client.on("group_join", (notification) => {
  // User has joined or been added to the group.
  console.log("join", notification);
  notification.reply("👋 Hello! Selamat Datang Teman.");
});

client.on("group_leave", (notification) => {
  // User has left or been kicked from the group.
  console.log("leave", notification);
  notification.reply("Selamat Tinggal Teman.");
});

client.on("group_update", (notification) => {
  // Group picture, subject or description has been updated.
  console.log("update", notification);
});

client.on("change_state", (state) => {
  console.log("CHANGE STATE", state);
});

// Change to false if you don't want to reject incoming calls
let rejectCalls = true;

client.on("call", async (call) => {
  console.log("Call received, rejecting. GOTO Line 261 to disable", call);
  if (rejectCalls) await call.reject();
  await client.sendMessage(
    call.from,
    `[${call.fromMe ? "Outgoing" : "Incoming"}] Phone call from ${
      call.from
    }, type ${call.isGroup ? "group" : ""} ${
      call.isVideo ? "video" : "audio"
    } call. ${
      rejectCalls ? "This call was automatically rejected by the script." : ""
    }`
  );
});

client.on("disconnected", (reason) => {
  console.log("Client was logged out", reason);
});

// const qrcode = require('qrcode-terminal');

// const { Client, LocalAuth } = require('whatsapp-web.js');

// const client = new Client({
//     authStrategy: new LocalAuth(),
//     puppeteer: { headless: false },
// });

// client.on('qr', (qr) => {
//     // Generate and scan this code with your phone
//     console.log('QR RECEIVED', qr);
// });

// client.on('qr', qr => {
//     qrcode.generate(qr, {small: true});
// });

// client.on('ready', () => {
//     console.log('Client is ready!');
// });

// client.on('message', message => {
// 	if(message.body === 'Halo Bot') {
// 		client.sendMessage(message.from, '👋 Hello!, Bot disini. Selamat Datang di Informasi _Desa Rejo Agung._')
// 	}
// });

// client.on('message', message => {
// 	if(message.body === 'Menu') {
// 		client.sendMessage(message.from, 'Hi! Ketik apa yang kalian inginkan. 1. Surat Penting 2. Dokumen Surat 3. Jadwal Ronda ');
// 	}
// });

// client.initialize();

// const express = require('express')
// const app = express()
// const port = 3000
// const qrcode = require('qrcode-terminal');

// const fs = require('fs');
// const { Client, LocalAuth } = require('whatsapp-web.js');

// // const { Client, Location, List, Buttons, LocalAuth} = require('./index');

// const client = new Client({
//     authStrategy: new LocalAuth(),
//     puppeteer: { headless: true },
// });

// client.initialize();

// client.on('loading_screen', (percent, message) => {
//     console.log('LOADING SCREEN', percent, message);
// });

// client.on('qr', (qr) => {
//     // NOTE: This event will not be fired if a session is specified.
//     qrcode.generate(qr, {small: true});
// });

// client.on('authenticated', () => {
//     console.log('AUTHENTICATED');
// });

// client.on('auth_failure', msg => {
//     // Fired if session restore was unsuccessful
//     console.error('AUTHENTICATION FAILURE', msg);
// });

// client.on('ready', () => {
//     console.log('READY');
// });

// app.get('/', (req, res) => {
//   res.send('Hello World!');
// });

// app.get('/api', async (req, res) => {
//     let tujuan = req.query.tujuan;
//     let pesan = req.query.pesan;

//  tujuan = tujuan.substring(1);
//  tujuan = `62${tujuan}@c.us`;
//  let cekUser = await client.isRegisteredUser(tujuan);

//  if (cekUser = true) {
//     client.sendMessage(tujuan, pesan);
//     res.json({
//         status: true,
//         pesan: pesan,
//         msg : 'Send Success',
//     });
//  } else {
//     res.json({
//         status: false,
//         pesan: pesan,
//         msg : 'Message Not sending',
//     });
//  }
//   });
