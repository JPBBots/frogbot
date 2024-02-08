import { Command, Run, Thinks } from '@jadl/cmd'
import { Embed } from '@jadl/builders'
import FrogCache from "../FrogCache";

@Command('list', 'Lists all the frog names')
export class ListCommand {
  @Run()
  @Thinks()
  async list () {
    const list = await FrogCache.fetch()

    return new Embed()
      .title('List of frogs', 'https://frogs.media')
      .description(list.map(x => `\`${x.substr(1)}\``).join(', ') + ` (${list.length} total)`)
      .footer('Send frog [frog] to see specific frog')
  }
}
