import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class TaxDataService {
    private readonly STORAGE_KEY = 'neuraltax_form1040aC_data';
    private readonly BUSINESS_FLAG_KEY = 'neuraltax_is_business_owner';

    saveTaxData(data: Record<string, unknown>): void {
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(data));
    }

    loadTaxData(): Record<string, unknown> | null {
        const data = localStorage.getItem(this.STORAGE_KEY);
        return data ? JSON.parse(data) : null;
    }

    clearTaxData(): void {
        localStorage.removeItem(this.STORAGE_KEY);
    }

    setBusinessOwner(isBusiness: boolean): void {
        localStorage.setItem(this.BUSINESS_FLAG_KEY, JSON.stringify(isBusiness));
    }

    isBusinessOwner(): boolean {
        const flag = localStorage.getItem(this.BUSINESS_FLAG_KEY);
        return flag ? JSON.parse(flag) : false;
    }
}
