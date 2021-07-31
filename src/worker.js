const { Worker } = require('discord-rose')
const cooldownMiddleware = require('@discord-rose/cooldown-middleware')

const fetch = require('node-fetch')

const { Interface } = require('@jpbbots/interface')

const interface = new Interface()

const worker = new Worker()

interface.setupWorker(worker)

worker.on('READY', () => {
  worker.setStatus('watching', 'frogs', 'online')
})

const color = 0x63e084

worker.commands
  .middleware(cooldownMiddleware())
  .prefix(['frogs', 'frog'])
  .add({
    command: '',
    exec: async (ctx) => {
      const frog = await fetch('https://frogs.media/api/random').then(x => x.json())

      ctx.embed
        .color(color)
        .title(`${frog.name[0].toUpperCase() + frog.name.substr(1)} frog`, `https://frogs.media/${frog.name}`)
        .image(frog.url)
        .footer(`To see this frog again say ${ctx.prefix}${frog.name}`)
        .send()
    }
  })
  .add({
    command: 'imgur',
    interaction: {
      name: 'imgur',
      description: 'Requests a random frog from imgur instead'
    },
    exec: async (ctx) => {
      await ctx.typing()
      const frog = await worker.comms.sendCommand('GET_IMAGE')

      console.log(frog)

      ctx.embed
        .color(color)
        .image(frog)
        .footer('Images sourced from imgur.com/r/frogs')
        .send()

      ctx.invokeCooldown()
    },
    cooldown: 2000
  })
  .add({
    command: 'help',
    exec: (ctx) => {
      ctx.embed
        .color(color)
        .title('Frog Bot')
        .description('To get a random frog image, simply type `frog` or @ the bot.\n You can also type `frog [frog]` to see a specific frog\nType `frog list` to see a list of available frogs')
        .send()
    }
  })
  .add({
    command: 'list',
    aliases: ['ls'],
    interaction: {
      name: 'list',
      description: 'Sends a list of frogs'
    },
    exec: (ctx) => {
      fetch('https://frogs.media/api/list').then(x => x.json())
        .then(list => {
          ctx.embed
            .title('List of frogs', 'https://frogs.media')
            .description(list.map(x => `\`${x.substr(1)}\``).join(', ') + ` (${list.length} total)`)
            .footer('Send frog [frog] to see specific frog')
            .send()
        })
    }
  })
  .add({
    command: /^[a-z]+$/i,
    exec: (ctx) => {
      if (ctx.args[1]) return
      const frog = ctx.message.content.substr(ctx.prefix.length)
      ctx.embed
        .color(color)
        .title(`${frog} frog`)
        .image(`https://frogs.media/api/images/${frog}.gif`)
        .send()
    }
  })
  .add({
    command: 'frogcommand',
    interaction: {
      name: 'frog',
      description: 'Sends a frog image',
      options: [{
        name: 'frog',
        description: 'Specific frog to send',
        type: 3
      }]
    },
    exec: async (ctx) => {
      if (!ctx.isInteraction) return

      if (!ctx.args[0]) {
        const frog = await fetch('https://frogs.media/api/random').then(x => x.json())

        ctx.embed
          .color(color)
          .title(`${frog.name[0].toUpperCase() + frog.name.substr(1)} frog`, `https://frogs.media/${frog.name}`)
          .image(frog.url)
          .footer(`To see this frog again say ${ctx.prefix}frog ${frog.name}`)
          .send()
      } else {
        const frog = ctx.args[0]
        ctx.embed
          .color(color)
          .title(`${frog} frog`)
          .image(`https://frogs.media/api/images/${encodeURIComponent(frog)}.gif`)
          .send()
      }
    }
  })