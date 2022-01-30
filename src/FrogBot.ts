import { SingleWorker } from 'jadl'
import { CommandHandler } from '@jadl/cmd'
import { Interface } from '@jpbbots/interface'

import { GatewayIntentBits } from 'discord-api-types'

import { FrogComand } from './commands/Frog'
import { ListCommand } from './commands/List'
import { ImgurComand } from './commands/Imgur'

export class FrogBot extends SingleWorker {
  int = new Interface()

  cmd = new CommandHandler(this, [
    FrogComand,
    ListCommand,
    ImgurComand
  ], {
    interactionGuild: this.int.production ? undefined : '569907007465848842'
  })

  constructor () {
    super({
      token: process.env.BOT_TOKEN!,
      cache: {
        channels: [],
        roles: false
      },
      cacheControl: {
        guilds: []
      },
      intents: GatewayIntentBits.Guilds | GatewayIntentBits.GuildMessages
    })

    this.setStatus('playing', 'with froggies')

    this.int.setupSingleton(this, 'frogbot')

    this.int.commands.setupOldCommand(['frog'], ['', 'frog', 'imgur', 'list', 'ls', 'help'])
  }
}
