const Cookies = require('js-cookies')
const SSParser = require('cookie')

class NextStorage {
  constructor (ctx) {
    this.cookies = {}
    this.ctx = ctx
    this.isServer = !!ctx.req

    if (ctx.req) {
      // server
      const cookies = ctx.req.headers.cookie
      if (!cookies) return {}
      this.cookies = SSParser.parse(cookies)
    } else {
      // browser
      this.cookies = Cookies.getJSON()
    }
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
  }

  getAllKeys (cb) {
    cb(this.cookies)
  }
}

module.exports = NextStorage
