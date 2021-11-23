/*
 * @Description: file
 * @Autor: dingyiming
 * @Date: 2021-11-22 21:20:10
 * @LastEditors: dingyiming
 * @LastEditTime: 2021-11-23 11:19:51
 */
import fetch from 'node-fetch'
import { getLocalChains } from './data/data'

export default class OsmosAPI {
  preHandler() {
    this.version = ''
  }

  async get(url) {
    const chains = getLocalChains()
    this.host = chains.osmosis.api
    return fetch(`${this.host}${url}`).then(res => res.json())
  }

  async getOHCL4Pairs(from, to) {
    this.exe_time = ''
    return Promise.all(
      [fetch(`https://api.coingecko.com/api/v3/coins/${from}/ohlc?vs_currency=usd&days=1`).then(res => res.json()),
        fetch(`https://api.coingecko.com/api/v3/coins/${to}/ohlc?vs_currency=usd&days=1`).then(res => res.json())],
    ).then(ohlc => {
      console.log(ohlc)
      const output = []
      ohlc[0].forEach((e, i) => {
        const price = [e[0]]
        for (let j = 1; j <= 4; j += 1) {
          price.push(e[j] / ohlc?.[1]?.[i]?.[j])
        }
        output.push(price)
      })
      const result = []
      for (let i = 0; i < output.length; i += 1) {
        const itemArr = output[i]
        result.push({
          time: itemArr[0],
          volume: 0,
          open: itemArr[1],
          high: itemArr[2],
          low: itemArr[3],
          close: itemArr[4],
        })
      }
      return result
    })
  }

  getCoinGeckoId(symbol) {
    this.pairs = {
      ATOM: 'cosmos',
      OSMO: 'osmosis',
      IRIS: 'iris-network',
      AKT: 'akash-network',
    }
    return this.pairs[symbol]
  }

  getIBCDenomHash(symbol) {
    this.IBChash = {
      ATOM: 'cosmos',
      OSMO: 'uosmo',
      IRIS: 'iris-network',
      AKT: 'akash-network',
    }
    return this.IBChash[symbol]
  }

  // Custom Module
  async getPools() {
    return this.get('/osmosis/gamm/v1beta1/pools?pagination.limit=700')
  }

  async getIncentivesPools() {
    return this.get('/osmosis/pool-incentives/v1beta1/incentivized_pools?pagination.limit=700')
  }
}
