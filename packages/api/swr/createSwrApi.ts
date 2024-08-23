"use client";

import useSWR, {
  type BareFetcher,
  type SWRConfiguration,
  type SWRResponse,
} from "swr";
import { isFunction } from "@koine/utils";
import { createApi } from "../createApi";
import type { Api } from "../types";

type SWRConfigurationExtended<
  Data = any,
  Error = any,
  Fn extends BareFetcher<any> = BareFetcher<any>,
> = SWRConfiguration<Data, Error, Fn> & {
  /**
   * Conditional fetching as option
   *
   * Moving this to an option allows us to keep the endpoints typed dictionary,
   * e.g. we can write:
   *
   * ```js
   * const { data, mutate } = myApi.use("User/{id}",
   *  { params: { id: aVariableMaybeContainingAnId || "" }, },
   *  { when: !!aVariableMaybeContainingAnId }
   * );
   *
   * // we still have typed `data`, `mutate`
   * ```
   * @see https://swr.vercel.app/docs/conditional-fetching
   */
  when?: boolean | (() => boolean);
};

/**
 * @private
 */
export let createUseApi =
  <TEndpoints extends Api.Endpoints>(
    api: Api.Client<TEndpoints>,
    defaultSwrConfig?: SWRConfigurationExtended,
  ) =>
  /**
   * Api SWR wrapped hook
   *
   * @param endpoint Endpoint URL string
   * @param options {@link Api.EndpointOptions API endpoint options}
   * @param swrConfig {@link SWRConfigurationExtended Extended SWR configuration}
   */
  <TEndpoint extends Api.EndpointUrl<TEndpoints>>(
    endpoint: TEndpoint,
    options?: Api.EndpointOptions<TEndpoints, TEndpoint, "get">,
    swrConfig?: SWRConfigurationExtended<
      Api.EndpointResponseOk<TEndpoints, TEndpoint, "get">,
      Api.EndpointResponseFail<TEndpoints, TEndpoint, "get">
    >,
  ) => {
    const swrConfigResolved = {
      ...(defaultSwrConfig || {}),
      ...(swrConfig || {}),
    };
    // const fetcher = async (_endpoint: TEndpoint) => {
    //   try {
    //     const { ok, data } = await api.get(_endpoint, {
    //         ...(options || {}),
    //         throwErr: true,
    //       });
    //       if (ok) {
    //         return data;
    //       }
    //       throw new Error() as unknown as Api.EndpointResponseFail<TEndpoints, TEndpoint, TMethod>;
    //     } catch(e) {
    //       throw new Error() as unknown as Api.EndpointResponseFail<TEndpoints, TEndpoint, TMethod>;;
    //     }
    //   };
    // }

    const fetcher = async () => {
      const { data } = await api.get(endpoint, {
        ...(options || {}),
        throwErr: true,
      });
      return data as Api.EndpointResponseOk<TEndpoints, TEndpoint, "get">;
    };

    const shouldNotFetch =
      swrConfigResolved?.when === false ||
      (isFunction(swrConfigResolved?.when) &&
        swrConfigResolved?.when() === false);

    // <Data = any, Error = any>(key: Key, config: SWRConfigurationExtended<Data, Error, Fetcher<Data>> | undefined): SWRResponse<Data, Error>;

    return useSWR<
      Api.EndpointResponseOk<TEndpoints, TEndpoint, "get">,
      Api.EndpointResponseFail<TEndpoints, TEndpoint, "get">
    >(
      shouldNotFetch ? null : options ? [endpoint, options] : [endpoint],
      fetcher,
      swrConfigResolved,
    ) as SWRResponse<
      Api.EndpointResponseOk<TEndpoints, TEndpoint, "get">,
      Api.EndpointResponseFail<TEndpoints, TEndpoint, "get">
    >;
  };

/**
 * It creates an api client extended with auto-generated SWR wrapper hooks
 */
export let createSwrApi = <TEndpoints extends Api.Endpoints>(
  apiName: string,
  baseUrl: string,
  defaultOptions?: Api.ClientOptions,
  defaultSwrConfig?: SWRConfigurationExtended,
  // ...args: Parameters<typeof createApi>
) => {
  const api = createApi<TEndpoints>(
    apiName,
    baseUrl,
    defaultOptions,
  ) as Api.Client<TEndpoints> & {
    // const api = createApi<TEndpoints>(...args) as Api.Client<TEndpoints> & {
    use: ReturnType<typeof createUseApi<TEndpoints>>;
  };

  api.use = createUseApi<TEndpoints>(api, defaultSwrConfig);

  return api;
};

export default createSwrApi;
