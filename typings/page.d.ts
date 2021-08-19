import { NextComponentType, NextPageContext } from "next"
import { AppPropsType, BaseContext } from "next/dist/next-server/lib/utils"
import { NextRouter } from "next/router"

/**
 * Meta object for pages. Allowed response values for the `static getPageMeta()` function on page components
 */
export interface PartialPageMeta {
  className?: string;
  description: string;
  headerTitle?: string;
  forceDrawer?: boolean;
  key?: string;
  noHeader?: boolean;
  title: string;
}

/**
 * Meta object for pages. Allowed response values for the `static getPageMeta()` function on page components
 */
export interface FRPageMeta extends PartialPageMeta {
  key: string;
  className: string;
}


/**
 * NextComponentType extension to add `static getPageMeta()`
 */
export declare type FRPageComponent<C extends BaseContext = NextPageContext, IP = {}, P = {}> = NextComponentType<C, IP, P> & {
  getPageMeta(pageProps: any, appProps: AppPropsType<NextRouter, P>): PartialPageMeta;
}
