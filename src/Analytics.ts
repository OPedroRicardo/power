import Scrapper from './services/Scrapper';
import setAssets from './setAssets';

setAssets().then(() => {
  Scrapper.init();
});
