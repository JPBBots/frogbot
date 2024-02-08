import { Command, Run, Thinks, CommandError } from '@jadl/cmd'
import { Embed } from '@jadl/builders'
import { request } from 'undici'

@Command('imgur', 'Requests a random frog from imgur')
export class ImgurComand {
  currentAmount = 450
  links: string[] = []

  @Run()
  @Thinks()
  async random() {
    const frog = await this.getFrog()

    return new Embed()
      .color(0x63e084)
      .image(frog)
      .footer('Images sourced from imgur.com/r/frogs')
  }

  async getNewPage(): Promise<boolean> {
    const newPage = Math.floor(Math.random() * (this.currentAmount / 60))

    console.log('Fetching new page ' + newPage)

    const { body, statusCode } = await request(`https://api.imgur.com/3/gallery/t/frogs/random/${newPage}`, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Client-ID ${process.env.IMGUR_ID}`
      },
      method: 'GET'
    })

    if (statusCode !== 200) throw new CommandError('Error whilst fetching new frog images')
    const json = await body.json() as { data: ImgurRestApi.Tag }

    this.currentAmount = json.data.total_items

    this.links = this.shuffle(
      (json.data.items as ImgurRestApi.GalleryAlbum[])
        .reduce<string[]>(
          (a, b) =>
            a.concat(
              b.images
                ?.filter(x => x.type.startsWith('image'))
                .map(x => x.link)
            ), []
        )
        .filter(x => x)
    )
    return true
  }

  shuffle<T extends any[]>(array: T): T {
    var currentIndex = array.length, temporaryValue, randomIndex

    // While there remain elements to shuffle...
    while (0 !== currentIndex) {

      // Pick a remaining element...
      randomIndex = Math.floor(Math.random() * currentIndex)
      currentIndex -= 1

      // And swap it with the current element.
      temporaryValue = array[currentIndex]
      array[currentIndex] = array[randomIndex]
      array[randomIndex] = temporaryValue
    }

    return array
  }

  async getFrog(): Promise<string> {
    if (!this.links || !this.links.length) await this.getNewPage()

    return this.links[Math.floor(Math.random() * 2) ? 'pop' : 'shift']()!
  }
}
