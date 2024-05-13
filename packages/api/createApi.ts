import {
  type AnyQueryParams,
  buildUrlQueryString,
  errorToString,
  isFullObject,
} from "@koine/utils";
import type { Api } from "./types";

let apiMethods = [
  "get",
  "post",
  "put",
  "patch",
  "delete",
] as Api.RequestMethod[];

/**
 * Create api client
 *
 * @param apiName Short name to use in debug logs
 * @param baseUrl Either relativ eor absolute, it must end without trailing slash
 */
export let createApi = <TEndpoints extends Api.Endpoints>(
  apiName: string,
  baseUrl: string,
  options?: Api.ClientOptions,
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
    <TMethod extends Api.RequestMethod>(
      api: Api.Client<TEndpoints>,
      method: TMethod,
    ) => {
      // @ts-expect-error FIXME: type
      api[method] = async <
        TEndpoint extends Api.EndpointUrl<TEndpoints>,
        TOptions extends Api.EndpointOptions<
          TEndpoints,
          TEndpoint,
          TMethod
        > = Api.EndpointOptions<TEndpoints, TEndpoint, TMethod>,
        TResponseOk extends Api.ResponseOk = Api.EndpointResponseOk<
          TEndpoints,
          TEndpoint,
          TMethod
        >,
        TResponseFail extends Api.ResponseFail = Api.EndpointResponseFail<
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
            // TODO: not the greatest assertion...
            url = url.replace(`{${key}}`, params[key] as string);
          }
        }

        const timeoutNumber = Number(timeout);
        let controller: AbortController;
        let timeoutId;

        if (json) {
          requestInit.body = JSON.stringify(json);
        }
        if (timeoutNumber > 0) {
          // TODO: combine multiple abort signals
          // @see https://dev.to/rashidshamloo/adding-timeout-and-multiple-abort-signals-to-fetch-typescriptreact-33bb
          controller = new AbortController();
          timeoutId = setTimeout(() => controller.abort(), timeoutNumber);
          requestInit.signal = controller.signal;
        }

        if (query) {
          // FIXME: ts-expect-error this assertion is not the best, but nevermind for now
          url += buildUrlQueryString(query as unknown as AnyQueryParams);
        }

        let response: null | Response = null;
        let result: null | Api.Result<TResponseOk, TResponseFail> = null;
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
              result = await processRes<TResponseOk, TResponseFail>(
                response,
                options || {},
              );
            } else {
              result = await response.json();
            }
          } catch (e) {
            msg = errorToString(e);
          }
        }

        if (result === null) {
          if (processErr) {
            result = await processErr<TResponseOk, TResponseFail>(
              msg,
              options || {},
            );
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
            } as Api.ResultFail<TResponseFail>;
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
    {} as Api.Client<TEndpoints>,
  );
};

export default createApi;
