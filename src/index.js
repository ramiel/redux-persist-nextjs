const Cookies = require('js-cookie')
const SSParser = require('cookie')

class NextStorage {
  constructor (ctx) {
    this.cookies = {}
    this.ctx = ctx
    this.isServer = !!ctx.req

    if (ctx.req) {
      // server
      const cookies = ctx.req.headers.cookie
      this.cookies = cookies ? SSParser.parse(cookies) : {}
    } else {
      // browser
      this.cookies = Cookies.getJSON()
    }
    this.cookies = {}
  }

  getItem (key, cb) {
    const value = this.cookies[key]
    cb(null, value)
  }

  setItem (key, value, cb) {
    if (this.isServer && this.ctx.res) {
      this.ctx.res.setHeader('Set-Cookie', [`${key}=${value}`])
    } else {
      Cookies.set(key, value)
    }
    cb(null)
  }

  removeItem (key, cb) {
    if (this.isServer && this.ctx.res) {
      this.ctx.res.setHeader('Set-Cookie', [`${key}=null; expires=${(new Date(0)).toUTCString()}`])
    } else {
      Cookies.remove(key)
    }
    cb(null)
  }

  getAllKeys (cb) {
    cb(null, Object.keys(this.cookies))
  }
}

module.exports = NextStorage
