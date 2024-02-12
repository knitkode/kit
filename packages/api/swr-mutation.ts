/* eslint-disable import/order */
"use client";

import useSWRMutation, {
  type SWRMutationConfiguration,
  type SWRMutationResponse,
} from "swr/mutation";
import { createApi } from "./index";
import { createUseApi } from "./swr";
import type { Api } from "./types";

/* eslint-disable import/order */

/* eslint-disable import/order */

/* eslint-disable import/order */

/* eslint-disable import/order */

/* eslint-disable import/order */

/* eslint-disable import/order */

type MutationRequestMethod = Exclude<Api.RequestMethod, "get">;
type MutationHookName = Exclude<keyof Api.HooksMapsByName, "use">;

type KoineApiMethodHookSWR<
  THookName extends MutationHookName,
  TEndpoints extends Api.Endpoints,
> = <
  TEndpoint extends Api.EndpointUrl<TEndpoints>,
  TMethod extends MutationRequestMethod = Api.HooksMapsByName[THookName],
>(
  endpoint: TEndpoint,
  options?: Api.EndpointOptions<TEndpoints, TEndpoint, TMethod>,
  config?: SWRMutationConfiguration<
    Api.EndpointResponseOk<TEndpoints, TEndpoint, TMethod>,
    Api.EndpointResponseFail<TEndpoints, TEndpoint, TMethod>,
    TEndpoint,
    Api.EndpointOptions<TEndpoints, TEndpoint, TMethod>
  >,
) => SWRMutationResponse<
  Api.EndpointResponseOk<TEndpoints, TEndpoint, TMethod>,
  Api.EndpointResponseFail<TEndpoints, TEndpoint, TMethod>,
  TEndpoint,
  Api.EndpointOptions<TEndpoints, TEndpoint, TMethod>
>;

let createUseMutationApi =
  <TEndpoints extends Api.Endpoints, TMethod extends MutationRequestMethod>(
    api: Api.Client<TEndpoints>,
    method: TMethod,
  ) =>
  <TEndpoint extends Api.EndpointUrl<TEndpoints>>(
    endpoint: TEndpoint,
    options?: Api.EndpointOptions<TEndpoints, TEndpoint, TMethod>,
    config?: SWRMutationConfiguration<
      Api.EndpointResponseOk<TEndpoints, TEndpoint, TMethod>,
      Api.EndpointResponseFail<TEndpoints, TEndpoint, TMethod>,
      TEndpoint,
      Api.EndpointOptions<TEndpoints, TEndpoint, TMethod>
    >,
  ) => {
    const sender = async (
      // if the first argument is an array the second one are the base options
      // defined when calling the usePost/Put/etc. hook, these will be overriden
      // by the _options just here below
      _endpoint:
        | [TEndpoint, Api.EndpointOptions<TEndpoints, TEndpoint, TMethod>]
        | TEndpoint,
      // these are the options arriving when calling `trigger({ json, query, etc... })
      _options: Readonly<{
        arg: Api.EndpointOptions<TEndpoints, TEndpoint, TMethod>;
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
      Api.EndpointResponseOk<TEndpoints, TEndpoint, TMethod>,
      Api.EndpointResponseFail<TEndpoints, TEndpoint, TMethod>,
      TEndpoint,
      Api.EndpointOptions<TEndpoints, TEndpoint, TMethod>
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
export let createSwrMutationApi = <TEndpoints extends Api.Endpoints>(
  ...args: Parameters<typeof createApi>
) => {
  const api = createApi<TEndpoints>(...args) as Api.Client<TEndpoints> & {
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
