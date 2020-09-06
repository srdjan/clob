import { uuid as getUid } from 'uuidv4'
type Money = number //todo: in cents, but will require higher precision

type Result<T> = {
  outcome: boolean
  message?: string
  data?: T
}

type Uid = string

const log = console.log //todo: replace with real logger after v0.1

function * counter () {
  let current = 0
  while (true) {
    yield ++current
  }
}
const seqGenerator = counter()
log(`Initialize Sequence generator: ${seqGenerator.next().value}`)

export { Money, Result, Uid, getUid, log, seqGenerator } 