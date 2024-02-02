import {
  type AnyQueryParams,
  buildUrlQueryString,
  errorToString,
  isFullObject,
} from "@koine/utils";

/**
 * Custom `ApiError` class extending `Error` to throw in failed response.
 *
 * @see https://eslint.org/docs/rules/no-throw-literal
 * @see https://github.com/sindresorhus/ky/blob/main/source/errors/HTTPError.ts
 *
 */
export class ApiError<
  TResponseFail extends Koine.Api.ResponseFail = unknown,
> extends Error {
  constructor(result: Koine.Api.ResultFail<TResponseFail>) {
    super(`Request failed with ${result.status} ${result.msg}`);
    this.name = "ApiError";
    Object.assign(this, result);
  }
}

export let createApiResultOk = <T>(
  data: T = {} as T,
  msg?: string,
): Koine.Api.ResultOk<T> => ({
  ok: true,
  fail: false,
  data,
  msg: msg || "",
  status: 200,
});

export let createApiResultFail = <T>(
  data: T = {} as T,
  msg?: string,
  status?: number,
): Koine.Api.ResultFail<T> => ({
  fail: true,
  data,
  msg: msg || "",
  status: status || 404,
});

export let apiMethods = [
  "get",
  "post",
  "put",
  "patch",
  "delete",
] as Koine.Api.RequestMethod[];

/**
 * Create api client
 *
 * @param apiName Short name to use in debug logs
 * @param baseUrl Either relativ eor absolute, it must end without trailing slash
 */
export let createApi = <TEndpoints extends Koine.Api.Endpoints>(
  apiName: string,
  baseUrl: string,
  options?: Koine.Api.ClientOptions,
) => {
  const {
    headers: headersBase = {},
    request: requestBase = {},
    throwErr: throwErrBase,
    timeout: timeoutBase = 10000,
    processReq: processReqBase,
    processRes: processResBase,
    processErr: processErrBase,
  } = options || {};

  return apiMethods.reduce(
    <TMethod extends Koine.Api.RequestMethod>(
      api: Koine.Api.Client<TEndpoints>,
      method: TMethod,
    ) => {
      // @ts-expect-error FIXME: type
      api[method] = async <
        TEndpoint extends Koine.Api.EndpointUrl<TEndpoints>,
        TOptions extends Koine.Api.EndpointOptions<
          TEndpoints,
          TEndpoint,
          TMethod
        > = Koine.Api.EndpointOptions<TEndpoints, TEndpoint, TMethod>,
        TResponseOk extends Koine.Api.ResponseOk = Koine.Api.EndpointResponseOk<
          TEndpoints,
          TEndpoint,
          TMethod
        >,
        TResponseFail extends
          Koine.Api.ResponseFail = Koine.Api.EndpointResponseFail<
          TEndpoints,
          TEndpoint,
          TMethod
        >,
      >(
        endpoint: TEndpoint,
        options?: TOptions,
      ) => {
        const {
          request = requestBase,
          headers = headersBase,
          timeout = timeoutBase,
          processReq,
          processRes = processResBase,
          processErr = processErrBase,
          throwErr = throwErrBase,
        } = options || {};
        let { params, json, query } = options || {};

        let url = `${baseUrl}/${endpoint + "".replace(/^\/*/, "")}`;
        let requestInit: RequestInit = {
          method: method.toUpperCase(),
          ...request,
          headers: {
            "content-type": "application/json",
            ...headers,
          },
        };

        if (processReqBase) {
          const transformed = processReqBase(
            method,
            url,
            query,
            json,
            params,
            requestInit,
          );
          url = transformed[0];
          query = transformed[1] as typeof query;
          json = transformed[2] as typeof json;
          params = transformed[3] as typeof params;
          requestInit = transformed[4];
        }

        if (processReq) {
          const transformed = processReq(
            method,
            url,
            query,
            json,
            params,
            requestInit,
          );
          url = transformed[0];
          query = transformed[1] as typeof query;
          json = transformed[2] as typeof json;
          params = transformed[3] as typeof params;
          requestInit = transformed[4];
        }

        if (isFullObject(params)) {
          for (const key in params) {
            url = url.replace(`{${key}}`, params[key].toString());
          }
        }

        const timeoutNumber = Number(timeout);
        let controller: AbortController;
        let timeoutId;

        if (json) {
          requestInit.body = JSON.stringify(json);
        }
        if (timeoutNumber > 0) {
          controller = new AbortController();
          timeoutId = setTimeout(() => controller.abort(), timeoutNumber);
          requestInit.signal = controller.signal;
        }

        if (query) {
          // FIXME: ts-expect-error this assertion is not the best, but nevermind for now
          url += buildUrlQueryString(query as unknown as AnyQueryParams);
        }

        let response: null | Response = null;
        let result: null | Koine.Api.Result<TResponseOk, TResponseFail> = null;
        let msg = "";

        try {
          response = await fetch(url, requestInit);
        } catch (e) {
          msg = errorToString(e);
        }

        if (timeoutId) {
          clearTimeout(timeoutId);
        }

        if (response) {
          try {
            if (processRes) {
              result = await processRes<TResponseOk>(response, options || {});
            } else {
              result = await response.json();
            }
          } catch (e) {
            msg = errorToString(e);
          }
        }

        if (result === null) {
          if (processErr) {
            result = await processErr<TResponseFail>(msg, options || {});
          } else {
            // this error should only happen on network errors or wrong API urls
            // there is no specific HTTP error for this, we can consider these
            // two statuses though:
            // - [100 Continue](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/100)
            // - [501 Not Implemented](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/501)
            result = {
              data: null,
              msg,
              status: 100,
              fail: true,
              ok: false,
            } as Koine.Api.ResultFail<TResponseFail>;
          }
        }

        if (throwErr && result?.fail) {
          // throw new ApiError<Failed>(result);
          // I prefer to throw an object literal despite what eslint says
          // eslint-disable-next-line no-throw-literal
          throw result;
        }

        if (process.env["NODE_ENV"] === "development") {
          const logMsg = `${result?.status}: api[${apiName}] ${method.toUpperCase()} ${url}`;
          if (result?.ok) {
            console.info(`🟢 ${logMsg}`);
          } else {
            console.info(`🔴 ${logMsg}`);
          }
        }
        return result;
      };
      return api;
    },
    {} as Koine.Api.Client<TEndpoints>,
  );
};
