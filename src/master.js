const { Master } = require('discord-rose')
const path = require('path')
const fetch = require('node-fetch')
const config = require('../config')

const { Interface } = require('@jpbbots/interface')
const int = new Interface()

const AutoPoster = require('topgg-autoposter')

const master = new Master(path.resolve(__dirname, './worker.js'), {
  token: config.token,
  cache: {
    channels: false,
    roles: false
  },
  cacheControl: {
    guilds: []
  }
})

int.setupMaster(master, 'frogbot')

AutoPoster(config.dbl, master).on('posted', () => {
  console.log('Posted stats to Top.gg')
})

let currentAmount = 450
let links = []

function shuffle(array) {
  var currentIndex = array.length, temporaryValue, randomIndex;

  // While there remain elements to shuffle...
  while (0 !== currentIndex) {

    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    // And swap it with the current element.
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
}

const getNewPage = async () => {
  const newPage = Math.floor(Math.random() * (currentAmount / 60))
  console.log('Fetching new page ' + newPage)
  const req = await fetch(`https://api.imgur.com/3/gallery/t/frogs/random/${newPage}`, {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Client-ID ${config.imgur}`
    }
  })
  if (!req.ok) throw new Error('Error whilst fetching stats: ' + req.statusText)
  const json = await req.json()

  currentAmount = json.data.total_items

  links = shuffle(json.data.items.reduce((a, b) => a.concat(b.images?.filter(x => x.type.startsWith('image')).map(x => x.link)), []).filter(x => x))
  return true
}

master.handlers.on('GET_IMAGE', async (shard, _, respond) => {
  if (links.length < 1 && !await getNewPage().catch(err => {
    respond({ error: 'An error occurred whilst fetching images. Please try again later.' })
    console.log(err)

    return false
  })) return

  respond(links[Math.floor(Math.random() * 2) ? 'pop' : 'shift']())
})

master.start()