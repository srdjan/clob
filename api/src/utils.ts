type Money = number //todo: in cents, but will require higher precision

type Result<T> = {
  outcome: boolean
  message?: string
  data?: T
}

const log = console.log //todo: replace with real logger after v0.1

function * counter () {
  let current = 0
  while (true) {
    yield ++current
  }
}
let currentID: number = 0
const seqGenerator = () => currentID++
// log(`Initialize Sequence generator: ${seqGenerator.next().value}`)

export { Money, Result, log, seqGenerator } 