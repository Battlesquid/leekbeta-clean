interface flags {
    [key: string]: number
}

const FLAGS: flags = {
    "VERIFY": 1 << 1,
    "VERIFIER": 1 << 2,
    "BULLETIN": 1 << 3,
    "LOCKED": 1 << 4
}

export default FLAGS;