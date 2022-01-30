import { Command, Run, Thinks } from '@jadl/cmd'
import { Embed } from '@jadl/embed'
import { request } from 'undici'

@Command('list', 'Lists all the frog names')
export class ListCommand {
  @Run()
  @Thinks()
  async list () {
    const { body } = await request('https://frogs.media/api/list')
    const list = await body.json()
    
    return new Embed()
      .title('List of frogs', 'https://frogs.media')
      .description(list.map(x => `\`${x.substr(1)}\``).join(', ') + ` (${list.length} total)`)
      .footer('Send frog [frog] to see specific frog')
  }
}
