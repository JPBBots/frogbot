import { AutoComplete, Command, Run, Options, Thinks } from '@jadl/cmd'
import { Embed } from '@jadl/builders'
import { request } from 'undici'

@Command('frog', 'Sends a frog image')
export class FrogComand {
  @Run()
  @Thinks()
  async frog(
    @AutoComplete(async term => {
      const { body } = await request('https://frogs.media/api/list')
      const list: string[] = await body.json()
      return list
        .filter(v => v.toLowerCase().includes(term.toLowerCase()))
        .slice(0, 25).map(x =>  {
          const frog = x.substring(1)
          return { name: frog, value: frog }
        })
    })
    @Options.String('frog', 'Specific frog to send') frog?: string
  ) {
    if (!frog) {
      const { body } = await request('https://frogs.media/api/random')
      const randomFrog = await body.json()

      return new Embed()
        .color(0x63e084)
        .title(`${randomFrog.name[0].toUpperCase() + randomFrog.name.substr(1)} frog`, `https://frogs.media/${randomFrog.name}`)
        .image(randomFrog.url)
        .footer(`To see this frog again use "/frog ${randomFrog.name}"`)
    } else {
      return new Embed()
        .color(0x63e084)
        .title(`${frog} frog`)
        .image(`https://frogs.media/api/images/${encodeURIComponent(frog)}.gif`)
    }
  }
}
