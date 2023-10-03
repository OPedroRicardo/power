// A Miau é foda

import puppy from 'puppeteer'
import fs from 'node:fs/promises'
import { constants } from 'fs'

import { analisysOptionsType, analisysItemType, responseObjType, statItemsType } from './types/ScrapperTypes'

export default class Scrapper {
  static async init () {
    const instance = new this();

    await instance.tiktokAnalisys({
      categories: ['Dança e Música', 'Entretenimento', 'Animais de estimação e natureza', 'Anime e quadrinhos', 'Jogos', 'Animais', 'Canto e dança'],
      likes_min: 1000000
    });
  }

  async tiktokAnalisys ({
    video_num = 3,
    likes_min = 1000000,
    goto = 'explore',
    categories = ['Dança e Música']
  }: analisysOptionsType) {
    const browser = await puppy.launch({ args: ['--disable-notifications'], headless: false });
    const page = await browser.newPage();

    let [currentCategory] = categories;
    let categoriesIndex = 0;
    console.log(`RUNNING | ${currentCategory}`)
    console.time(`DONE    | ${currentCategory}`)

    await page.setRequestInterception(true);

    const dt = Intl.DateTimeFormat('pt-BR').format(new Date()).replace(/\//g, '-');
    const pathView = `${process.cwd()}/assets/analytics/view/${dt}`;

    await fs.mkdir(pathView, { recursive: true });

    let registers = 0;

    page.on('request', req => { req.continue(); });

    const fullPathView = `${pathView}/${Date.now()}.json`;

    const fok = constants.F_OK;

    const getCategoryKey = (name: string) => name
      .toLowerCase()
      .replace(/ç/gm, 'c')
      .replace(/ã/gm, 'a')
      .replace(/ú/gm, 'u')
      .replace(/\s/gm, '_');

    const saveData = async ({ itemList }: responseObjType) => {
      if (!itemList?.length) return;

      const hypedData = itemList
        .filter((item: analisysItemType) => item.stats.diggCount > likes_min && item.duetEnabled);

      if (!hypedData.length) return;

      const mapFn = (item: analisysItemType) => ({
        id: item.id,
        url: `https://www.tiktok.com/@${item.author.uniqueId}/video/${item.id}`,
        desc: item.desc,
        views: item.stats.playCount,
        likes: item.stats.diggCount,
        shares: item.stats.shareCount,
        comments: item.stats.commentCount,
        uniqueId: item.author.uniqueId,
        nickname: item.author.nickname
      });

      try {
        await fs.access(fullPathView, fok);

        const fileData = await fs.readFile(fullPathView);

        const toSave = JSON.parse(fileData.toString());

        toSave[getCategoryKey(currentCategory)] = [...toSave[getCategoryKey(currentCategory)] ?? [], ...hypedData.map(mapFn)]

        await fs.writeFile(fullPathView, JSON.stringify(toSave));
      } catch (e) {
        if (e instanceof Error) {
          if (e.message.includes('no such file or directory')) {
            await fs.writeFile(fullPathView, JSON.stringify({ [getCategoryKey(currentCategory)]: hypedData.map(mapFn)}));
          } else {
            console.error(e);
          }
        }
      }

      await page.evaluate(() => {
        // @ts-ignore: Cannot find name 'window'
        window.scrollTo(0, window.document.body.scrollHeight);
      });

      registers += hypedData.length;
    }

    const endBrowser = async () => {
      await fs.access(fullPathView, fok);

      const fileData = await fs.readFile(fullPathView);

      const entries = Object.entries(JSON.parse(fileData.toString()));

      const sortFn = ({ likes: a }: statItemsType, { likes: b }: statItemsType) => a - b;

      const sorted = entries
        .map(([k, v]: [string, any]) => [k, v.sort(sortFn).slice(0, video_num)]);

      await fs.writeFile(fullPathView, JSON.stringify(Object.fromEntries(sorted)));

      await browser.close();
    }

    const nextCategory = async () => {
      if (categoriesIndex >= categories.length - 1) {
        await endBrowser();

        return;
      }

      registers = 0;
      categoriesIndex += 1;
      currentCategory = categories[categoriesIndex];

      if (!currentCategory) {
        nextCategory();
        return;
      }

      const [button] = await page.$x(`//button[contains(., '${currentCategory}')]`);

      if (button) {
        console.log('-------')
        console.log(`RUNNING | ${currentCategory}`)
        console.time(`DONE    | ${currentCategory}`)
        await button.click();

        await page.evaluate(() => {
          // @ts-ignore: Cannot find name 'window'
          window.scrollTo(0, window.document.body.scrollHeight);
        });

        return;
      }

      console.log(`SKIPPED | ${currentCategory}`)
      nextCategory(); 
    }

    const resURL = `https://www.tiktok.com/api/${goto === 'explore' ? 'explore' : 'recommended'}/item_list/`;

    page.on('response', async (response) => {
      try {
        if (registers >= video_num) {
          console.timeEnd(`DONE    | ${currentCategory}`)
          nextCategory();
        }

        if (response.url().includes(resURL)) {
          const json = await response.json();

          saveData(json);
        }
      } catch (e) { 
        console.error(e);
      }
    });

    await page.goto(`https://www.tiktok.com/${goto}`);

    await page.setViewport({ width: 1080, height: 1024 });

    await page.waitForSelector('div[data-e2e="explore-card-video-caption"]');

    await page.evaluate(() => {
      setInterval(() => {
        // @ts-ignore: Cannot find name 'window'
        window.scrollTo(0, window.document.body.scrollHeight);
      }, 1);
    });
  }
}
