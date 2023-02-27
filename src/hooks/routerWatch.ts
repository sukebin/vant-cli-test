// 还存在问题，需改进
import { watch, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';

export const routerWatch = () => {
  const route = useRoute();
  const router = useRouter();
  const curRecdPage = ref(route?.query._recdPage || 0);
  watch(route, (to, from) => {
    const { query: fromQuery, name: fromName } = from;
    const { query: toQuery, name: toName } = to;
    if (fromName !== toName) return; // 仅监听相同路由名的切换，路由名不相同不处理

    const { _recdPage: fromRecdPage } = fromQuery;
    const { _recdPage: toRecdPage } = toQuery;
    if (!fromRecdPage && !toRecdPage) return; // 没有 _recdPage参数标记 也不处理
    if (toRecdPage) {
      if (toRecdPage > curRecdPage.value) {
        console.log('前进');
      } else {
        console.log('后退');
        // onRouterBack()
      }
      curRecdPage.value = toRecdPage;
    } else {
      console.log('后退', curRecdPage.value);
      curRecdPage.value = 0;
      // onRouterBack()
    }
  });

  const compPush = () => {
    const { query, name } = route;
    curRecdPage.value = route?.query._recdPage || 0;
    router.push({
      name: name!,
      query: { ...query, _recdPage: Number(curRecdPage.value) + 1 },
    });
  };

  return {
    route,
    router,
    compPush,
    curRecdPage,
  };
};
