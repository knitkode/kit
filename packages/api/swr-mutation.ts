/* eslint-disable import/order */
"use client";

import useSWRMutation, {
  type SWRMutationConfiguration,
  type SWRMutationResponse,
} from "swr/mutation";
import { createApi } from "./index";
import { createUseApi } from "./swr";

/* eslint-disable import/order */

/// <reference types="./typings.d.ts" />

type MutationRequestMethod = Exclude<Koine.Api.RequestMethod, "get">;
type MutationHookName = Exclude<keyof Koine.Api.HooksMapsByName, "use">;

type KoineApiMethodHookSWR<
  THookName extends MutationHookName,
  TEndpoints extends Koine.Api.Endpoints,
> = <
  TEndpoint extends Koine.Api.EndpointUrl<TEndpoints>,
  TMethod extends MutationRequestMethod = Koine.Api.HooksMapsByName[THookName],
>(
  endpoint: TEndpoint,
  options?: Koine.Api.EndpointOptions<TEndpoints, TEndpoint, TMethod>,
  config?: SWRMutationConfiguration<
    Koine.Api.EndpointResponseOk<TEndpoints, TEndpoint, TMethod>,
    Koine.Api.EndpointResponseFail<TEndpoints, TEndpoint, TMethod>,
    TEndpoint,
    Koine.Api.EndpointOptions<TEndpoints, TEndpoint, TMethod>
  >,
) => SWRMutationResponse<
  Koine.Api.EndpointResponseOk<TEndpoints, TEndpoint, TMethod>,
  Koine.Api.EndpointResponseFail<TEndpoints, TEndpoint, TMethod>,
  TEndpoint,
  Koine.Api.EndpointOptions<TEndpoints, TEndpoint, TMethod>
>;

let createUseMutationApi =
  <
    TEndpoints extends Koine.Api.Endpoints,
    TMethod extends MutationRequestMethod,
  >(
    api: Koine.Api.Client<TEndpoints>,
    method: TMethod,
  ) =>
  <TEndpoint extends Koine.Api.EndpointUrl<TEndpoints>>(
    endpoint: TEndpoint,
    options?: Koine.Api.EndpointOptions<TEndpoints, TEndpoint, TMethod>,
    config?: SWRMutationConfiguration<
      Koine.Api.EndpointResponseOk<TEndpoints, TEndpoint, TMethod>,
      Koine.Api.EndpointResponseFail<TEndpoints, TEndpoint, TMethod>,
      TEndpoint,
      Koine.Api.EndpointOptions<TEndpoints, TEndpoint, TMethod>
    >,
  ) => {
    const sender = async (
      // if the first argument is an array the second one are the base options
      // defined when calling the usePost/Put/etc. hook, these will be overriden
      // by the _options just here below
      _endpoint:
        | [TEndpoint, Koine.Api.EndpointOptions<TEndpoints, TEndpoint, TMethod>]
        | TEndpoint,
      // these are the options arriving when calling `trigger({ json, query, etc... })
      _options: Readonly<{
        arg: Koine.Api.EndpointOptions<TEndpoints, TEndpoint, TMethod>;
      }>,
    ) => {
      const endpoint = Array.isArray(_endpoint) ? _endpoint[0] : _endpoint;
      const options = Array.isArray(_endpoint) ? _endpoint[1] : {};
      const { ok, data } = await api[method](endpoint, {
        ...options,
        ...(_options.arg || {}),
        throwErr: true,
      });
      return ok ? data : data;
    };

    // config.fetcher = sender;

    // eslint-disable-next-line react-hooks/rules-of-hooks
    return useSWRMutation<
      Koine.Api.EndpointResponseOk<TEndpoints, TEndpoint, TMethod>,
      Koine.Api.EndpointResponseFail<TEndpoints, TEndpoint, TMethod>,
      TEndpoint,
      Koine.Api.EndpointOptions<TEndpoints, TEndpoint, TMethod>
    >(
      // @ts-expect-error FIXME: I can't get it...
      options ? [endpoint, options] : endpoint,
      sender,
      config,
    );
  };

/**
 * It creates an api client extended with auto-generated SWR wrapper hooks
 */
export let createSwrMutationApi = <TEndpoints extends Koine.Api.Endpoints>(
  ...args: Parameters<typeof createApi>
) => {
  const api = createApi<TEndpoints>(...args) as Koine.Api.Client<TEndpoints> & {
    [HookName in MutationHookName]: KoineApiMethodHookSWR<HookName, TEndpoints>;
  } & {
    use: ReturnType<typeof createUseApi<TEndpoints>>;
  };

  api.use = createUseApi(api);

  (["post", "put", "patch", "delete"] as MutationRequestMethod[]).forEach(
    <TMethod extends MutationRequestMethod>(method: TMethod) => {
      const hookName = `use${
        method.charAt(0).toUpperCase() + method.slice(1)
      }` as MutationHookName;
      api[hookName] = createUseMutationApi<TEndpoints, TMethod>(
        api,
        method,
      ) as KoineApiMethodHookSWR<typeof hookName, TEndpoints>;
    },
  );

  return api;
};
