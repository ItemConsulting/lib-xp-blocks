import type { Response, ResponseBody } from "@enonic-types/core";
import { forceArray } from "./utils";

export function concat(x: Response, y: Response): Response {
  return {
    status: x.status || y.status ? Math.max(x.status ?? 200, y.status ?? 200) : undefined,
    body: concatResponseBody(x.body, y.body),
    headers:
      x.headers || y.headers
        ? {
            ...y.headers,
            ...x.headers,
          }
        : undefined,
    pageContributions:
      x.pageContributions || y.pageContributions
        ? {
            headBegin: forceArrayConcat(x.pageContributions?.headBegin, y.pageContributions?.headBegin),
            headEnd: forceArrayConcat(x.pageContributions?.headEnd, y.pageContributions?.headEnd),
            bodyBegin: forceArrayConcat(x.pageContributions?.bodyBegin, y.pageContributions?.bodyBegin),
            bodyEnd: forceArrayConcat(x.pageContributions?.bodyEnd, y.pageContributions?.bodyEnd),
          }
        : undefined,
    redirect: x.redirect ?? y.redirect,
    applyFilters: x.applyFilters ?? y.applyFilters,
    postProcess: x.postProcess ?? y.postProcess,
    contentType: x.contentType ?? y.contentType,
    cookies: {
      ...y.cookies,
      ...x.cookies,
    },
  };
}

export function concatResponseBody(x: ResponseBody | undefined, y: ResponseBody | undefined): ResponseBody {
  return responseBodyToString(x).concat(responseBodyToString(y));
}

export function responseBodyToString(responseBody: ResponseBody = ""): string {
  return typeof responseBody === "string" ? responseBody : JSON.stringify(responseBody);
}

function forceArrayConcat<T>(x: T | T[] | undefined, y: T | T[] | undefined): T[] {
  return forceArray(x).concat(forceArray(y));
}
