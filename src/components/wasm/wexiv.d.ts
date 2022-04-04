/// <reference types="emscripten" />

import { AnyTypeAnnotation } from "@babel/types";

/** Above will import declarations from @types/emscripten, including Module etc. */

// This will merge to the existing EmscriptenModule interface from @types/emscripten
// If this doesn't work, try globalThis.EmscriptenModule instead.
export interface WexivModule extends EmscriptenModule {
    // Exported from wexiv.cpp
    then(func: (acc: any, rej: any) => void): Promise<any>
}

export default function wexiv(mod?: any): WexivModule;