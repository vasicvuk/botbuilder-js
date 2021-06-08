/**
 * @module botbuilder-lg
 */
/**
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */
import { Diagnostic } from './diagnostic';

/**
 * LG Exception that contains diagnostics.
 */
export class TemplateException extends Error {
    private diagnostics: Diagnostic[];

    /**
     * Creates a new instance of the [TemplateException](xref:botbuilder-lg.TemplateException) class.
     *
     * @param m Error message.
     * @param diagnostics List of [Diagnostic](xref:botbuilder-lg.Diagnostic) to throw.
     */
    constructor(m: string, diagnostics: Diagnostic[]) {
        super(m);
        this.diagnostics = diagnostics;
        Object.setPrototypeOf(this, TemplateException.prototype);
    }

    /**
     * Get the [TemplateException](xref:botbuilder-lg.TemplateException) instance's [Diagnostics](xref:botbuilder-lg.Diagnostic).
     *
     * @returns An array of [Diagnostic](xref:botbuilder-lg.Diagnostic) instances.
     */
    getDiagnostic(): Diagnostic[] {
        return this.diagnostics;
    }
}
