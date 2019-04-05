// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { BugFilingService } from './types/bug-filing-service';
export class BugFilingServiceProvider {
    private static instance: BugFilingServiceProvider;
    private readonly services: BugFilingService[];

    private constructor() {
        this.services = [];
    }

    public getInstance() {
        if (BugFilingServiceProvider.instance === null) {
            BugFilingServiceProvider.instance = new BugFilingServiceProvider();
        }

        return BugFilingServiceProvider.instance;
    }

    public addService(service: BugFilingService): void {
        this.services.push(service);
    }

    public all(): BugFilingService[] {
        return this.services.slice();
    }
}
