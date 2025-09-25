/* eslint-disable @typescript-eslint/no-parameter-properties */
import type { RefObject } from 'react';
import { isFunction } from '../../utils';
import type { FetchState, Options, PluginReturn, Service, Subscribe } from './types';

export default class Fetch<TData, TParams extends any[]> {
  pluginImpls: PluginReturn<TData, TParams>[];

  count: number = 0;

  state: FetchState<TData, TParams> = {
    loading: false,
    params: undefined,
    data: undefined,
    error: undefined,
  };

  constructor(
    public serviceRef: RefObject<Service<TData, TParams>>,
    public options: Options<TData, TParams>,
    public subscribe: Subscribe,
    public initState: Partial<FetchState<TData, TParams>> = {},
  ) {
    this.state = {
      ...this.state,
      loading: !options.manual,
      ...initState,
    };
  }

  setState(s: Partial<FetchState<TData, TParams>> = {}) {
    this.state = {
      ...this.state,
      ...s,
    };
    this.subscribe();
  }

  runPluginHandler(event: keyof PluginReturn<TData, TParams>, ...rest: any[]) {
    // @ts-ignore
    const r = this.pluginImpls.map((i) => i[event]?.(...rest)).filter(Boolean);
    return Object.assign({}, ...r);
  }

  /**
   * 发起异步请求，支持竞态取消和组件卸载时忽略响应
   */
  async runAsync(...params: TParams): Promise<TData> {
    // 每次请求前自增 count，作为本次请求的唯一标识
    this.count += 1;
    const currentCount = this.count;

    // 触发插件的 onBefore，可能返回 stopNow/returnNow 控制请求流程
    const {
      stopNow = false,
      returnNow = false,
      ...state
    } = this.runPluginHandler('onBefore', params);

    // 如果 stopNow 为 true，直接返回一个永远 pending 的 Promise
    if (stopNow) {
      return new Promise(() => {});
    }

    this.setState({
      loading: true,
      params,
      ...state,
    });

    // 如果 returnNow 为 true，直接返回缓存数据
    if (returnNow) {
      return Promise.resolve(state.data);
    }

    this.options.onBefore?.(params);

    try {
      // 通过插件 onRequest 可自定义 servicePromise
      let { servicePromise } = this.runPluginHandler('onRequest', this.serviceRef.current, params);

      if (!servicePromise) {
        servicePromise = this.serviceRef.current(...params);
      }

      const res = await servicePromise;

      // 关键：如果 currentCount !== this.count，说明期间有新的请求或被 cancel
      // 此时忽略本次 promise 的响应，返回一个永远 pending 的 Promise
      if (currentCount !== this.count) {
        // 防止在组件卸载或新请求后，旧 promise 结果影响 state
        return new Promise(() => {});
      }

      // 只有最新的请求才会走到这里，更新数据
      this.setState({
        data: res,
        error: undefined,
        loading: false,
      });

      this.options.onSuccess?.(res, params);
      this.runPluginHandler('onSuccess', res, params);

      this.options.onFinally?.(params, res, undefined);

      if (currentCount === this.count) {
        this.runPluginHandler('onFinally', params, res, undefined);
      }

      return res;
    } catch (error) {
      // 同理，异常时也要判断是否为最新请求
      if (currentCount !== this.count) {
        // 忽略旧 promise 的异常响应
        return new Promise(() => {});
      }

      this.setState({
        error,
        loading: false,
      });

      this.options.onError?.(error, params);
      this.runPluginHandler('onError', error, params);

      this.options.onFinally?.(params, undefined, error);

      if (currentCount === this.count) {
        this.runPluginHandler('onFinally', params, undefined, error);
      }

      throw error;
    }
  }

  /**
   * run 是 runAsync 的同步封装，异常自动兜底
   */
  run(...params: TParams) {
    this.runAsync(...params).catch((error) => {
      if (!this.options.onError) {
        console.error(error);
      }
    });
  }

  /**
   * 取消当前请求（包括组件卸载时自动调用）
   * 通过自增 count，使之前的 promise 响应全部失效
   */
  cancel() {
    this.count += 1; // 只要 count 变化，之前的 promise 响应都会被 runAsync 忽略
    this.setState({
      loading: false,
    });

    this.runPluginHandler('onCancel');
  }

  /**
   * 使用上一次的参数重新发起请求
   */
  refresh() {
    // @ts-ignore
    this.run(...(this.state.params || []));
  }

  /**
   * refresh 的异步版本
   */
  refreshAsync() {
    // @ts-ignore
    return this.runAsync(...(this.state.params || []));
  }

  /**
   * 立即变更数据
   */
  mutate(data?: TData | ((oldData?: TData) => TData | undefined)) {
    const targetData = isFunction(data) ? data(this.state.data) : data;
    this.runPluginHandler('onMutate', targetData);
    this.setState({
      data: targetData,
    });
  }
}
