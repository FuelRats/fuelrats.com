import { NextComponentType, NextPageContext } from "next"
import { AppPropsType, BaseContext } from "next/dist/next-server/lib/utils"
import { NextRouter } from "next/router"

/**
 * Meta object for pages. Allowed response values for the `static getPageMeta()` function on page components
 */
export interface FRPageMeta {
  className?: string;
  description?: string;
  displayTitle?: string;
  forceDrawer?: boolean;
  key?: string;
  noHeader?: boolean;
  title: string;
}

/**
 * NextComponentType extension to add `static getPageMeta()`
 */
export declare type FRPageComponent<C extends BaseContext = NextPageContext, IP = {}, P = {}> = NextComponentType<C, IP, P> & {
  getPageMeta(pageProps: any, appProps: AppPropsType<NextRouter, P>): FRPageMeta;
}
