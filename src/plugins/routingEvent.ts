import type {
  RouteLocationNormalized,
  Router,
  LocationQuery,
} from 'vue-router';
import type { App, AppContext } from 'vue';

const BODY_LOCK_CLASS = 'van-overflow-hidden';
export class RoutingEvent {
  router;

  curRecdPage = 0;

  private routerEventMap = new Map();

  constructor(router: Router) {
    this.router = router;
  }

  /**
   * @description:
   * @param {function} fn 物理键返回需要执行的方法
   * @param {LocationQuery} queryParams 附加参数
   * @return {*}
   */
  compPush(fn: () => void, queryParams: LocationQuery = {}) {
    const route = this.router.currentRoute.value;
    const { query, name } = route;
    const curRecdPage = this.curRecdPage || query._recdPage || 0;
    const pushPage = Number(curRecdPage) + 1;
    this.curRecdPage = pushPage;
    this.setBodyLock();
    if (fn) {
      this.routerEventMap.set(`_recdPage${pushPage}`, fn);
    }
    this.router.push({
      query: { ...query, ...queryParams, _recdPage: pushPage },
      name: name!,
    });
  }

  routerBack(to: RouteLocationNormalized, from: RouteLocationNormalized) {
    const {
      query: { _recdPage: toRecdPage },
      name: toName,
    } = to;
    const {
      query: { _recdPage: fromRecdPage },
      name: fromName,
    } = from;
    const mapKey = `_recdPage${fromRecdPage}`;
    if (
      toName === fromName &&
      Number(toRecdPage || 0) < Number(fromRecdPage || 0)
    ) {
      const fn = this.routerEventMap.get(mapKey);
      this.curRecdPage = Number(fromRecdPage) - 1;

      if (fn) {
        fn();
        this.routerEventMap.delete(mapKey);
      }
      if (this.curRecdPage === 0) {
        this.removeBodyLock();
      }
    }
  }

  setBodyLock() {
    document.body.classList.add(BODY_LOCK_CLASS);
  }

  removeBodyLock() {
    document.body.classList.remove(BODY_LOCK_CLASS);
  }
}

// 路由插件，主要用于弹窗时物理键返回处理
export const routingEventPlugin = {
  // main工程使用
  install(app: App) {
    const router = app.config.globalProperties.$router;
    window.navigatorEvent = new RoutingEvent(router);
    router.beforeEach(
      (to: RouteLocationNormalized, from: RouteLocationNormalized) => {
        window.navigatorEvent.routerBack(to, from);
      }
    );
  },
  // 组件库使用
  installAppContext(app: AppContext) {
    const router = app.config.globalProperties.$router;
    window.navigatorEvent = new RoutingEvent(router);
    router.beforeEach(
      (to: RouteLocationNormalized, from: RouteLocationNormalized) => {
        window.navigatorEvent.routerBack(to, from);
      }
    );
  },
};
