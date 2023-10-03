import LiveRouter from './routers/LiveRouter';
import setAssets from './setAssets';

setAssets().then(() => {
  const router = new LiveRouter();

  router.init();
});
