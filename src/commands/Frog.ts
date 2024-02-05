import { AutoComplete, Command, Run, Options, Thinks } from '@jadl/cmd'
import { Embed } from '@jadl/builders'
import { request } from 'undici'
import FrogCache from "../FrogCache";

@Command('frog', 'Sends a frog image')
export class FrogComand {
  @Run()
  @Thinks()
  async frog(
    @AutoComplete(term => {
      return FrogCache.getCached()
        .filter(v => v.toLowerCase().includes(term.toLowerCase()))
        .slice(0, 25).map(x =>  {
          const frog = x.substring(1)
          return { name: frog, value: frog }
        })
    })
    @Options.String('frog', 'Specific frog to send') frog?: string
  ) {
    // If a frog is not provided, default to random
    const frogUrl = `https://frogs.media/api/${encodeURIComponent(frog ?? 'random')}`
    const { body } = await request(frogUrl)
    const frogDetails = await body.json()

    return new Embed()
      .color(0x63e084)
      .title(`${frogDetails.name[0].toUpperCase() + frogDetails.name.substr(1)} frog`, `https://frogs.media/${frogDetails.name}`)
      .image(frogDetails.url)
      .footer(`To see this frog again use "/frog ${frogDetails.name}"`)
  }
}
