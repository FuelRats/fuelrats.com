// Types listed in the PropTypes pseudo-class are derived from @types/prop-types
// https://github.com/DefinitelyTyped/DefinitelyTyped/tree/master/types/prop-types
//
// MIT License
//
// Copyright (c) Microsoft Corporation.
//
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in all
// copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
// SOFTWARE


import "prop-types";

declare module "prop-types" {
  export default class PropTypes {
    static any: Requireable<any>;
    static array: Requireable<any[]>;
    static bool: Requireable<boolean>;
    static func: Requireable<(...args: any[]) => any>;
    static number: Requireable<number>;
    static object: Requireable<object>;
    static string: Requireable<string>;
    static node: Requireable<ReactNodeLike>;
    static element: Requireable<ReactElementLike>;
    static symbol: Requireable<symbol>;
    static elementType: Requireable<ReactComponentLike>;
    static instanceOf<T>(expectedClass: new (...args: any[]) => T): Requireable<T>;
    static oneOf<T>(types: ReadonlyArray<T>): Requireable<T>;
    static oneOfType<T extends Validator<any>>(types: T[]): Requireable<NonNullable<InferType<T>>>;
    static arrayOf<T>(type: Validator<T>): Requireable<T[]>;
    static objectOf<T>(type: Validator<T>): Requireable<{ [K in keyof any]: T; }>;
    static shape<P extends ValidationMap<any>>(type: P): Requireable<InferProps<P>>;
    static exact<P extends ValidationMap<any>>(type: P): Requireable<Required<InferProps<P>>>;

    static checkPropTypes(typeSpecs: any, values: any, location: string, componentName: string, getStack?: () => any): void;

    static resetWarningCache(): void;
  }
}
